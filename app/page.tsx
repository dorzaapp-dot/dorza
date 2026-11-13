import Nav from "@/components/sections/Nav";
import HomeHero from "@/components/sections/home/HomeHero";
import HomeJourney from "@/components/sections/home/HomeJourney";
import HomeHowWeWork from "@/components/sections/home/HomeHowWeWork";
import HomePricing from "@/components/sections/home/HomePricing";
import FAQ from "@/components/sections/FAQ";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import Footer from "@/components/sections/Footer";
import type { Metadata } from "next";
import { faqs } from "@/lib/data/faq";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: SITE_URL } };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        <HomeHero />
        <HomeJourney />
        <HomeHowWeWork />
        <HomePricing />
        <FAQ />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}
