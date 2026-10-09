import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/quote')({head:()=>pageHead('Request a Quote','Request a Quote from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><><PageBanner title="Request a Quote" description="Tell us about your project. We’ll help you find the right cable solution."/><section className="section"><div className="site-container form-layout"><ContactDetails/><EnquiryForm kind="quote"/></div></section></></main>;}
