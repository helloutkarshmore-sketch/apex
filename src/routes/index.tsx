import {createFileRoute} from '@tanstack/react-router';
import { HomePage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
import { workshopImage } from '@/lib/product-images';
export const Route=createFileRoute('/')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('Apex Electricals — Electrical & Industrial Supplies','Electrical equipment, industrial components and business quotations from Apex Electricals in Ranjangaon MIDC, Pune.');return {meta:[...head.meta, { property: 'og:image', content: workshopImage }, { name: 'twitter:image', content: workshopImage }]};},component:HomePage});
