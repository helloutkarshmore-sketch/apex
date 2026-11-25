import {createFileRoute} from '@tanstack/react-router';
import {BlogPage} from '@/components/content-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/blog')({head:()=>pageHead('Industry Journal','Published electrical equipment and industrial supply articles from Apex Electricals.'),component:BlogPage});
