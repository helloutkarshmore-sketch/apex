import {createFileRoute} from '@tanstack/react-router';
import {PolicyPage} from '@/components/content-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/policy/$slug')({head:({params})=>pageHead(`${params.slug.charAt(0).toUpperCase()}${params.slug.slice(1)} Policy`,'Read Apex Electricals business and customer policies.'),component:Page});
function Page(){const {slug}=Route.useParams();return <PolicyPage slug={slug}/>;}
