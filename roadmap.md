# Apex Electricals implementation

- [ ] Set up commerce integration — the user answered with the website type rather than choosing new/existing Shopify, so connection was skipped. Razorpay checkout awaits credentials and approved selling prices.
- [ ] Confirm approved selling prices, GST treatment and current stock — the user referred back to the sales report; use its product names, but do not treat historical quantities as stock or averages as selling prices.
- [x] Build the navy/white industrial storefront, catalog, categories, search, product pages, wishlist and cart. Initial catalog contains 16 report-backed products across eight categories.
- [x] Enable Lovable Cloud for customer accounts, saved addresses, enquiries, quotations, newsletter and editable content.
- [ ] Implement verified checkout, order confirmation, tracking and invoices where supported.
- [x] Build protected admin product, stock, order, customer, quotation, coupon, blog and policy management. Stock changes are recorded. Category creation/update is available.
- [x] Configure the owner's Super Admin role assignment on verified-email registration. The owner still needs to register and confirm the designated account.
- [x] Build support, account, blog and policy pages with page-specific metadata. Policy content awaits approved business terms; no fake articles or order history were added.
- [x] Test signed-in search, basket quantity persistence, wishlist, enquiry submission/account readback, admin product save/readback, permission denial and 360/390px layouts. Ten focused tests passed.
- [ ] Complete payment-dependent purchases, confirmations, invoices, refunds and checkout shipping — waiting for approved retail prices, stock, GST, Razorpay credentials and shipping rules.
- [ ] Enable administrator product image uploads — public storage buckets are blocked by workspace policy; representative asset images and approved HTTPS photo URLs work meanwhile.
- [ ] Complete CMS homepage/banner settings and advanced category/subcategory management — waiting for final business content and hierarchy.