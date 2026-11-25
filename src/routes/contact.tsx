import {createFileRoute} from '@tanstack/react-router';
import {EnquiryPage} from '@/components/store-pages';
import {catalogOptions} from '@/lib/commerce.functions';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/contact')({loader:({context})=>context.queryClient.ensureQueryData(catalogOptions),head:()=>pageHead('Contact Apex Electricals','Contact Apex Electricals in Ranjangaon MIDC, Pune for product, bulk and order enquiries.'),component:Page});
function Page(){return <EnquiryPage kind="contact"/>;}
