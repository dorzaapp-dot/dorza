import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About Dorza — Built for Western Sydney Small Business",
  description:
    "Dorza is a Western Sydney digital agency that builds websites, runs social media, and manages Google Business for local small businesses. Custom websites from $499.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Dorza — Built for Western Sydney Small Business",
    description:
      "Dorza is a Western Sydney digital agency that builds websites, runs social media, and manages Google Business for local small businesses. Custom websites from $499.",
    url: `${SITE_URL}/about`,
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
      name: "About",
      item: `${SITE_URL}/about`,
    },
  ],
};

const differentiators = [
  "No lock-in contracts — cancel any time",
  "Live websites in 24 hours, not 8 weeks",
  "Custom websites from $499 — a fraction of agency prices",
  "Senior agency quality, delivered in days not weeks",
  "You own everything we build",
  "Real monthly reporting with real metrics",
];

const values = [
  {
    title: "Speed over perfection",
    description:
      "A good website live today beats a perfect one in 8 weeks.",
  },
  {
    title: "Transparency over jargon",
    description:
      "No buzzwords, no vague proposals. You know what you're getting.",
  },
  {
    title: "Results over activity",
    description:
      "We measure success by customers you got, not posts we made.",
  },
  {
    title: "Ownership over lock-in",
    description:
      "You own everything we build. If you leave, it comes with you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Nav />

      <main>
        <InnerHero
          eyebrow="// About Dorza"
          title="Built for Western Sydney"
          description="Dorza exists because small businesses in Western Sydney deserve better than overpriced agencies and DIY templates. We're here to give you a real digital presence — without the BS."
          breadcrumbs={[{ label: "About", href: "/about" }]}
        />

        {/* Story section */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// Why we exist"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark mb-10">
                Small business got a raw deal
              </h2>
            </Reveal>

            <Reveal>
              <div className="max-w-2xl space-y-6">
                <p className="text-[17px] leading-relaxed text-text-secondary">
                  Walk down Church Street Parramatta, Main Street Blacktown,
                  High Street Penrith — incredible cafes, tradies, salons.
                  The owner knows every client by name.
                </p>
                <p className="text-[17px] leading-relaxed text-text-secondary">
                  But online they&apos;re invisible. No website, no Google
                  Business, Facebook page from 2022. Big chains are
                  everywhere because they can afford agencies charging
                  $5,000+ for a basic site.
                </p>
                <p className="text-[17px] leading-relaxed text-text-secondary">
                  That&apos;s the gap Dorza fills. We&apos;ve built a faster,
                  leaner way of working — so we deliver agency-quality work at
                  a fraction of the price and the wait. No lock-in, no jargon,
                  just results.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* How We're Different */}
        <section className="py-20 md:py-[7.5rem] bg-white">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// How we're different"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark mb-10">
                Not your typical agency
              </h2>
            </Reveal>

            <Reveal>
              <ul className="max-w-2xl space-y-4">
                {differentiators.map((item) => (
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
          </Container>
        </section>

        {/* Values */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
                {"// What we believe"}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] text-dark mb-10">
                Our values
              </h2>
            </Reveal>

            <Reveal>
              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="bg-white border border-border rounded-card p-6"
                  >
                    <h3 className="font-display text-[22px] leading-tight tracking-[-0.02em] text-dark mb-2">
                      {value.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-text-secondary">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        <PageCTA
          headline="Want to work with us?"
          description="Tell us about your business. No pitch decks, no 4-week discovery phase — just a straight answer on what we can do for you."
        />
      </main>

      <Footer />
    </>
  );
}
