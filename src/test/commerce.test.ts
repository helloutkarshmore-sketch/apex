import { describe, expect, it } from 'vitest';
import { canPurchase, cartTotals, unitPrice, type Product } from '@/lib/commerce';
const product: Product = { id:'mcb',name:'MCB',source_name:'16A SINGLE POLE MCB',category_id:'switchgear',brand:'',sku:'APX-011',description:'',specs:{},image_key:'switchgear',image_url:null,price:100,gst_rate:18,stock:10,unit:'NOS',min_quantity:1,bulk_tiers:[],featured:true,published:true };
describe('Commerce safeguards', () => {
  it('does not sell report products whose current price is unknown', () => { expect(canPurchase({ ...product,price:null },1)).toBe(false); });
  it('does not sell report products whose stock is unknown', () => { expect(canPurchase({ ...product,stock:null },1)).toBe(false); });
  it('never accepts quantities above inventory', () => { expect(canPurchase(product,11)).toBe(false); expect(canPurchase(product,10)).toBe(true); });
  it('uses each product’s own tiers, not a global quantity discount', () => { expect(unitPrice({ ...product,bulk_tiers:[{ min:5,price:90 }] },5)).toBe(90); expect(unitPrice(product,5)).toBe(100); });
  it('uses the configured product GST rate', () => { expect(cartTotals([product],[{ product_id:'mcb',quantity:2 }])).toEqual({ subtotal:200,gst:36,ready:true }); });
  it('rejects fractional item quantities', () => { expect(canPurchase(product,1.5)).toBe(false); });
  it('respects a product-specific minimum order quantity', () => { expect(canPurchase({...product,min_quantity:5},4)).toBe(false); expect(canPurchase({...product,min_quantity:5},5)).toBe(true); });
  it('does not permit purchasing when GST is unconfirmed', () => { expect(canPurchase({...product,gst_rate:null},1)).toBe(false); });
  it('does not permit purchasing unpublished products', () => { expect(canPurchase({...product,published:false},1)).toBe(false); });
});