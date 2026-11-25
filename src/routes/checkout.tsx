import {createFileRoute} from '@tanstack/react-router';
import { CheckoutPage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/checkout')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('Checkout','Confirm your Apex Electricals product requirement, price and payment availability.');return {meta:[...head.meta]};},component:CheckoutPage});
