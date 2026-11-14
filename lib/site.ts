import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const TAGLINE = "You run the business. We'll mind the tech.";

export const SITE_DESCRIPTION =
  "Websites, booking systems, Google setup and ongoing support for Australian small businesses, from one team. A plan and a price in 72 hours. No lock-in.";

export const DEFAULT_TITLE = "Dorza | Small business websites, systems and support";

export const CTA_LABEL = "Get a quote";

export const ABN = "76 634 304 017";

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/dorza.digital/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dorzaai/" },
] as const;

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Start", href: "/start" },
  { label: "Grow", href: "/grow" },
  { label: "Support", href: "/support" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: "Dorza",
    links: [
      { label: "Start", href: "/start" },
      { label: "Grow", href: "/grow" },
      { label: "Support", href: "/support" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All services", href: "/services" },
      { label: "Web design", href: "/services/web-design" },
      { label: "Local SEO", href: "/services/local-seo" },
      { label: "Google Business Profile", href: "/services/google-business-profile" },
      { label: "Booking systems", href: "/services/booking-systems" },
      { label: "Online stores", href: "/services/online-store" },
      { label: "CRM setup", href: "/services/crm-setup" },
      { label: "Google Ads", href: "/services/google-ads" },
      { label: "Business email", href: "/services/business-email" },
      { label: "Social media", href: "/services/social-media-management" },
      { label: "What a website costs", href: "/website-cost" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Areas", href: "/areas" },
      { label: "Cafes and restaurants", href: "/industries/cafes-restaurants" },
      { label: "Tradies", href: "/industries/tradies" },
      { label: "Salons and beauty", href: "/industries/salons-beauty" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

/** Strip any trailing "| Dorza" so the layout's "%s | Dorza" template adds it exactly once. */
export function cleanTitle(title: string): string {
  return title.replace(/(\s*[|—-]\s*Dorza)+\s*$/i, "").trim();
}

/** Absolute canonical URL for a path, with no trailing slash. */
export function canonical(path: string): string {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE_URL}${clean}`;
}

/** Metadata for one page: clean title, its own canonical, share image. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/images/og/default.png",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const clean = cleanTitle(title);
  const url = canonical(path);
  const imageUrl = `${SITE_URL}${image}`;
  return {
    title: clean,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${clean} | Dorza`,
      description,
      url,
      siteName: "Dorza",
      locale: "en_AU",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: `${clean} | Dorza`, description, images: [imageUrl] },
  };
}
