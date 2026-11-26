import {createFileRoute} from '@tanstack/react-router';
import { ProductDetailPage } from '@/components/product-detail-page';
import {catalogOptions} from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/product/$id')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:({params,loaderData})=>{const product=loaderData?.products.find(p=>p.id===params.id);return pageHead(product?.name??'Product Unavailable',product?.description??'Explore electrical and industrial products at Apex Electricals.');},component:Page});
function Page(){const {id}=Route.useParams();return <ProductDetailPage key={id} id={id}/>;}
