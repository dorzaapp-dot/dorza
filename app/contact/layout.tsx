import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Dorza — Western Sydney Web Design & Marketing",
  description:
    "Get in touch with Dorza. Based in Parramatta, serving all of Western Sydney. Call 0494 436 553 or email customer@dorza.com.au for a free consultation. Response within 72 hours.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact Dorza — Western Sydney Web Design & Marketing",
    description:
      "Get in touch for a free consultation. Based in Parramatta, serving all of Western Sydney.",
    url: `${SITE_URL}/contact`,
    siteName: "Dorza",
    locale: "en_AU",
    type: "website",
    images: [
      { url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630 },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
