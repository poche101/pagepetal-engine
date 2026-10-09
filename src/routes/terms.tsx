import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBanner, ProductCatalogue, AboutSection, ServiceSection, ContactDetails, FAQList } from '@/components/site';
import { EnquiryForm } from '@/components/enquiry-form';
import { pageHead, factory } from '@/lib/site-data';
export const Route=createFileRoute('/terms')({head:()=>pageHead('Terms of Use','Terms of Use from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.'),component:Page});
function Page(){return <main><><PageBanner title="Terms of Use"/><section className="section"><div className="site-container max-w-3xl"><h2 className="text-xl font-semibold">Product information</h2><p className="about-detail">Product descriptions are provided for general information. Confirm current specifications, availability, prices and suitability with Bracon before ordering. A submitted enquiry is not an accepted order or a binding quotation.</p><h2 className="text-xl font-semibold">Technical advice</h2><p className="about-detail">Assistant responses are general guidance, not a substitute for a qualified electrical professional. Final installation and cable sizing decisions must be verified by a qualified professional.</p></div></section></></main>;}
