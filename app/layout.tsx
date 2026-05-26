import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

const SITE_URL = "https://dorza.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Web Design & Social Media Sydney — Done For You | Dorza",
  description:
    "Dorza builds websites and runs social media for Sydney small businesses. Cafes, tradies, salons. Live in 24 hours. From $199/mo. No lock-in contracts.",
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/images/mockups/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/images/mockups/favicon.svg",
    apple: "/images/mockups/favicon.svg",
  },
  openGraph: {
    title: "Dorza — Web Design & Social Media Sydney, Done For You",
    description:
      "Dorza builds websites and runs social media for Sydney small businesses. Live in 24 hours. From $199/mo. No lock-in contracts.",
    url: SITE_URL,
    siteName: "Dorza",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dorza — Web Design & Social Media Sydney, Done For You",
    description:
      "Dorza builds websites and runs social media for Sydney small businesses. From $199/mo. No lock-in contracts.",
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
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dorza",
    description:
      "AI-native digital agency for Sydney local businesses. Websites, social media, Google Business, and AI agents — done for you.",
    url: SITE_URL,
    areaServed: { "@type": "City", name: "Sydney", sameAs: "https://www.wikidata.org/wiki/Q3130" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      postalCode: "2000",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@dorza.com.au",
      contactType: "customer service",
      areaServed: "AU",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.instagram.com/dorza.ai/",
      "https://www.linkedin.com/company/dorzaai/",
    ],
    knowsAbout: [
      "digital marketing",
      "web design",
      "social media management",
      "SEO",
      "AI agents",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dorza",
    url: SITE_URL,
    inLanguage: "en-AU",
    publisher: { "@type": "Organization", name: "Dorza" },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const pricing = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dorza Pricing Plans",
    itemListElement: plans.map((plan, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: plan.name,
        description: plan.description,
        url: `${SITE_URL}/#pricing`,
        price: String(plan.monthly),
        priceCurrency: "AUD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(plan.monthly),
          priceCurrency: "AUD",
          unitCode: "MON",
        },
        eligibleRegion: { "@type": "Country", name: "AU" },
      },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricing) }}
      />
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
        <Analytics />
      </body>
    </html>
  );
}
