import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getContent } from '@/lib/site.functions';
const contentOptions=queryOptions({queryKey:['site-content'],queryFn:()=>getContent()});
export const Route=createFileRoute('/quality')({head:()=>pageHead('Quality Assurance','Quality Assurance from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),loader:({context})=>context.queryClient.ensureQueryData(contentOptions),component:Page});
function Page(){const {data}=useSuspenseQuery(contentOptions);return <main><><PageBanner title="Quality Assurance" description="Tested, Trusted and Durable."/><section className="section"><div className="site-container about-layout"><div><div className="eyebrow">OUR COMMITMENT</div><h2 className="section-title">{data?.find(c=>c.key==='quality')?.title || 'Tested, Trusted and Durable'}</h2><p className="about-detail">{data?.find(c=>c.key==='quality')?.body || 'Bracon wires are considered reliable and durable.'}</p><Button asChild><Link to="/quote">Request product documentation <ArrowUpRight/></Link></Button></div><img className="about-photo" src={factory} alt="Industrial cable reels" width={1920} height={1024} loading="lazy"/></div></section></></main>;}
