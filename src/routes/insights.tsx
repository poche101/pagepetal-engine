import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getContent } from '@/lib/site.functions';
const contentOptions=queryOptions({queryKey:['site-content'],queryFn:()=>getContent()});
export const Route=createFileRoute('/insights')({head:()=>pageHead('Insights','Insights from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),loader:({context})=>context.queryClient.ensureQueryData(contentOptions),component:Page});
function Page(){const {data}=useSuspenseQuery(contentOptions);return <main><><PageBanner title="Insights" description="Product knowledge for better connections."/><section className="section"><div className="site-container">{data?.filter(c=>c.category==='insight').length ? data.filter(c=>c.category==='insight').map(c=><article className="service-item mb-8" key={c.key}><h2 className="section-title">{c.title}</h2><p className="about-detail whitespace-pre-wrap">{c.body}</p></article>) : <><h2 className="section-title">Understanding your cable requirements</h2><p className="section-copy">A custom cable order starts with the voltage designation, conductor size, number of cores, conductor material, type of finish, cable length and individual drum length. Our manufacturing team can guide you through these factors.</p><Button asChild className="mt-6" variant="outline"><Link to="/services/$slug" params={{slug:'custom-design'}}>Explore custom cable design <ArrowUpRight/></Link></Button></>}</div></section></></main>;}
