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
import { SERVICES, getServiceBySlug, getRelatedServices } from "@/lib/data/services";
import { SITE_URL } from "@/lib/seo";

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

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${SITE_URL}/services/${service.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/services/${service.slug}`,
    },
  };
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
        name: service.title,
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

      {/* hero */}
      <InnerHero
        eyebrow={service.eyebrow}
        title={service.title}
        description={service.description}
        breadcrumbs={[
          { label: "Services", href: "/services/web-design" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      />

      {/* problem section */}
      <section className="py-20 md:py-[7.5rem] bg-warm">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// The problem"}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
              {service.problemHeadline}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-text-secondary max-w-2xl">
              {service.problemDescription}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-10 grid gap-4 max-w-2xl">
              {service.problemPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[9px] block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                  />
                  <span className="text-[15px] leading-relaxed text-text-secondary">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* solution + features */}
      <section className="py-20 md:py-[7.5rem] bg-white">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// How we solve it"}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
              {service.solutionHeadline}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-text-secondary max-w-2xl">
              {service.solutionDescription}
            </p>
          </Reveal>

          <Reveal stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                  <Check size={18} className="text-accent" />
                </div>
                <h3 className="font-semibold text-dark text-[15px] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* how it works */}
      <section className="py-20 md:py-[7.5rem] bg-warm">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// How it works"}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark">
              Three steps. That&apos;s it.
            </h2>
          </Reveal>

          <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.steps.map((step, i) => (
              <div key={step.title} className="relative">
                <span className="font-display text-[64px] leading-none text-primary/10 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold text-dark text-[17px]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-[7.5rem] bg-white">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// FAQ"}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark">
              Common questions
            </h2>
          </Reveal>

          <div className="mt-12 max-w-2xl divide-y divide-border">
            {service.faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.08}>
                <div className="py-8 first:pt-0 last:pb-0">
                  <h3 className="font-semibold text-dark text-[16px]">
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* related services */}
      {related.length > 0 && (
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// Related services"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark">
                You might also need
              </h2>
            </Reveal>

            <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  className="group bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza block"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
                    {rel.eyebrow}
                  </p>
                  <h3 className="font-semibold text-dark text-[17px] mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-text-secondary line-clamp-2 mb-4">
                    {rel.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 gap-1.5 transition-all duration-300 ease-dorza">
                    {`Explore ${rel.title}`}
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

      <PageCTA />
      <Footer />
    </>
  );
}
