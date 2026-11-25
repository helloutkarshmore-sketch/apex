import {createFileRoute} from '@tanstack/react-router';
import {EnquiryPage} from '@/components/store-pages';
import {catalogOptions} from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/bulk-order')({validateSearch:(input:{product?:string}):{product?:string}=>typeof input.product==='string'?{product:input.product}:{},loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>pageHead('Bulk Orders & Quotations','Request product-specific pricing for your electrical and industrial business requirements.'),component:Page});
function Page(){const {product}=Route.useSearch();return <EnquiryPage selectedProduct={product??''}/>;}
