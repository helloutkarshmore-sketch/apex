import {createFileRoute} from '@tanstack/react-router';
import { AboutPage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
import {workshopImage} from '@/lib/product-images';
export const Route=createFileRoute('/about')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('About Apex Electricals','Learn about Apex Electricals and Electronics Solutions in Ranjangaon MIDC, Pune.');return {meta:[...head.meta,{property:'og:image',content:workshopImage},{name:'twitter:image',content:workshopImage}]};},component:AboutPage});
