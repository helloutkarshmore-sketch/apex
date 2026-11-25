import {createFileRoute} from '@tanstack/react-router';
import {PaymentStatusPage} from '@/components/content-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/payment-status')({head:()=>pageHead('Payment Status','View verified Apex Electricals payment status.'),component:PaymentStatusPage});
