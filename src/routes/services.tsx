import { useQuery } from '@tanstack/react-query';
import { contentQuery } from '@/lib/catalogue';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/services')({head:()=>pageHead('Our Services','Our Services from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){const {data}=useQuery(contentQuery);const c=data?.find(r=>r.key==='services');return <main><><PageBanner title="Our Services" description="Our expertise does not end in the manufacturing of quality wires and cables."/><ServiceSection/><section className="section"><div className="site-container"><h2 className="section-title">{c?.title||'Electrification Wiring'}</h2><p className="section-copy whitespace-pre-line">{c?.body||'Talk to our team about your electrification wiring needs and the right products for your project.'}</p><Button asChild className="mt-6"><Link to="/contact">Talk to an expert <ArrowUpRight/></Link></Button></div></section></></main>;}
