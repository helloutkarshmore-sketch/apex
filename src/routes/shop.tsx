import {createFileRoute} from '@tanstack/react-router';
import {CatalogPage} from '@/components/store-pages';
import {catalogOptions} from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/shop')({validateSearch:(search:Record<string,unknown>)=>({q:typeof search['q']==='string'?search['q']:'',category:typeof search['category']==='string'?search['category']:''}),loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>pageHead('Shop Electrical & Industrial Products','Browse electrical cables, switchgear, industrial heaters, controllers, lighting and connectors.'),component:Page});
function Page(){const {q,category}=Route.useSearch();return <CatalogPage key={q+category} q={q} category={category}/>;}
