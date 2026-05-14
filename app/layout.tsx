import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dorza — The AI agency for Sydney small business",
  description:
    "We build your website, run your social media, and get you found on Google. Done-for-you. From $199/month. No lock-in.",
  openGraph: {
    title: "Dorza",
    description:
      "We build your website, run your social media, and get you found on Google. Done-for-you.",
    url: "https://dorza.app",
    siteName: "dorza",
    locale: "en_AU",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dorza",
    description:
      "AI-native digital agency for Sydney local businesses. Websites, social media, Google Business, and AI agents — done for you.",
    url: "https://dorza.app",
    areaServed: { "@type": "City", name: "Sydney" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@dorza.com.au",
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
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
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
