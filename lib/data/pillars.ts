export type PillarSlug = "start" | "grow" | "support";
export type ServiceStatus = "live" | "ask";

export interface PillarService {
  name: string;
  status: ServiceStatus;
  blurb: string;
  href?: string;
}

export interface PillarStep {
  title: string;
  body: string;
}

export interface Pillar {
  slug: PillarSlug;
  name: string;
  /** Mono label on the homepage timeline. */
  marker: string;
  headline: string;
  lede: string;
  intro: string;
  services: PillarService[];
  steps: PillarStep[];
  /** Slug of the case study that proves this pillar, if there is one. */
  proofSlug?: string;
  metaTitle: string;
  metaDescription: string;
}

export const PILLARS: Pillar[] = [
  {
    slug: "start",
    name: "Start",
    marker: "Day one",
    headline: "Open by Friday.",
    lede: "A website, a Google profile and somewhere for customers to reach you. Set up properly, from day one.",
    intro:
      "Opening a business means a hundred small jobs. The tech ones are ours. You tell us about the business once, and we build what your customers will see first.",
    services: [
      {
        name: "Website and hosting",
        status: "live",
        blurb: "A site designed for your business and built by hand, then hosted and kept up to date.",
        href: "/services/web-design",
      },
      {
        name: "Google Business Profile",
        status: "live",
        blurb: "So you show up on Google and Maps when people nearby search for what you do.",
        href: "/services/google-business-profile",
      },
      {
        name: "Domain and business email",
        status: "ask",
        blurb: "Your own web address, and an email address that matches it.",
      },
      {
        name: "Brand basics",
        status: "ask",
        blurb: "A name check, a logo and colours, if you're starting from nothing.",
      },
    ],
    steps: [
      { title: "Tell us about the business", body: "One short form or one call. What you do, who for, and what you already have." },
      { title: "We build it", body: "You get a plan and a price within 72 hours. Say yes and we start." },
      { title: "You review, we launch", body: "You see the real site before it goes live. Changes are part of the job." },
    ],
    proofSlug: "active-rise-health",
    metaTitle: "Start: get your business online",
    metaDescription:
      "Starting a business? Dorza sets up your website, hosting and Google profile properly from day one. Plan and price within 72 hours. No lock-in.",
  },
  {
    slug: "grow",
    name: "Grow",
    marker: "Once you're trading",
    headline: "Get found. Get booked.",
    lede: "Search that brings the right people in, and the systems to handle them once they arrive.",
    intro:
      "Once you're trading, the hard part is being chosen. We work on both halves: getting found, and making it easy to say yes.",
    services: [
      {
        name: "SEO and content",
        status: "live",
        blurb: "Pages and writing that match what your customers search for.",
        href: "/services/local-seo",
      },
      {
        name: "Booking systems and dashboards",
        status: "live",
        blurb: "Custom builds, like online booking and the admin screen that runs it.",
        href: "/work/drivable",
      },
      {
        name: "Social media",
        status: "ask",
        blurb: "Regular posts in your voice, planned and published for you.",
        href: "/services/social-media-management",
      },
      { name: "Paid ads", status: "ask", blurb: "Search and social ads, once the site is ready to convert them." },
      { name: "Online stores", status: "ask", blurb: "Selling products online, with payments and stock handled." },
      { name: "CRM setup", status: "ask", blurb: "One place for your customers, quotes and follow-ups." },
    ],
    steps: [
      { title: "We look at where you are", body: "Your site, your search results and how enquiries reach you today." },
      { title: "We fix the biggest gap first", body: "Sometimes that's being found. Sometimes it's what happens after someone finds you." },
      { title: "We build what's missing", body: "A booking flow, a dashboard, better pages. Quoted before any work starts." },
    ],
    proofSlug: "drivable",
    metaTitle: "Grow: get found and get booked",
    metaDescription:
      "Already trading? Dorza helps Australian small businesses get found in search and builds the booking systems and dashboards to handle the demand.",
  },
  {
    slug: "support",
    name: "Support",
    marker: "Every day after",
    headline: "Someone picks up.",
    lede: "Hosting, updates and changes, looked after by the people who built it.",
    intro:
      "A website isn't finished when it goes live. Prices change, staff change, things break. Support is us staying on after the build.",
    services: [
      { name: "Hosting and updates", status: "live", blurb: "Your site stays online, secure and current." },
      { name: "Changes on request", status: "live", blurb: "A new page, a new price, a new photo. Send it through and it's done." },
      {
        name: "Google Workspace and Microsoft 365 setup",
        status: "ask",
        blurb: "Business email, shared files and calendars set up for your team.",
      },
    ],
    steps: [
      { title: "It starts at go-live", body: "Support begins the day your build launches. There's nothing extra to set up." },
      { title: "You send it, we do it", body: "Email or call with what you need changed." },
      { title: "Stop any time", body: "There's no lock-in. What we built stays yours." },
    ],
    metaTitle: "Support: someone to look after your tech",
    metaDescription:
      "After launch, Dorza keeps your site hosted, updated and changing with your business. The people who built it look after it. No lock-in.",
  },
];

export function getPillar(slug: PillarSlug): Pillar {
  const pillar = PILLARS.find((p) => p.slug === slug);
  if (!pillar) throw new Error(`Unknown pillar: ${slug}`);
  return pillar;
}
