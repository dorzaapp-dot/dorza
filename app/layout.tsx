import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import GrainOverlay from "@/components/ui/GrainOverlay";
import { faqs } from "@/lib/data/faq";

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
    "Dorza builds websites, runs social media, and manages Google Business for small businesses across Western Sydney. Parramatta, Blacktown, Penrith, Liverpool. Custom websites from $499. No lock-in.",
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/images/mockups/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/images/mockups/favicon.svg",
    apple: "/images/mockups/favicon.svg",
  },
  openGraph: {
    title: "Dorza — Web Design & Digital Marketing for Western Sydney Small Business",
    description:
      "Websites, social media, and Google Business done for you. Cafes, tradies, salons across Parramatta, Blacktown, Penrith, Liverpool. Custom websites from $499.",
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
      "Websites, social media, and Google Business done for you. Custom websites from $499. No lock-in.",
    images: [`${SITE_URL}/images/og-default.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const serviceOffers = [
  { name: "Web Design", description: "Custom-designed, mobile-first websites for Western Sydney small businesses, built to get found by locals." },
  { name: "Social Media Management", description: "Done-for-you Instagram and Facebook — content, scheduling, and posting." },
  { name: "Google Business Profile Setup", description: "Google Business Profile setup and optimisation to help you show up on Google Maps." },
  { name: "Local SEO", description: "Local SEO to help your business rank for nearby searches." },
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
    telephone: "+61494436553",
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
      telephone: "+61494436553",
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
      "AI marketing assistant",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dorza Services",
      itemListElement: serviceOffers.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
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
