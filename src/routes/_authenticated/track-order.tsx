import {createFileRoute} from '@tanstack/react-router';
import {AccountPage,accountOptions} from '@/components/account-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/_authenticated/track-order')({loader:({context})=>context.queryClient.ensureQueryData(accountOptions),head:()=>pageHead('Order Tracking','Manage your Apex Electricals orders, enquiries and customer details.'),component:Page});
function Page(){return <AccountPage section="tracking"/>;}
