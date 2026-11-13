import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import GrainOverlay from "@/components/ui/GrainOverlay";
import "./globals.css";
import { PILLARS } from "@/lib/data/pillars";
import { ADDRESS, CONTACT_EMAIL, PHONE_TEL, SITE_URL } from "@/lib/seo";
import { DEFAULT_TITLE, SITE_DESCRIPTION, SOCIALS } from "@/lib/site";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const OG_IMAGE = `${SITE_URL}/images/og/default.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | Dorza" },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Dorza",
    locale: "en_AU",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Dorza. You run the business. We'll mind the tech." }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3328",
};

function JsonLd() {
  // National brand, real local base: the address stays true so local search still has an anchor.
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Dorza",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: OG_IMAGE,
    image: OG_IMAGE,
    email: CONTACT_EMAIL,
    telephone: PHONE_TEL,
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postcode,
      addressCountry: ADDRESS.country,
    },
    areaServed: { "@type": "Country", name: "Australia" },
    sameAs: SOCIALS.map((s) => s.href),
    knowsAbout: [
      "web design",
      "search engine optimisation",
      "Google Business Profile",
      "online booking systems",
      "website hosting and support",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dorza services",
      itemListElement: PILLARS.flatMap((p) =>
        p.services
          .filter((s) => s.status === "live")
          .map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, description: s.blurb },
            eligibleRegion: { "@type": "Country", name: "AU" },
          }))
      ),
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

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${newsreader.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <JsonLd />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        <GrainOverlay />
        <Analytics />
      </body>
    </html>
  );
}
