import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/distributors')({head:()=>pageHead('Our Distributors','Our Distributors from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><><PageBanner title="Our Distributors" description="A distribution network connecting customers throughout Nigeria."/><section className="section"><div className="site-container form-layout"><div><div className="eyebrow">GROW WITH BRACON</div><h2 className="section-title">Become a distributor.</h2><p className="about-detail">We have established a distribution network throughout Nigeria. Connect with our team to discuss distribution opportunities in your location.</p><ContactDetails/></div><EnquiryForm kind="distributor"/></div></section></></main>;}
