import {createFileRoute} from '@tanstack/react-router';
import { CategoriesPage } from '@/components/store-pages';
import { catalogOptions } from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/categories')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>{const head=pageHead('Product Categories','Explore switchgear, cables, automation, lighting, heaters and industrial components.');return {meta:[...head.meta]};},component:CategoriesPage});
