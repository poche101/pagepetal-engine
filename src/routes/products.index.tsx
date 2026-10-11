import { createFileRoute } from '@tanstack/react-router';
import { ProductCatalogue } from '@/components/site';
import { pageHead } from '@/lib/site-data';
export const Route=createFileRoute('/products/')({head:()=>pageHead('Our Products','Our Products from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><ProductCatalogue/></main>;}
