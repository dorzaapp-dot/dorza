import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact us: a plan and a price in 72 hours",
  description: "Call, email or send the form. You'll have a plan and a price from Dorza within 72 hours.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
