import { useQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/catalogue";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageBanner,
  ProductCatalogue,
  AboutSection,
  ServiceSection,
  ContactDetails,
  FAQList,
} from "@/components/site";
import { EnquiryForm } from "@/components/enquiry-form";
import { pageHead, factory } from "@/lib/site-data";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact Bracon",
      "Contact Bracon from Bracon Wire & Cable, the Nigerian cable manufacturer established in 1998.",
    ),
  component: Page,
});
function Page() {
  const { data } = useQuery(contentQuery);
  const c = data?.find((r) => r.key === "contact");
  return (
    <main>
      <>
        <PageBanner title="Contact Us" description="Good connections begin with a conversation." />
        {c?.body && (
          <section className="section pb-0">
            <div className="site-container">
              <h2 className="section-title">{c.title}</h2>
              <p className="section-copy whitespace-pre-line">{c.body}</p>
            </div>
          </section>
        )}
        <section className="section">
          <div className="site-container form-layout">
            <ContactDetails />
            <EnquiryForm />
          </div>
        </section>
      </>
    </main>
  );
}
