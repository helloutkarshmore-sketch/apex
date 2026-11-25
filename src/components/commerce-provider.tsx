import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { CartItem } from '@/lib/commerce';
import { catalogOptions } from '@/lib/commerce.functions';

type CommerceContext = { user: User | null; loading: boolean; cart: CartItem[]; wishlist: string[]; addItem: (id:string,quantity?:number) => Promise<void>; setQuantity: (id:string,quantity:number) => Promise<void>; toggleWishlist: (id:string) => Promise<void>; signOut: () => Promise<void> };
const Context = createContext<CommerceContext | null>(null);
export function CommerceProvider({ children }: { children: ReactNode }) {
  const [user,setUser] = useState<User | null>(null); const [loading,setLoading] = useState(true);
  const [cart,setCart] = useState<CartItem[]>([]); const [wishlist,setWishlist] = useState<string[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const queue = useRef<Promise<void>>(Promise.resolve());
  function updateCart(items: CartItem[]) { cartRef.current=items;setCart(items); }
  const queryClient = useQueryClient(); const router = useRouter();
  useEffect(() => {
    let alive = true;
    async function load(next: User | null) {
      if (!alive) return; setUser(next);
      if (next) {
        const raw = localStorage.getItem('apex-guest-cart'); let guest: CartItem[] = [];
        try { const parsed: unknown = JSON.parse(raw ?? '[]'); if (Array.isArray(parsed)) guest = parsed.filter((row): row is CartItem => !!row && typeof row.product_id === 'string' && Number.isInteger(row.quantity) && row.quantity>0 && row.quantity<=100000); } catch { guest=[]; }
        if (guest.length) {
          const existing = await supabase.from('cart_items').select('product_id,quantity').eq('user_id',next.id);
          const merged = guest.map(item => ({ user_id:next.id, product_id:item.product_id, quantity:Math.min(100000,item.quantity+(existing.data?.find(row=>row.product_id===item.product_id)?.quantity ?? 0)) }));
          const result = await supabase.from('cart_items').upsert(merged,{ onConflict:'user_id,product_id' });
          if (!result.error) localStorage.removeItem('apex-guest-cart');
        }
        const [basket,saved] = await Promise.all([supabase.from('cart_items').select('product_id,quantity').eq('user_id',next.id),supabase.from('wishlist_items').select('product_id').eq('user_id',next.id)]);
        if (alive) { updateCart(basket.data ?? []);setWishlist(saved.data?.map(row=>row.product_id) ?? []); }
      } else {
        try { const parsed: unknown = JSON.parse(localStorage.getItem('apex-guest-cart') ?? '[]'); if (alive) updateCart(Array.isArray(parsed) ? parsed.filter((row): row is CartItem => !!row && typeof row.product_id==='string' && Number.isInteger(row.quantity) && row.quantity>0 && row.quantity<=100000) : []); } catch { if (alive) updateCart([]); }
        if (alive) setWishlist([]);
      }
      if (alive) setLoading(false);
    }
    void supabase.auth.getUser().then(({ data })=>load(data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((event,session) => {
      if (!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) return;
      setTimeout(()=> { void load(session?.user ?? null); void router.invalidate(); if (event!=='SIGNED_OUT') void queryClient.invalidateQueries(); },0);
    });
    return ()=> { alive=false;subscription.subscription.unsubscribe(); };
  },[queryClient,router]);
  function mutateQuantity(id:string,resolve:(current:number)=>number,notify=false):Promise<void> {
    const work=queue.current.then(async()=>{
      const quantity=resolve(cartRef.current.find(row=>row.product_id===id)?.quantity??0);
      if (!Number.isInteger(quantity) || quantity<0 || quantity>100000) { toast.error('Enter a valid quantity.'); return; }
      const product=queryClient.getQueryData(catalogOptions.queryKey)?.products.find(p=>p.id===id);
      if(product?.stock!==null && product?.stock!==undefined && quantity>product.stock){toast.error(`Only ${product.stock} ${product.unit} are available.`);return;}
      if (user) {
        const result = quantity===0 ? await supabase.from('cart_items').delete().eq('user_id',user.id).eq('product_id',id) : await supabase.from('cart_items').upsert({ user_id:user.id,product_id:id,quantity },{ onConflict:'user_id,product_id' });
        if (result.error) { toast.error('Your basket could not be updated.');return; }
      }
      const next = [...cartRef.current.filter(row=>row.product_id!==id),...(quantity>0?[{ product_id:id,quantity }]:[])];
      updateCart(next); if (!user) localStorage.setItem('apex-guest-cart',JSON.stringify(next));
      if(notify)toast.success('Added to your basket');
    }).catch(()=>{toast.error('Your basket could not be updated.');});
    queue.current=work;return work;
  }
  function setQuantity(id:string,quantity:number) { return mutateQuantity(id,()=>quantity); }
  function addItem(id:string,quantity=1) { return mutateQuantity(id,current=>current+quantity,true); }
  async function toggleWishlist(id:string) {
    if (!user) { toast.info('Sign in to save products to your wishlist.');return; }
    const saved=wishlist.includes(id);
    const result=saved ? await supabase.from('wishlist_items').delete().eq('user_id',user.id).eq('product_id',id) : await supabase.from('wishlist_items').insert({ user_id:user.id,product_id:id });
    if (result.error) { toast.error('Your wishlist could not be updated.');return; }
    setWishlist(saved?wishlist.filter(value=>value!==id):[...wishlist,id]);
  }
  async function signOut() { const { error }=await supabase.auth.signOut();if(error) toast.error('Unable to sign out.');else { queryClient.removeQueries({ queryKey:['account'] });toast.success('Signed out'); } }
  return <Context.Provider value={{ user,loading,cart,wishlist,addItem,setQuantity,toggleWishlist,signOut }}>{children}</Context.Provider>;
}
export function useCommerce() { const value=useContext(Context);if(!value) throw new Error('Commerce provider is missing');return value; }