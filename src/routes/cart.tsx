import {createFileRoute} from '@tanstack/react-router';
import { CartPage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/cart')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('Shopping Cart','Review electrical products, quantities and pricing before ordering or requesting a quotation.');return {meta:[...head.meta]};},component:CartPage});
