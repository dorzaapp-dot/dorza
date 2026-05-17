import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get your free consultation — Dorza",
  description:
    "Tell us about your business and we'll put together your free website mockup and social media plan within 24 hours.",
  robots: { index: false, follow: false },
};

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
