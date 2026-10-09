import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/products')({head:()=>pageHead('Our Products','Our Products from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><ProductCatalogue/></main>;}
