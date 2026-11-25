import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const getAccount = createServerFn({ method:'GET' }).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const db=context.supabase;const id=context.userId;
 const [profile,orders,enquiries,addresses,roles]=await Promise.all([db.from('profiles').select('*').eq('id',id).maybeSingle(),db.from('orders').select('*').eq('user_id',id).order('created_at',{ascending:false}),db.from('enquiries').select('id,kind,subject,status,items,quotation,created_at').eq('user_id',id).order('created_at',{ascending:false}),db.from('addresses').select('*').eq('user_id',id),db.from('user_roles').select('role').eq('user_id',id)]);
 if(profile.error||orders.error||enquiries.error||addresses.error||roles.error) throw new Error('Your account could not be loaded.');
 return {profile:profile.data,orders:orders.data??[],enquiries:enquiries.data??[],addresses:addresses.data??[],roles:roles.data?.map(r=>r.role)??[]};
});
export const getAdminData = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data:roles,error}=await context.supabase.from('user_roles').select('role').eq('user_id',context.userId);
 if(error||!roles?.length) throw new Error('Administrator access is required.');
 const names=roles.map(r=>r.role);const all=names.includes('super_admin');const product=all||names.includes('product_admin');const order=all||names.includes('order_admin');const content=all||names.includes('content_admin');
 const db=context.supabase;
 const [products,categories,orders,enquiries,customers,pages,posts,coupons]=await Promise.all([
 product?db.from('products').select('*').order('name').limit(500):Promise.resolve({data:[],error:null}),
 product?db.from('categories').select('*').order('sort_order'):Promise.resolve({data:[],error:null}),
 order?db.from('orders').select('*').order('created_at',{ascending:false}).limit(500):Promise.resolve({data:[],error:null}),
 order?db.from('enquiries').select('*').order('created_at',{ascending:false}).limit(500):Promise.resolve({data:[],error:null}),
 order?db.from('profiles').select('*').limit(500):Promise.resolve({data:[],error:null}),
 content?db.from('cms_pages').select('*').order('title'):Promise.resolve({data:[],error:null}),
 content?db.from('blog_posts').select('*').order('created_at',{ascending:false}).limit(100):Promise.resolve({data:[],error:null}),
 order?db.from('coupons').select('*'):Promise.resolve({data:[],error:null})]);
 if([products,categories,orders,enquiries,customers,pages,posts,coupons].some(r=>r.error)) throw new Error('Store management data could not be loaded.');
 return {roles:names,products:products.data??[],categories:categories.data??[],orders:orders.data??[],enquiries:enquiries.data??[],customers:customers.data??[],pages:pages.data??[],posts:posts.data??[],coupons:coupons.data??[]};
});
const nullableAmount=z.number().min(0).max(999999999).nullable();
const productSchema=z.object({id:z.string().regex(/^[a-z0-9-]+$/).max(100),name:z.string().trim().min(1).max(200),sku:z.string().trim().min(1).max(80),category_id:z.string().max(100).nullable(),brand:z.string().max(100),description:z.string().max(6000),price:nullableAmount,gst_rate:z.number().min(0).max(100).nullable(),stock:z.number().int().min(0).max(1000000).nullable(),unit:z.enum(['NOS','MTR']),min_quantity:z.number().int().min(1).max(100000),published:z.boolean(),featured:z.boolean(),image_key:z.string().max(100),image_url:z.url().refine(v=>v.startsWith('https://')).nullable(),specs:z.record(z.string().max(100),z.string().max(1000)),bulk_tiers:z.array(z.object({min:z.number().int().min(1),price:z.number().min(0)})).max(30)});
export const saveProduct=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(productSchema).handler(async({context,data})=>{
 const {data:allowed}=await context.supabase.rpc('can_manage',{_area:'product'});if(!allowed) throw new Error('Product administrator access is required.');
 const {error}=await context.supabase.from('products').upsert(data);if(error) throw new Error('Product could not be saved. Check for a duplicate SKU.');return {success:true};
});
export const deleteProduct=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().max(100)})).handler(async({context,data})=>{
 const {data:allowed}=await context.supabase.rpc('can_manage',{_area:'product'});if(!allowed) throw new Error('Product administrator access is required.');const {error}=await context.supabase.from('products').delete().eq('id',data.id);if(error)throw new Error('Product could not be deleted.');return {success:true};
});
export const saveContent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({type:z.enum(['page','blog']),slug:z.string().regex(/^[a-z0-9-]+$/).max(100),title:z.string().trim().min(1).max(200),body:z.string().max(100000),excerpt:z.string().max(2000).default(''),category:z.string().max(100).default(''),published:z.boolean()})).handler(async({context,data})=>{
 const {data:allowed}=await context.supabase.rpc('can_manage',{_area:'content'});if(!allowed)throw new Error('Content administrator access is required.');
 const result=data.type==='page'?await context.supabase.from('cms_pages').upsert({slug:data.slug,title:data.title,body:data.body,published:data.published,updated_at:new Date().toISOString()}):await context.supabase.from('blog_posts').upsert({slug:data.slug,title:data.title,body:data.body,excerpt:data.excerpt,category:data.category,published:data.published});if(result.error)throw new Error('Content could not be saved.');return {success:true};
});
export const updateEnquiry=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.uuid(),status:z.enum(['New','Under Review','Quotation Sent','Accepted','Rejected','Converted to Order']),internal_notes:z.string().max(10000),quotation:z.object({amount:z.number().min(0),notes:z.string().max(5000)}).nullable()})).handler(async({context,data})=>{
 const {data:allowed}=await context.supabase.rpc('can_manage',{_area:'order'});if(!allowed)throw new Error('Order administrator access is required.');const {id,...update}=data;const {error}=await context.supabase.from('enquiries').update(update).eq('id',id);if(error)throw new Error('Enquiry could not be updated.');return {success:true};
});
export const updateOrder=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.uuid(),status:z.enum(['Order Placed','Payment Confirmed','Processing','Packed','Dispatched','In Transit','Out for Delivery','Delivered','Cancelled','Return Requested','Returned','Refund Initiated','Refunded']),courier:z.string().max(100),tracking_number:z.string().max(100)})).handler(async({context,data})=>{
 const {data:allowed}=await context.supabase.rpc('can_manage',{_area:'order'});if(!allowed)throw new Error('Order administrator access is required.');const {id,...update}=data;const {error}=await context.supabase.from('orders').update(update).eq('id',id);if(error)throw new Error('Order could not be updated.');return {success:true};
});
export const getOrderDetails=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.uuid()})).handler(async({context,data})=>{
 const {data:order,error}=await context.supabase.from('orders').select('*').eq('id',data.id).eq('user_id',context.userId).single();
 if(error||!order)throw new Error('This order is not available in your account.');
 const {data:history,error:historyError}=await context.supabase.from('order_status_history').select('*').eq('order_id',data.id).order('created_at');
 if(historyError)throw new Error('Order updates could not be loaded.');return {order,history:history??[]};
});
