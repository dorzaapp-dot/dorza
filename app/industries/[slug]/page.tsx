import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import { Container } from "@/components/ui/Container";
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

      {/* hero */}
      <InnerHero
        eyebrow={industry.eyebrow}
        title={industry.title}
        description={industry.description}
        breadcrumbs={[
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
      />

      {/* pain points */}
      <section className="py-20 md:py-[7.5rem] bg-warm">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// Sound familiar?"}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
              The problems we solve
            </h2>
          </Reveal>

          <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl">
            {industry.painPoints.map((point) => (
              <div
                key={point.title}
                className="bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza"
              >
                <h3 className="font-semibold text-dark text-[16px] mb-2">
                  {point.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  {point.description}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* solutions */}
      <section className="py-20 md:py-[7.5rem] bg-white">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// How we help"}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
              Tailored for {industry.name.toLowerCase()}
            </h2>
          </Reveal>

          <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl">
            {industry.solutions.map((solution) => (
              <div
                key={solution.title}
                className="bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza"
              >
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint">
                  <Check size={16} className="text-accent" />
                </div>
                <h3 className="font-semibold text-dark text-[16px] mb-2">
                  {solution.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  {solution.description}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* features + outcomes */}
      <section className="py-20 md:py-[7.5rem] bg-warm">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl">
            {/* features */}
            <Reveal>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                  {"// What's included"}
                </p>
                <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark mb-8">
                  Everything you need
                </h2>
                <ul className="space-y-4">
                  {industry.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                        <Check size={12} className="text-accent" />
                      </div>
                      <span className="text-[15px] leading-relaxed text-text-secondary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* outcomes */}
            <Reveal delay={0.15}>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                  {"// What good looks like"}
                </p>
                <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark mb-8">
                  What good looks like
                </h2>
                <div className="space-y-8">
                  {industry.outcomes.map((outcome) => (
                    <div key={outcome.label}>
                      <p className="font-display text-[40px] leading-none tracking-[-0.02em] text-primary">
                        {outcome.stat}
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                        {outcome.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* relevant services */}
      {relevantServices.length > 0 && (
        <section className="py-20 md:py-[7.5rem] bg-white">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// Services"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
                Services for {industry.name.toLowerCase()}
              </h2>
            </Reveal>

            <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relevantServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza block"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
                    {service.eyebrow}
                  </p>
                  <h3 className="font-semibold text-dark text-[17px] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-text-secondary line-clamp-2 mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 gap-1.5 transition-all duration-300 ease-dorza">
                    {`Explore ${service.title}`}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 ease-dorza group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </Reveal>
          </Container>
        </section>
      )}

      <PageCTA
        headline={`Ready to grow your ${industry.name.toLowerCase()} business?`}
      />
      <Footer />
    </>
  );
}
