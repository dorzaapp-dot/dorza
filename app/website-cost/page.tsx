import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { PlusList } from "@/components/ui/PlusList";
import { Reveal } from "@/components/motion/Reveal";

const PAGE_TITLE = "How much does a small business website cost?";
const PAGE_DESCRIPTION =
  "What a small business website costs in Australia and what changes the price. Dorza builds custom sites from $499, with an exact quote in 72 hours.";

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
        url: `${SITE_URL}/images/og/default.png`,
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
      "A single page costs less than a build with separate service, about and contact pages. More pages means more design and more copy.",
  },
  {
    title: "Custom design or a template",
    description:
      "A template you fill in is cheap, and it looks like everyone else's. A design built around your business costs more and earns more trust.",
  },
  {
    title: "What it needs to do",
    description:
      "Online bookings, ordering, galleries and contact forms all add work. A simple brochure site is the cheapest place to start.",
  },
  {
    title: "Copywriting and photos",
    description:
      "Writing the words and sorting the images is real work. If you supply your own, it costs less than us producing them for you.",
  },
  {
    title: "Whether it's managed afterwards",
    description:
      "A site you run yourself is a one-off cost. Ongoing social, Google Business Profile and local SEO are optional, and priced separately.",
  },
];

const faqs = [
  {
    q: "Is there a monthly fee?",
    a: "No required subscription. The build is a one-off cost. Optional ongoing management is quoted separately, and there's no lock-in.",
  },
  {
    q: "What's included in the $499 starting price?",
    a: "A custom-designed, mobile-first website plus Google Business Profile setup, built to be found by people nearby. The final scope is tailored to what your business needs.",
  },
  {
    q: "Do I own the website?",
    a: "Yes. You own everything we build. If you ever leave, it comes with you.",
  },
  {
    q: "How long does it take?",
    a: "You get a plan and an exact price within 72 hours. We start building after you approve the plan.",
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

      <main id="main">
        <InnerHero
          title="What a small business website costs."
          description="In Australia, a small business website can cost anywhere from a few hundred dollars to several thousand, depending on what it needs to do. Dorza custom builds start from $499, and you get an exact price before you commit to anything."
          breadcrumbs={[{ label: "Pricing guide", href: "/website-cost" }]}
        />

        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">What moves the price.</h2>
                <p className="d-body mt-5">
                  Two websites are never the same. Here&apos;s what changes what
                  you pay, so you know where your money goes before we quote
                  you.
                </p>
                <p className="d-body mt-5">
                  Most of it comes down to one question: how custom does it need
                  to be? See what goes into a build on our{" "}
                  <Link href="/services/web-design" className="d-link">
                    web design page
                  </Link>
                  .
                </p>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <ul className="m-0 list-none p-0">
                  {priceFactors.map((factor) => (
                    <li
                      key={factor.title}
                      className="border-t border-rule-soft py-5 last:border-b"
                    >
                      <h3 className="font-body text-[17px] font-semibold text-ink">
                        {factor.title}
                      </h3>
                      <p className="d-body mt-2">{factor.description}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">Quoted to the job.</h2>
                <p className="d-body mt-5">
                  No packages to squeeze into. Every build is priced to what
                  your business needs, with the number agreed up front.
                </p>
                <p className="d-body mt-5">
                  Want to be found once the site is live? Add{" "}
                  <Link href="/services/local-seo" className="d-link">
                    local SEO
                  </Link>{" "}
                  or done-for-you{" "}
                  <Link
                    href="/services/social-media-management"
                    className="d-link"
                  >
                    social media management
                  </Link>
                  . Both are priced into the same quote.
                </p>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <PlusList
                  items={[
                    "Custom websites from $499, quoted to what your business needs.",
                    "An exact plan and price within 72 hours of you getting in touch.",
                    "Optional ongoing management of posts, Google and reviews, built into the quote if you want it.",
                    "No lock-in contracts. You own everything we build.",
                  ]}
                />
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-haze py-section-tight md:py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">Common questions.</h2>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <ul className="m-0 list-none p-0">
                  {faqs.map((faq) => (
                    <li
                      key={faq.q}
                      className="border-t border-rule py-5 last:border-b"
                    >
                      <h3 className="font-body text-[17px] font-semibold text-ink">
                        {faq.q}
                      </h3>
                      <p className="d-body mt-2">{faq.a}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        <PageCTA
          headline="Want an exact price?"
          description="Tell us about your business. We'll come back with a plan and an exact price within 72 hours. No lock-in."
        />
      </main>

      <Footer />
    </>
  );
}
