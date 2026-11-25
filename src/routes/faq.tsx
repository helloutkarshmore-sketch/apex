import {createFileRoute} from '@tanstack/react-router';
import { FAQPage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/faq')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('Frequently Asked Questions','Answers to product enquiries, bulk quotations and order tracking questions.');return {meta:[...head.meta]};},component:FAQPage});
