import {createFileRoute} from '@tanstack/react-router';
import {AuthPage} from '@/components/auth-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/forgot-password')({head:()=>pageHead('Forgot Password','Secure access to your Apex Electricals customer account.'),component:Page});
function Page(){return <AuthPage mode="forgot"/>;}
