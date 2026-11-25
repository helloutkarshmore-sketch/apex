import {createFileRoute} from '@tanstack/react-router';
import {PaymentStatusPage} from '@/components/content-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/order-confirmation')({head:()=>pageHead('Order Confirmation','View your confirmed Apex Electricals order.'),component:Page});
function Page(){return <PaymentStatusPage confirmation/>;}
