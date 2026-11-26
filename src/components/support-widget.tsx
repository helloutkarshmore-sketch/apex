import { useLocation } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, ClipboardList, FileText, MessageCircle, PackageSearch, Phone, Settings2, ShoppingCart, Truck, X } from 'lucide-react';
import type { Product } from '@/lib/commerce';
import { useCommerce } from './commerce-provider';
import { apexContact } from '@/lib/contact';

type CategoryId = 'product' | 'bulk' | 'pricing' | 'order' | 'technical' | 'general';
type ContextId = 'home' | 'product' | 'cart' | 'bulk' | 'order' | 'generic';
type Step = 'categories' | 'details' | 'preview';

const categoryMeta: Record<CategoryId, { title: string; description: string; icon: typeof PackageSearch }> = {
  product: { title: 'Product & specification enquiry', description: 'Confirm fit, specifications and availability.', icon: PackageSearch },
  bulk: { title: 'Bulk procurement', description: 'Plan quantities and sourcing for your project.', icon: BriefcaseBusiness },
  pricing: { title: 'Pricing & quotations', description: 'Request a clear price or commercial quote.', icon: FileText },
  order: { title: 'Order & delivery support', description: 'Get help with an order or delivery timeline.', icon: Truck },
  technical: { title: 'Technical assistance', description: 'Discuss application, compatibility or selection.', icon: Settings2 },
  general: { title: 'General business enquiry', description: 'Speak with Apex about your requirements.', icon: ClipboardList },
};

const priority: Record<ContextId, CategoryId[]> = {
  home: ['product', 'general', 'bulk', 'pricing', 'technical', 'order'],
  product: ['product', 'pricing', 'technical', 'bulk', 'general', 'order'],
  cart: ['pricing', 'bulk', 'order', 'product', 'general', 'technical'],
  bulk: ['bulk', 'pricing', 'product', 'general', 'technical', 'order'],
  order: ['order', 'general', 'pricing', 'technical', 'product', 'bulk'],
  generic: ['product', 'pricing', 'bulk', 'order', 'technical', 'general'],
};

function contextFor(pathname: string): ContextId {
  if (pathname.startsWith('/product/')) return 'product';
  if (pathname.startsWith('/cart')) return 'cart';
  if (pathname.startsWith('/bulk-order')) return 'bulk';
  if (pathname.startsWith('/orders') || pathname.startsWith('/track-order')) return 'order';
  if (pathname === '/') return 'home';
  return 'generic';
}

function contextLabel(context: ContextId) {
  return ({ home: 'Apex Electricals homepage', product: 'Apex Electricals product page', cart: 'Apex Electricals basket', bulk: 'Apex Electricals bulk enquiry', order: 'Apex Electricals order support', generic: 'Apex Electricals website' })[context];
}

export function SupportWidget({ products }: { products: Product[] }) {
  const location = useLocation();
  const { cart } = useCommerce();
  const context = contextFor(location.pathname);
  const product = useMemo(() => {
    const id = location.pathname.match(/^\/product\/([^/]+)/)?.[1];
    return id ? products.find((item) => item.id === decodeURIComponent(id)) : undefined;
  }, [location.pathname, products]);
  const cartProducts = useMemo(() => cart.map((item) => ({ item, product: products.find((p) => p.id === item.product_id) })).filter((row): row is { item: typeof cart[number]; product: Product } => Boolean(row.product)), [cart, products]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('categories');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [quantity, setQuantity] = useState(product?.min_quantity ?? 1);
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [notes, setNotes] = useState('');
  const [draft, setDraft] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setQuantity(product?.min_quantity ?? 1), [product]);
  useEffect(() => {
    const openSupport = (event: Event) => {
      const requested = (event as CustomEvent<{ category?: CategoryId }>).detail?.category;
      setCategory(requested ?? null); setStep(requested ? 'details' : 'categories'); setOpen(true);
    };
    window.addEventListener('apex-support-open', openSupport);
    return () => window.removeEventListener('apex-support-open', openSupport);
  }, []);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('support-open');
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => { document.body.classList.remove('support-open'); document.removeEventListener('keydown', onKeyDown); };
  }, [open]);

  const orderedCategories = priority[context];
  const selected = category ? categoryMeta[category] : null;
  const productUrl = typeof window === 'undefined' ? '' : window.location.href;
  const message = useMemo(() => {
    if (!selected) return '';
    const lines = [`Hello Apex Electricals,`, ``, `I need assistance with: ${selected.title}`, `Page context: ${contextLabel(context)}`];
    if (product) lines.push(`Product: ${product.name}`, `SKU: ${product.sku}`, `Quantity: ${quantity}`, `Product link: ${productUrl}`);
    if (context === 'cart' && cartProducts.length) lines.push('', 'Basket items:', ...cartProducts.map(({ item, product: itemProduct }) => `- ${itemProduct.name} (${itemProduct.sku}): ${item.quantity}`));
    if (company.trim()) lines.push(`Company: ${company.trim()}`);
    if (city.trim()) lines.push(`Delivery city: ${city.trim()}`);
    if (orderRef.trim()) lines.push(`Order reference: ${orderRef.trim()}`);
    if (notes.trim()) lines.push(`Notes: ${notes.trim()}`);
    return lines.join('\n');
  }, [selected, context, product, quantity, productUrl, cartProducts, company, city, orderRef, notes]);

  function selectCategory(id: CategoryId) { setCategory(id); setStep('details'); }
  function prepareMessage(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (category === 'order' && !orderRef.trim()) return; setDraft(message); setStep('preview'); }
  function reset() { setStep('categories'); setCategory(null); setDraft(''); setOrderRef(''); setNotes(''); }

  const whatsappUrl = `${apexContact.whatsappHref}?text=${encodeURIComponent(draft)}`;
  const contextText = context === 'product' ? 'Product support' : context === 'cart' ? 'Basket support' : context === 'bulk' ? 'Bulk purchasing' : 'Apex support';

  return <div className="support-widget-wrap">
    {open && <button className="support-backdrop" aria-label="Close support panel" onClick={() => setOpen(false)} />}
    {open && <div className="support-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="support-title" tabIndex={-1}>
      <header className="support-header"><div className="support-brand"><span className="support-brand-mark">A</span><div><strong>Apex Electricals</strong><span>Customer support</span></div></div><div className="support-header-actions"><span className="support-channel"><i /> WhatsApp channel</span><button className="support-icon-button" aria-label="Close support" onClick={() => setOpen(false)}><X size={18} /></button></div></header>
      <div className="support-panel-body">
        {step === 'categories' && <><div className="support-intro"><p className="support-eyebrow">{contextText}</p><h2 id="support-title">How can we help you today?</h2><p>Get assistance with electrical products, industrial equipment, bulk purchasing and order enquiries.</p></div><div className="support-category-list">{orderedCategories.map((id) => { const item = categoryMeta[id]; const Icon = item.icon; return <button className="support-category-row" key={id} onClick={() => selectCategory(id)}><span className="support-category-icon"><Icon size={18} /></span><span><strong>{item.title}</strong><small>{item.description}</small></span><ArrowRight size={16} /></button>; })}</div></>}
        {step === 'details' && selected && <><div className="support-step-heading"><button className="support-back-button" onClick={reset}><ArrowLeft size={16} /> Enquiries</button><p className="support-eyebrow">Step 2 of 3</p><h2 id="support-title">Tell us a little more</h2><p>{selected.description} Only share details relevant to your enquiry.</p></div><form className="support-form" onSubmit={prepareMessage}>{product && <div className="support-context-card"><PackageSearch size={17} /><span><strong>{product.name}</strong><small>SKU {product.sku}</small></span></div>}{(category === 'product' || product) && <label>Quantity<input type="number" min={product?.min_quantity ?? 1} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} /></label>}{category === 'order' && <label>Order reference<input required maxLength={80} value={orderRef} onChange={(event) => setOrderRef(event.target.value)} placeholder="Enter it manually" /></label>}{(category === 'bulk' || context === 'bulk' || context === 'cart') && <><label>Company name <span>(optional)</span><input maxLength={120} value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Your company" /></label><label>Delivery city <span>(optional)</span><input maxLength={80} value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" /></label></>}<label>Additional notes <span>(optional)</span><textarea maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What would you like Apex to confirm?" rows={3} /></label><button className="support-primary-button" type="submit">Review message <ArrowRight size={17} /></button></form></>}
        {step === 'preview' && selected && <><div className="support-step-heading"><button className="support-back-button" onClick={() => setStep('details')}><ArrowLeft size={16} /> Edit details</button><p className="support-eyebrow">Step 3 of 3</p><h2 id="support-title">Review your enquiry</h2><p>Check the message before continuing. WhatsApp will open in a new window.</p></div><label className="support-preview-label">Message preview<textarea className="support-preview" value={draft} onChange={(event) => setDraft(event.target.value)} rows={12} /></label><div className="support-preview-actions"><button className="support-secondary-button" onClick={reset}>Change topic</button><a className="support-primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">Continue to WhatsApp <ArrowRight size={17} /></a></div></>}
      </div><footer className="support-footer"><a href={apexContact.phoneHref}><Phone size={14} /> Call {apexContact.phoneDisplay}</a><span>We never ask for payment details here.</span></footer>
    </div>}
    <button ref={triggerRef} className={`support-launcher${open ? ' is-open' : ''}`} aria-label={open ? 'Close Apex support' : 'Open Apex support'} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="support-launcher-icon"><MessageCircle size={21} /></span><span className="support-launcher-copy"><strong>Need assistance?</strong><small>{contextText}</small></span><ArrowRight className="support-launcher-arrow" size={16} /></button>
  </div>;
}
