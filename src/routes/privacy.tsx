import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/privacy')({head:()=>pageHead('Privacy Policy','Privacy Policy from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><><PageBanner title="Privacy Policy"/><section className="section architectural"><div className="site-container max-w-3xl"><h2 className="text-xl font-semibold">Your information</h2><p className="about-detail">When you send an enquiry, we collect the contact details and message you provide to respond to your request. Assistant conversations are stored to maintain your conversation and support enquiries. A browser identifier connects you to your conversation.</p><h2 className="text-xl font-semibold">Contact and requests</h2><p className="about-detail">For questions about your information or to request its removal, contact admin@braconwire.com. Please do not share passwords or sensitive financial information in forms or the assistant.</p></div></section></></main>;}
