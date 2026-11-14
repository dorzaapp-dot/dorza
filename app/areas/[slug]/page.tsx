import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { AREAS, getAreaBySlug, getNearbySlugs } from "@/lib/data/areas";
import { SITE_URL, PHONE_TEL, CONTACT_EMAIL } from "@/lib/seo";
import { SERVICES, servicePillar } from "@/lib/data/services";
import { StatusTag } from "@/components/ui/StatusTag";

import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PlusList } from "@/components/ui/PlusList";
import { RelatedWork } from "@/components/work/RelatedWork";
import { visibleCaseStudies } from "@/lib/data/work";
import { pageMetadata } from "@/lib/site";

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

  return pageMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/areas/${area.slug}`,
  });
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

      <main id="main">
        {/* Hero */}
        <InnerHero
          eyebrow={area.eyebrow}
          title={area.title}
          description={area.description}
          breadcrumbs={breadcrumbs}
        />

        {/* Local context */}
        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading max-w-2xl">
                {area.isHub
                  ? "The opportunity in Western Sydney."
                  : `Why ${area.name} businesses need to be online.`}
              </h2>
              <p className="d-lede mt-6 max-w-text">{area.localContext}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 max-w-text">
              <PlusList items={area.localPoints} />
            </Reveal>
          </Container>
        </section>

        {/* Services available */}
        <section className="bg-haze py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading max-w-2xl">
                {area.isHub
                  ? "Services for Western Sydney businesses."
                  : `Services available in ${area.name}.`}
              </h2>
            </Reveal>
            <Reveal stagger={0.045} className="mt-10 grid gap-x-12 md:grid-cols-2">
              {SERVICES.map((service) => {
                const pillar = servicePillar(service);
                if (!pillar) return null;
                return (
                  <a
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group block border-t border-rule py-5 transition-colors duration-fast ease-dorza"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="font-body text-[17px] font-semibold text-ink transition-colors duration-fast ease-dorza group-hover:text-pine">
                        {pillar.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <StatusTag status={pillar.status} />
                        <ArrowRight
                          size={18}
                          className="text-ink-mute transition-transform duration-fast ease-dorza group-hover:translate-x-1 group-hover:text-pine"
                          aria-hidden
                        />
                      </span>
                    </span>
                    <span className="d-body mt-2 block">{pillar.blurb}</span>
                  </a>
                );
              })}
            </Reveal>
          </Container>
        </section>

        {/* Business types */}
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading max-w-2xl">
                {area.isHub
                  ? "Business types across Western Sydney."
                  : `Business types we serve in ${area.name}.`}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="m-0 mt-10 grid list-none gap-x-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {area.businessTypes.map((type) => (
                  <li key={type} className="d-body border-t border-rule-soft py-4 text-ink">
                    {type}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>

        {/* Nearby areas */}
        {nearbyAreas.length > 0 && (
          <section className="bg-paper py-section-tight md:py-section">
            <Container>
              <Reveal>
                <h2 className="d-heading max-w-2xl">
                  {area.isHub
                    ? "Suburbs across Western Sydney."
                    : `Areas near ${area.name}.`}
                </h2>
              </Reveal>
              <Reveal stagger={0.045} className="mt-10 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyAreas.map((nearby) => (
                  <a
                    key={nearby.slug}
                    href={`/areas/${nearby.slug}`}
                    className="group flex items-baseline justify-between gap-4 border-t border-rule py-5"
                  >
                    <span className="font-body text-[17px] font-semibold text-ink transition-colors duration-fast ease-dorza group-hover:text-pine">
                      {nearby.name}
                    </span>
                    <span className="d-mono text-ink-soft">{nearby.postcode}</span>
                  </a>
                ))}
              </Reveal>
            </Container>
          </section>
        )}

        <RelatedWork studies={visibleCaseStudies().filter((c) => c.areas?.includes(area.slug))} />

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
