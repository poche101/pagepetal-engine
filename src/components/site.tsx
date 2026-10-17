import logo from "@/assets/bracon-logo.jpg.asset.json";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Factory,
  Truck,
  Cable,
  Settings2,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCatalogue } from "@/lib/catalogue";
import { products, factory, companyStory, faqs } from "@/lib/site-data";
export function BrandMark() {
  return (
    <img src={logo.url} alt="" aria-hidden="true" className="brand-mark rounded-sm object-cover" />
  );
}
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Bracon home">
      <span className="brand-name">
        <BrandMark />
        bracon<span className="text-brand-orange">.</span>
      </span>
      <span className="brand-sub">WIRE & CABLE</span>
    </Link>
  );
}
const navigation = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Our Products" },
  { to: "/services", label: "Services" },
  { to: "/quality", label: "Quality Assurance" },
  { to: "/contact", label: "Contact" },
] as const;
export function Header() {
  return (
    <>
      <div className="top-strip">
        <div className="site-container">
          <span>Tested. Trusted. Durable. &nbsp; Since 1998.</span>
          <div className="flex items-center gap-6">
            <a className="top-contact-email" href="mailto:sales@braconwire.com">
              sales@braconwire.com
            </a>
            <a href="tel:+2348050925884" className="flex items-center gap-2">
              <Phone size={10} /> +234 805 092 5884
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <Brand />
          <nav aria-label="Main navigation" className="desktop-nav">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} activeOptions={{ exact: true }}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Button className="header-quote" asChild>
            <Link to="/quote">
              Request a Quote <ArrowUpRight />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu-trigger"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-[90vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Bracon Wire & Cable</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 mt-10" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <Link to={item.to} className="text-sm font-semibold">
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/distributors" className="text-sm font-semibold">
                    Become a Distributor
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <>
      <section className="cta-band">
        <div className="site-container cta-inner">
          <div>
            <div className="eyebrow mb-4">LET’S MAKE THE CONNECTION</div>
            <h2>The right cable. The right partner.</h2>
            <p>Tell us what you need. Our team will take it from there.</p>
          </div>
          <Button asChild size="lg">
            <Link to="/quote">
              Discuss your requirements <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
      <footer className="site-footer">
        <div className="site-container">
          <div className="footer-grid">
            <div>
              <Brand />
              <p>
                Manufacturing reliable wires and cables in Nigeria since 1998. Tested, Trusted and
                Durable.
              </p>
            </div>
            <div>
              <h4>Our Company</h4>
              <Link to="/about">About Bracon</Link>
              <Link to="/quality">Quality Assurance</Link>
              <Link to="/distributors">Our Distributors</Link>
              <Link to="/insights">Insights</Link>
            </div>
            <div>
              <h4>Explore</h4>
              <Link to="/products">Product Catalogue</Link>
              <Link to="/services">Our Services</Link>
              <Link to="/faq">Frequently Asked Questions</Link>
              <Link to="/quote">Request a Quote</Link>
            </div>
            <div>
              <h4>Get in Touch</h4>
              <p>
                KM 34, Lagos Abeokuta Express Way,
                <br />
                Amje Alakuko, Nigeria.
              </p>
              <a href="mailto:sales@braconwire.com">sales@braconwire.com</a>
              <a href="tel:+2348050925884">+234 805 092 5884</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Bracon Wire & Cable. All rights reserved.</span>
            <div className="flex gap-6">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/auth">Administrator</Link>
            </div>
            <span>Proudly manufactured in Nigeria.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
export function PageBanner({
  title,
  description,
  label = "BRACON WIRE & CABLE",
}: {
  title: string;
  description?: string;
  label?: string;
}) {
  return (
    <section className="page-banner architectural">
      <div className="site-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
        <div className="eyebrow">{label}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
export function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <Link to="/products/$slug" params={{ slug: product.slug }} className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} width={1024} height={768} loading="lazy" />
        <span className="product-label">{product.category.toUpperCase()}</span>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card-link">
          Explore product <ArrowUpRight />
        </div>
      </div>
    </Link>
  );
}
export function ProductCatalogue() {
  const [filter, setFilter] = useState("All Products");
  const catalogue = useCatalogue();
  const categories = ["All Products", "Residential", "Earthing", "Industrial", "Distribution"];
  return (
    <>
      <PageBanner
        title="Our Products"
        description="Reliable wires and cables. Engineered for the connections that matter."
      />
      <section className="section">
        <div className="site-container">
          <div className="filter-row">
            {categories.map((c) => (
              <Button
                key={c}
                variant={filter === c ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="product-grid">
            {catalogue
              .filter((p) => filter === "All Products" || p.category === filter)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link to="/services">
                Special orders & custom designs <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
export function AboutSection({
  full = false,
  body,
  title,
}: {
  full?: boolean;
  body?: string | undefined;
  title?: string | undefined;
}) {
  return (
    <section className="section">
      <div className="site-container about-layout">
        <div className="about-photo-wrap">
          <img
            className="about-photo"
            src={factory}
            alt="Cable reels in an industrial manufacturing setting"
            width={1920}
            height={1024}
            loading="lazy"
          />
          <div className="established">
            <strong>1998</strong>
            <small>OUR STORY BEGAN</small>
          </div>
        </div>
        <div>
          <div className="eyebrow">BUILT ON EXPERIENCE</div>
          <h2 className="section-title">
            {title || (
              <>
                We are giants.
                <br />
                In every connection.
              </>
            )}
          </h2>
          <p className="about-detail whitespace-pre-line">
            {body ||
              (full
                ? companyStory
                : "A wholly owned Nigerian company, Bracon has been manufacturing wires and cables since 1998. From the homes we connect to the industries we power, our commitment is the same: dependable quality, without compromise.")}
          </p>
          <div className="about-facts">
            <div>
              <strong>
                28<span className="text-primary">+</span>
              </strong>
              <small>Years since incorporation</small>
            </div>
            <div>
              <strong>
                100<span className="text-primary">%</span>
              </strong>
              <small>Nigerian-owned</small>
            </div>
          </div>
          {!full && (
            <Button variant="outline" asChild>
              <Link to="/about">
                Discover our story <ArrowUpRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
export function ServiceSection() {
  return (
    <section className="section architectural">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">BEYOND MANUFACTURING</div>
            <h2 className="section-title">Expertise that goes further.</h2>
          </div>
          <p className="section-copy">
            More than a cable manufacturer. A partner in finding the right solution for your
            project.
          </p>
        </div>
        <div className="services-grid">
          <article className="service-item">
            <Settings2 />
            <h3>Custom Cable Design</h3>
            <p>
              Wires and cables made to your specifications, guided by our professional manufacturing
              expertise.
            </p>
            <Button variant="link" className="px-0" asChild>
              <Link to="/services/$slug" params={{ slug: "custom-design" }}>
                Explore custom solutions <ArrowRight />
              </Link>
            </Button>
          </article>
          <article className="service-item">
            <Cable />
            <h3>Special Wooden Drums</h3>
            <p>
              Quality hardwood drums built to hold your heavy-duty cables through longer storage and
              transfers.
            </p>
            <Button variant="link" className="px-0" asChild>
              <Link to="/services/$slug" params={{ slug: "wooden-drums" }}>
                Discover our drums <ArrowRight />
              </Link>
            </Button>
          </article>
          <article className="service-item">
            <RotateCw />
            <h3>Cable Rewinding</h3>
            <p>
              A broken drum need not interrupt your work. Our mobile heavy-duty cable rewinder
              offers a practical solution.
            </p>
            <Button variant="link" className="px-0" asChild>
              <Link to="/services/$slug" params={{ slug: "cable-rewinding" }}>
                Speak to our team <ArrowRight />
              </Link>
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
export function FAQList() {
  return (
    <Accordion type="single" collapsible className="max-w-3xl">
      {faqs.map(([q, a], i) => (
        <AccordionItem key={q} value={String(i)}>
          <AccordionTrigger className="text-sm text-left">{q}</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-7">
            {a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
export function ContactDetails() {
  return (
    <div>
      <div className="eyebrow">DIRECT CONNECTIONS</div>
      <h2 className="section-title">Let’s talk.</h2>
      <p className="section-copy">
        Product advice, custom requirements or your next project. We’re ready to help.
      </p>
      <div className="contact-line">
        <MapPin />
        <div>
          <strong>Visit Bracon</strong>
          <p>
            KM 34, Lagos Abeokuta Express Way,
            <br />
            Amje Alakuko, Nigeria.
          </p>
        </div>
      </div>
      <div className="contact-line">
        <Mail />
        <div>
  <strong>Email our team</strong>
  <a href="mailto:sales@braconwire.com">sales@braconwire.com
       &
  </a>
  <a href="mailto:admin@braconwire.com">admin@braconwire.com</a>
</div>
      </div>
      <div className="contact-line">
        <Phone />
        <div>
          <strong>Give us a call</strong>
          <a href="tel:+2348050925884">+234 805 092 5884   &</a>
          <a href="tel:+2348023016776">+234 802 301 6776</a>
        </div>
      </div>
    </div>
  );
}
export function TrustBand() {
  const items = [
    { Icon: ShieldCheck, title: "Tested. Trusted. Durable.", sub: "Quality in every connection" },
    { Icon: Factory, title: "Made in Nigeria", sub: "Proudly Nigerian-owned" },
    { Icon: Cable, title: "Built for your needs", sub: "Custom cable solutions" },
    { Icon: Truck, title: "Nationwide network", sub: "Connecting across Nigeria" },
  ];
  return (
    <section className="trust-band">
      <div className="site-container trust-grid">
        {items.map(({ Icon, title, sub }) => (
          <div key={title} className="trust-item">
            <Icon />
            <div>
              <strong>{title}</strong>
              <small>{sub}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
