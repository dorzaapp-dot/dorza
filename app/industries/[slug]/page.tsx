import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import { Container } from "@/components/ui/Container";
import { PlusList } from "@/components/ui/PlusList";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES, getIndustryBySlug } from "@/lib/data/industries";
import { SERVICES } from "@/lib/data/services";
import { SITE_URL } from "@/lib/seo";

/* ---------- static params ---------- */

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

/* ---------- metadata ---------- */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) return {};

  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: `${SITE_URL}/industries/${industry.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/industries/${industry.slug}`,
    },
  };
}

/* ---------- page ---------- */

export default function IndustryPage({
  params,
}: {
  params: { slug: string };
}) {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) notFound();

  const relevantServices = SERVICES.filter((s) =>
    industry.relevantServiceSlugs.includes(s.slug)
  );

  /* --- structured data --- */
  /* Safe: all values come from our own hardcoded data file, not user input */

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
        name: industry.name,
        item: `${SITE_URL}/industries/${industry.slug}`,
      },
    ],
  };

  const breadcrumbJson = JSON.stringify(breadcrumbLd);

  return (
    <>
      {/* structured data - safe: content is hardcoded, not user-supplied */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJson }}
      />

      <Nav />

      <main id="main">
        {/* hero */}
        <InnerHero
          title={industry.title}
          description={industry.description}
          breadcrumbs={[
            { label: industry.name, href: `/industries/${industry.slug}` },
          ]}
        />

        {/* pain points */}
        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">The problems we solve.</h2>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <ul className="m-0 list-none p-0">
                  {industry.painPoints.map((point) => (
                    <li
                      key={point.title}
                      className="border-t border-rule-soft py-5 last:border-b"
                    >
                      <h3 className="font-body text-[17px] font-semibold text-ink">
                        {point.title}
                      </h3>
                      <p className="d-body mt-2">{point.description}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* solutions */}
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">
                  Tailored for {industry.name.toLowerCase()}.
                </h2>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <ul className="m-0 list-none p-0">
                  {industry.solutions.map((solution) => (
                    <li
                      key={solution.title}
                      className="border-t border-rule-soft py-5 last:border-b"
                    >
                      <h3 className="font-body text-[17px] font-semibold text-ink">
                        {solution.title}
                      </h3>
                      <p className="d-body mt-2">{solution.description}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* features */}
        <section className="bg-haze py-section-tight md:py-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">Everything you need.</h2>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <PlusList items={industry.features} />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* relevant services */}
        {relevantServices.length > 0 && (
          <section className="bg-paper py-section-tight md:py-section">
            <Container>
              <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
                <Reveal className="md:col-span-5">
                  <h2 className="d-heading">
                    Services for {industry.name.toLowerCase()}.
                  </h2>
                </Reveal>

                <Reveal delay={0.09} className="md:col-span-7">
                  <ul className="m-0 list-none p-0">
                    {relevantServices.map((service) => (
                      <li
                        key={service.slug}
                        className="border-t border-rule-soft last:border-b"
                      >
                        <Link
                          href={`/services/${service.slug}`}
                          className="group block py-5"
                        >
                          <h3 className="font-body text-[17px] font-semibold text-ink">
                            {service.title}
                          </h3>
                          <p className="d-body mt-2 line-clamp-2">
                            {service.description}
                          </p>
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

        <PageCTA
          headline="Tell us where you’re up to."
        />
      </main>
      <Footer />
    </>
  );
}
