import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import GrainOverlay from "@/components/ui/GrainOverlay";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: true,
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
});

const SITE_URL = "https://dorza.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Web Design & Digital Marketing Western Sydney | Dorza",
    template: "%s | Dorza",
  },
  description:
    "Dorza builds websites, runs social media, and manages Google Business for small businesses across Western Sydney. Parramatta, Blacktown, Penrith, Liverpool. From $199/mo. No lock-in.",
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/images/mockups/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/images/mockups/favicon.svg",
    apple: "/images/mockups/favicon.svg",
  },
  openGraph: {
    title: "Dorza — Web Design & Digital Marketing for Western Sydney Small Business",
    description:
      "Websites, social media, and Google Business done for you. Cafes, tradies, salons across Parramatta, Blacktown, Penrith, Liverpool. From $199/mo.",
    url: SITE_URL,
    siteName: "Dorza",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Dorza — Web design and digital marketing for Western Sydney small business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dorza — Web Design & Digital Marketing Western Sydney",
    description:
      "Websites, social media, and Google Business done for you. From $199/mo. No lock-in.",
    images: [`${SITE_URL}/images/og-default.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const faqs = [
  {
    q: "How much does it cost?",
    a: "Our Starter plan is $199/month plus a one-time $499 setup fee. Growth is $349/month + $799 setup. Pro is $549/month + $1,299 setup. Right now, founding clients get 50% off setup — so Starter setup is just $249. No lock-in contracts.",
  },
  {
    q: "I've been burned by agencies before — why is this different?",
    a: "We get it. Most agencies overpromise, underdeliver, and go quiet. With Dorza, you see a real working website — not a proposal, not a mood board. If you're not happy, you don't pay for the next month. Simple.",
  },
  {
    q: "I don't have time for this.",
    a: "Good — you don't need to make time. We handle everything. You fill out a short form, review what we build, and say go. After that, we run it. You'll hear from us once a month with a performance report.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel any time, no questions asked. We don't do lock-in contracts. If you cancel, your website stays live for the rest of the month you've paid for. We'll hand over everything we've built — you own it.",
  },
  {
    q: "Can I just get one piece — say, only social media?",
    a: "Yes. Our Starter plan is website + Google Business only. If you only want social media management, talk to us — we can put together a custom package. We're flexible.",
  },
];

const plans = [
  { name: "Starter", monthly: 199, setup: 499, description: "Website + Google Business setup." },
  { name: "Growth", monthly: 349, setup: 799, description: "Website + Social (3 posts/week) + AI customer service chatbot + Review management." },
  { name: "Pro", monthly: 549, setup: 1299, description: "Full service: 5 posts/week + paid ad campaigns + monthly strategy call + priority support." },
];

function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Dorza",
    description:
      "Done-for-you web design, social media management, and Google Business setup for small businesses across Western Sydney. Parramatta, Blacktown, Penrith, Liverpool, Campbelltown.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/og-default.png`,
    image: `${SITE_URL}/images/og-default.png`,
    email: "customer@dorza.com.au",
    // TODO(C5 — phone): add a real AU number here, then also add tel: links in
    // Nav + Footer + llms.txt. e.g. telephone: "+61 2 1234 5678"
    address: {
      "@type": "PostalAddress",
      addressLocality: "Parramatta",
      addressRegion: "NSW",
      postalCode: "2150",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.8151,
      longitude: 151.0011,
    },
    areaServed: [
      { "@type": "City", name: "Parramatta", sameAs: "https://en.wikipedia.org/wiki/Parramatta" },
      { "@type": "City", name: "Blacktown" },
      { "@type": "City", name: "Penrith" },
      { "@type": "City", name: "Liverpool", containedInPlace: { "@type": "State", name: "New South Wales" } },
      { "@type": "City", name: "Campbelltown", containedInPlace: { "@type": "State", name: "New South Wales" } },
      { "@type": "City", name: "Sydney", sameAs: "https://www.wikidata.org/wiki/Q3130" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "customer@dorza.com.au",
      contactType: "sales",
      areaServed: "AU",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.instagram.com/dorza.ai/",
      "https://www.linkedin.com/company/dorzaai/",
    ],
    knowsAbout: [
      "web design",
      "social media management",
      "Google Business Profile",
      "local SEO",
      "digital marketing",
      "AI marketing agents",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dorza Services",
      itemListElement: plans.map((plan) => ({
        "@type": "Offer",
        name: `Dorza ${plan.name}`,
        description: plan.description,
        price: String(plan.monthly),
        priceCurrency: "AUD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(plan.monthly),
          priceCurrency: "AUD",
          unitCode: "MON",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
        eligibleRegion: { "@type": "Country", name: "AU" },
      })),
    },
    priceRange: "$$",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dorza",
    url: SITE_URL,
    inLanguage: "en-AU",
    publisher: { "@type": "Organization", name: "Dorza", "@id": `${SITE_URL}/#business` },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${jakarta.variable} ${instrument.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="font-body antialiased">
        {children}
        <GrainOverlay />
        <Analytics />
      </body>
    </html>
  );
}
