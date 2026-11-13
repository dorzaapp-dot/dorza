import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SERVICES, getServiceBySlug, getRelatedServices } from "@/lib/data/services";
import { RelatedWork } from "@/components/work/RelatedWork";
import { visibleCaseStudies } from "@/lib/data/work";
import { SITE_URL } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

/* ---------- static params ---------- */

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

/* ---------- metadata ---------- */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

/* ---------- page ---------- */

export default function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const related = getRelatedServices(service.relatedSlugs);

  /* --- structured data --- */

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services/web-design`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title.replace(/\.$/, ""),
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  // JSON-LD is hardcoded data from our own data file, not user input
  const breadcrumbJson = JSON.stringify(breadcrumbLd);
  const faqJson = JSON.stringify(faqLd);

  return (
    <>
      {/* structured data - safe: content is hardcoded, not user-supplied */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJson }}
      />

      <Nav />

      <main id="main">
        <InnerHero
          eyebrow={service.eyebrow}
          title={service.title}
          description={service.description}
          breadcrumbs={[
            { label: "Services", href: "/services/web-design" },
            { label: service.title.replace(/\.$/, ""), href: `/services/${service.slug}` },
          ]}
        />

        {/* problem */}
        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-6">
                <h2 className="d-heading">{service.problemHeadline}</h2>
                <p className="d-lede mt-5 max-w-text">{service.problemDescription}</p>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-6">
                <ul className="m-0 list-none p-0">
                  {service.problemPoints.map((point) => (
                    <li key={point} className="d-body border-t border-rule-soft py-4 last:border-b">
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* solution and features */}
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">{service.solutionHeadline}</h2>
                <p className="d-body mt-5">{service.solutionDescription}</p>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <ul className="m-0 list-none p-0">
                  {service.features.map((feature) => (
                    <li key={feature.title} className="border-t border-rule-soft py-5 last:border-b">
                      <h3 className="font-body text-[17px] font-semibold text-ink">{feature.title}</h3>
                      <p className="d-body mt-2">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* how it works */}
        <section className="bg-haze py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading">Three steps.</h2>
            </Reveal>

            <Reveal stagger={0.045} className="mt-10 grid gap-y-8 md:grid-cols-3 md:gap-x-8">
              {service.steps.map((step, i) => (
                <div key={step.title} className="border-t border-rule pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <p className="d-mono text-forest">{i + 1}</p>
                  <h3 className="mt-3 font-body text-[17px] font-semibold text-ink">{step.title}</h3>
                  <p className="d-body mt-2">{step.description}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* FAQ */}
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-4">
                <h2 className="d-heading">Common questions.</h2>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7 md:col-start-6">
                <ul className="m-0 list-none p-0">
                  {service.faqs.map((faq) => (
                    <li key={faq.q} className="border-t border-rule-soft py-6 last:border-b">
                      <h3 className="font-body text-[17px] font-semibold text-ink">{faq.q}</h3>
                      <p className="d-body mt-3">{faq.a}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* related services */}
        {related.length > 0 && (
          <section className="bg-paper py-section-tight md:py-section">
            <Container>
              <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
                <Reveal className="md:col-span-4">
                  <h2 className="d-heading">You might also need.</h2>
                </Reveal>

                <Reveal delay={0.09} className="md:col-span-7 md:col-start-6">
                  <ul className="m-0 list-none p-0">
                    {related.map((rel) => (
                      <li key={rel.slug} className="border-t border-rule-soft last:border-b">
                        <Link href={`/services/${rel.slug}`} className="group block py-5">
                          <h3 className="font-body text-[17px] font-semibold text-ink">{rel.title}</h3>
                          <p className="d-body mt-2 line-clamp-2">{rel.description}</p>
                          <span className="d-link mt-3 inline-flex items-center gap-1.5 text-[14px]">
                            More on this service
                            <ArrowRight
                              size={14}
                              aria-hidden
                              className="transition-transform duration-fast ease-dorza group-hover:translate-x-1"
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </Container>
          </section>
        )}

        <RelatedWork studies={visibleCaseStudies().filter((c) => c.services.includes(service.slug))} />

        <PageCTA />
      </main>
      <Footer />
    </>
  );
}
