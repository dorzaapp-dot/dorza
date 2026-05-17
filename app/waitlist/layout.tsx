import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Dorza waitlist — Sydney small business",
  description:
    "Be one of the first 20 founding Sydney clients and lock in 50% off your setup. Website, social media, and Google Business — done for you from $199/mo.",
  alternates: { canonical: "https://dorza.app/waitlist" },
  openGraph: {
    title: "Join the Dorza waitlist",
    description:
      "Founding offer: 50% off setup for the first 20 Sydney clients. From $199/mo. No lock-in.",
    url: "https://dorza.app/waitlist",
    type: "website",
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
