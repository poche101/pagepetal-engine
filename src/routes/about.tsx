import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getContent } from '@/lib/site.functions';
const contentOptions=queryOptions({queryKey:['site-content'],queryFn:()=>getContent()});
export const Route=createFileRoute('/about')({head:()=>pageHead('About Bracon','About Bracon from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),loader:({context})=>context.queryClient.ensureQueryData(contentOptions),component:Page});
function Page(){const {data}=useSuspenseQuery(contentOptions);return <main><><PageBanner title="About Bracon" description="Nigerian expertise. Built on experience."/><AboutSection full body={data?.find(c=>c.key==='about')?.body} title={data?.find(c=>c.key==='about')?.title}/></></main>;}
