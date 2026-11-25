import {createFileRoute} from '@tanstack/react-router';
import { WishlistPage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/wishlist')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('My Wishlist','Save electrical products and industrial components for your next requirement.');return {meta:[...head.meta]};},component:WishlistPage});
