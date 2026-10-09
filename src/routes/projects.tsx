import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/projects')({head:()=>pageHead('Projects','Projects from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><><PageBanner title="Projects" description="Connections for homes, industry and infrastructure."/><section className="section"><div className="site-container"><h2 className="section-title">Discuss your next project.</h2><p className="section-copy">Contact our team for relevant product recommendations and project references.</p><Button asChild className="mt-6"><Link to="/contact">Speak to Bracon <ArrowUpRight/></Link></Button></div></section></></main>;}
