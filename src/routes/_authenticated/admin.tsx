import {createFileRoute} from '@tanstack/react-router';
import {AdminPage,adminOptions} from '@/components/admin-page';
import {pageHead} from '@/lib/commerce';
import {PageFrame} from '@/components/store-pages';
export const Route=createFileRoute('/_authenticated/admin')({loader:({context})=>context.queryClient.ensureQueryData(adminOptions),head:()=>pageHead('Store Administration','Authorized management of the Apex Electricals store.'),component:AdminPage,errorComponent:({error})=><PageFrame title="Administrator Access"><div className="notice">{error instanceof Error && error.message==='Administrator access is required.'?'This account does not have store administrator access. The designated owner account receives access after its email is confirmed.':'Store administration could not be loaded. Please try again.'}</div></PageFrame>});
