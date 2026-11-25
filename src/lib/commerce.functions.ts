import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
import type { Product, Category } from './commerce';

export const getCatalog = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('The product catalog is temporarily unavailable.');
  const client = createClient<Database>(url,key,{ auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input,init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    headers.set('apikey',key); return fetch(input,{ ...init,headers });
  } } });
  const [products,categories,posts] = await Promise.all([
    client.from('products').select('*').eq('published',true).order('name').limit(500),
    client.from('categories').select('*').order('sort_order'),
    client.from('blog_posts').select('slug,title,excerpt,category,image_url,created_at').eq('published',true).order('created_at',{ ascending:false }).limit(50),
  ]);
  if (products.error || categories.error || posts.error) throw new Error('Unable to load the catalog. Please try again.');
  return { products: (products.data ?? []) as unknown as Product[], categories: (categories.data ?? []) as Category[], posts: posts.data ?? [] };
});
export const catalogOptions = queryOptions({ queryKey: ['catalog'], queryFn: () => getCatalog(), staleTime: 60_000 });

export const subscribeNewsletter = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.email().max(255), website: z.string().max(100).default('') }))
  .handler(async ({ data }) => {
    if (data.website) return { success: true };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const identity = getRequestHeader('cf-connecting-ip') ?? getRequestHeader('x-forwarded-for') ?? 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`newsletter:${identity}`));
    const fingerprint = Array.from(new Uint8Array(digest),b => b.toString(16).padStart(2,'0')).join('');
    const { data: allowed, error: limitError } = await supabaseAdmin.rpc('claim_submission',{ _fingerprint: fingerprint });
    if (limitError || !allowed) throw new Error('Please wait a minute before trying again.');
    const { error } = await supabaseAdmin.from('newsletter_subscribers').upsert({ email: data.email.toLowerCase().trim() },{ onConflict:'email',ignoreDuplicates:true });
    if (error) throw new Error('Your subscription could not be saved. Please try again.');
    return { success: true };
  });