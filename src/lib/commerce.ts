export type Product = {
  id: string; name: string; source_name: string; category_id: string | null;
  brand: string; sku: string; description: string; specs: Record<string, string>;
  image_key: string; image_url: string | null; price: number | null;
  gst_rate: number | null; stock: number | null; unit: string; min_quantity: number;
  bulk_tiers: { min: number; price: number }[]; featured: boolean; published: boolean;
};
export type Category = { id: string; name: string; image_key: string; description: string; sort_order: number };
export type CartItem = { product_id: string; quantity: number };
export const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
export function unitPrice(product: Product, quantity: number): number | null {
  if (product.price === null) return null;
  return [...product.bulk_tiers].sort((a,b) => b.min-a.min).find(t => quantity >= t.min)?.price ?? product.price;
}
export function canPurchase(product: Product, quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= product.min_quantity && product.stock !== null && quantity <= product.stock && product.price !== null && product.gst_rate !== null && product.published;
}
export function cartTotals(products: Product[], items: CartItem[]) {
  let subtotal = 0; let gst = 0; let ready = items.length > 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product || !canPurchase(product,item.quantity)) { ready = false; continue; }
    const price = unitPrice(product,item.quantity);
    if (price === null || product.gst_rate === null) { ready = false; continue; }
    subtotal += price * item.quantity; gst += price * item.quantity * product.gst_rate / 100;
  }
  return { subtotal: Math.round(subtotal*100)/100, gst: Math.round(gst*100)/100, ready };
}
export function pageHead(title: string, description: string) {
  const fullTitle = `${title} | Apex Electricals`;
  return { meta: [{ title: fullTitle }, { name: 'description', content: description }, { property: 'og:title', content: fullTitle }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}