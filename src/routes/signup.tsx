import {createFileRoute} from '@tanstack/react-router';
import {AuthPage} from '@/components/auth-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/signup')({head:()=>pageHead('Create an Account','Secure access to your Apex Electricals customer account.'),component:Page});
function Page(){return <AuthPage mode="signup"/>;}
