import {createFileRoute} from '@tanstack/react-router';
import {BlogPage} from '@/components/content-page';
import {pageHead} from '@/lib/commerce';
export const Route=createFileRoute('/blog_/$slug')({head:({params})=>pageHead(params.slug.replaceAll('-',' '),'Read the Apex Electricals industry journal.'),component:Page});
function Page(){const {slug}=Route.useParams();return <BlogPage slug={slug}/>;}
