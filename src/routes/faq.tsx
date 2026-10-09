import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/faq')({head:()=>pageHead('Frequently Asked Questions','Frequently Asked Questions from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><><PageBanner title="Frequently Asked Questions" description="Straight answers to your product and service questions."/><section className="section"><div className="site-container"><FAQList/></div></section></></main>;}
