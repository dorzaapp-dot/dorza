import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";

import { AREAS, getAreaBySlug, getNearbySlugs } from "@/lib/data/areas";
import { SITE_URL, SERVICE_PAGES, PHONE_TEL, CONTACT_EMAIL } from "@/lib/seo";

import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return {
    title: area.metaTitle,
    description: area.metaDescription,
    openGraph: {
      title: area.metaTitle,
      description: area.metaDescription,
      url: `${SITE_URL}/areas/${area.slug}`,
      siteName: "Dorza",
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/areas/${area.slug}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const nearbyAreas = getNearbySlugs(area.nearbySlugs);

  const breadcrumbs = area.isHub
    ? [{ label: "Western Sydney", href: "/areas/western-sydney" }]
    : [
        { label: "Areas", href: "/areas/western-sydney" },
        { label: area.name, href: `/areas/${area.slug}` },
      ];

  /* ---- JSON-LD --------------------------------------------------- */

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...(area.isHub
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "Western Sydney",
              item: `${SITE_URL}/areas/western-sydney`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: "Areas",
              item: `${SITE_URL}/areas/western-sydney`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: area.name,
              item: `${SITE_URL}/areas/${area.slug}`,
            },
          ]),
    ],
  };

  const professionalServiceLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Dorza",
    url: SITE_URL,
    description: area.metaDescription,
    telephone: PHONE_TEL,
    email: CONTACT_EMAIL,
    areaServed: {
      "@type": "City",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: "NSW",
        postalCode: area.postcode,
        addressCountry: "AU",
      },
    },
    serviceType: [
      "Web Design",
      "Digital Marketing",
      "Local SEO",
      "Social Media Management",
    ],
  };

  /* Structured data uses only our own static constants — no user input */
  const breadcrumbLdJson = JSON.stringify(breadcrumbLd);
  const professionalServiceLdJson = JSON.stringify(professionalServiceLd);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbLdJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: professionalServiceLdJson }}
      />

      <Nav />

      <main>
        {/* Hero */}
        <InnerHero
          eyebrow={area.eyebrow}
          title={area.title}
          description={area.description}
          breadcrumbs={breadcrumbs}
        />

        {/* Local Context */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// Local insight"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-2xl">
                {area.isHub
                  ? "The opportunity in Western Sydney"
                  : `Why ${area.name} businesses need to be online`}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[17px] leading-relaxed text-text-secondary max-w-2xl">
                {area.localContext}
              </p>
            </Reveal>
            <Reveal delay={0.2} as="ul" className="mt-10 space-y-4 max-w-2xl">
              {area.localPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed text-text-secondary">
                    {point}
                  </span>
                </li>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* Services Available */}
        <section className="py-20 md:py-[7.5rem] bg-white">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// What we do"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-2xl">
                {area.isHub
                  ? "Services for Western Sydney businesses"
                  : `Services available in ${area.name}`}
              </h2>
            </Reveal>
            <Reveal stagger className="mt-12 grid md:grid-cols-2 gap-5">
              {SERVICE_PAGES.map((service) => (
                <a
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza flex items-center justify-between"
                >
                  <span className="text-[17px] font-semibold text-dark group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 ease-dorza"
                    aria-hidden
                  />
                </a>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* Business Types */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// Who we help"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-2xl">
                {area.isHub
                  ? "Business types across Western Sydney"
                  : `Business types we serve in ${area.name}`}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-3">
                {area.businessTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center h-9 px-4 rounded-full bg-white border border-border text-[14px] font-medium text-dark"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Nearby Areas */}
        {nearbyAreas.length > 0 && (
          <section className="py-20 md:py-[7.5rem] bg-white">
            <Container>
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                  {area.isHub ? "// Areas we serve" : "// Nearby areas"}
                </p>
                <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-2xl">
                  {area.isHub
                    ? "Suburbs across Western Sydney"
                    : `Areas near ${area.name}`}
                </h2>
              </Reveal>
              <Reveal stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {nearbyAreas.map((nearby) => (
                  <a
                    key={nearby.slug}
                    href={`/areas/${nearby.slug}`}
                    className="group bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin
                        size={18}
                        className="text-accent group-hover:text-primary transition-colors duration-300"
                        aria-hidden
                      />
                      <span className="text-[17px] font-semibold text-dark group-hover:text-primary transition-colors duration-300">
                        {nearby.name}
                      </span>
                    </div>
                    <p className="text-[13px] font-mono text-text-muted">
                      {nearby.postcode}
                    </p>
                  </a>
                ))}
              </Reveal>
            </Container>
          </section>
        )}

        {/* CTA */}
        <PageCTA
          headline={
            area.isHub
              ? "Ready to put your business on the map?"
              : `Ready to grow your ${area.name} business?`
          }
          description={
            area.isHub
              ? "Tell us about your Western Sydney business. We'll come back with a plan and a price within 72 hours."
              : `Tell us about your business in ${area.name}. We'll come back with a plan and a price within 72 hours.`
          }
        />
      </main>

      <Footer />
    </>
  );
}
