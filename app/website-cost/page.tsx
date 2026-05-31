import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const PAGE_TITLE =
  "How Much Does a Small Business Website Cost? | Western Sydney | Dorza";
const PAGE_DESCRIPTION =
  "What a small business website really costs in Australia — and what affects the price. Dorza builds custom sites from $499, with an exact quote in 72 hours. No lock-in.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/website-cost` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/website-cost`,
    siteName: "Dorza",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-default.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

const priceFactors = [
  {
    title: "Number of pages",
    description:
      "A tight one-page site costs less than a multi-page build with separate service, about and contact pages. More pages means more design and more copy.",
  },
  {
    title: "Custom design vs a template",
    description:
      "A template you fill in is cheap but looks like everyone else's. A custom design built around your business costs more — and actually wins you trust.",
  },
  {
    title: "Features it needs to do",
    description:
      "Online bookings, ordering, photo galleries and smart contact forms all add work. A simple brochure site is the cheapest place to start.",
  },
  {
    title: "Copywriting and photos",
    description:
      "Writing the words and sorting the images is real work. If you supply your own copy and photos it costs less than us producing them for you.",
  },
  {
    title: "Whether it's managed afterwards",
    description:
      "A site you run yourself is a one-off cost. Ongoing social, Google Business and local SEO are optional extras, priced separately when you want them.",
  },
];

const faqs = [
  {
    q: "Is there a monthly fee?",
    a: "No required subscription — the build is a one-off cost. Optional ongoing management is quoted separately if you want it, and there's no lock-in.",
  },
  {
    q: "What's included in the $499 starting price?",
    a: "A custom-designed, mobile-first website plus Google Business Profile setup, built to get found by locals. The final scope is tailored to what your business actually needs.",
  },
  {
    q: "Do I own the website?",
    a: "Yes — you own everything we build. If you ever leave, it comes with you.",
  },
  {
    q: "How long does it take?",
    a: "Once you approve the plan, your site can be live within 24 hours.",
  },
];

const breadcrumbJsonLd = {
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
      name: "Pricing guide",
      item: `${SITE_URL}/website-cost`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function WebsiteCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Nav />

      <main>
        <InnerHero
          eyebrow="// Pricing guide"
          title="How much does a small business website cost in Western Sydney?"
          description="In Australia, a small-business website usually costs anywhere from a few hundred to several thousand dollars, depending on what it needs to do. At Dorza, custom builds start from $499 — and you'll get an exact price before you commit to anything."
          breadcrumbs={[{ label: "Pricing guide", href: "/website-cost" }]}
        />

        {/* What affects the price */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// What affects the price"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
                Five things that move the price
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-text-secondary max-w-2xl">
                Two websites are never the same. Here&apos;s what actually
                changes what you pay — so you know where your money goes before
                we quote you.
              </p>
            </Reveal>

            <Reveal
              stagger
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {priceFactors.map((factor) => (
                <div
                  key={factor.title}
                  className="bg-white border border-border rounded-card p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                    <Check size={18} className="text-accent" />
                  </div>
                  <h3 className="font-semibold text-dark text-[15px] mb-2">
                    {factor.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-text-secondary">
                    {factor.description}
                  </p>
                </div>
              ))}
            </Reveal>

            <Reveal>
              <p className="mt-10 text-[15px] leading-relaxed text-text-secondary max-w-2xl">
                Most of these come down to one question: how custom does it need
                to be? See exactly what goes into a build on our{" "}
                <Link
                  href="/services/web-design"
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors"
                >
                  web design page
                </Link>
                .
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Why agencies charge $5,000+ */}
        <section className="py-20 md:py-[7.5rem] bg-white">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// Why agencies charge $5,000+"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
                You&apos;re paying for the bloat, not the website
              </h2>
            </Reveal>

            <Reveal>
              <div className="mt-8 max-w-2xl space-y-6">
                <p className="text-[17px] leading-relaxed text-text-secondary">
                  Traditional agencies pile on pitch decks, discovery phases,
                  account managers and six-week timelines. By the time anyone
                  builds anything, you&apos;ve already paid for a lot of
                  meetings.
                </p>
                <p className="text-[17px] leading-relaxed text-text-secondary">
                  Dorza cuts that bloat. A small, senior team does the work
                  directly — so you get agency-quality results from a few
                  hundred dollars, not a few thousand. Same standard, none of
                  the overhead.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* How Dorza prices it */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// How Dorza prices it"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark max-w-3xl">
                Quoted to what your business actually needs
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-text-secondary max-w-2xl">
                No packages to squeeze yourself into. Every build is bespoke,
                priced to the job, with the number agreed up front.
              </p>
            </Reveal>

            <Reveal>
              <ul className="mt-10 grid gap-4 max-w-2xl">
                {[
                  "Custom websites from $499 — every build quoted to what your business needs",
                  "An exact plan and price within 72 hours of you reaching out",
                  "Founding clients get 50% off their build — the first 20 Western Sydney businesses",
                  "Optional ongoing management — posts, Google and reviews — built into the quote if you want it",
                  "No lock-in contracts, and you own everything we build",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                      <Check size={13} className="text-accent" />
                    </span>
                    <span className="text-[17px] leading-relaxed text-text-secondary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <p className="mt-10 text-[15px] leading-relaxed text-text-secondary max-w-2xl">
                Want to get found once the site is live? Bundle in{" "}
                <Link
                  href="/services/local-seo"
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors"
                >
                  local SEO
                </Link>{" "}
                or done-for-you{" "}
                <Link
                  href="/services/social-media-management"
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors"
                >
                  social media management
                </Link>{" "}
                — both priced into the same quote.
              </p>
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
              {faqs.map((faq, i) => (
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

        <PageCTA
          headline="Want an exact price?"
          description="Tell us about your business and we'll come back with a free audit, a plan, and an exact price within 72 hours. No pitch decks, no lock-in."
        />
      </main>

      <Footer />
    </>
  );
}
