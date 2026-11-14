import type { ServiceOption } from "@/lib/constants";
import { PILLARS, type PillarService, type ServiceStatus } from "@/lib/data/pillars";

/**
 * The homepage's "I need…" picker. Each need is something an owner would say out loud,
 * mapped to the pillar services that answer it. Status is never set here: it comes from
 * lib/data/pillars.ts, so flipping a service to live there flips the picker too.
 */
export interface Need {
  slug: string;
  /** Finishes the sentence "I need …". */
  phrase: string;
  headline: string;
  body: string;
  /** What we'd set up, as PlusList rows. */
  includes: string[];
  /** The layer's name in the homepage drawing. */
  short: string;
  /** Callouts on the lifted layer: the includes, cut down to a few words each. */
  parts: string[];
  /** Pillar service names, exactly as in lib/data/pillars.ts. */
  services: string[];
  link?: { href: string; label: string };
  /** Only where Dorza has promised a price (spec §4 rule 6). */
  price?: string;
  /** Which enquiry form option this lands under. */
  enquiryOption: ServiceOption;
}

export const NEEDS: Need[] = [
  {
    slug: "website",
    phrase: "a website",
    headline: "A website, built for your business.",
    body: "Built by hand around what you do, then hosted and kept current. You see the real site before it goes live.",
    includes: ["Design and build, with your changes included", "Hosting, security and updates", "Your domain and your site, owned by you"],
    short: "Website",
    parts: ["Design and build", "Your changes included", "Hosting and updates", "Owned by you"],
    services: ["Website and hosting"],
    link: { href: "/services/web-design", label: "More on web design" },
    price: "From $499",
    enquiryOption: "Getting started",
  },
  {
    slug: "google",
    phrase: "to show up on Google",
    headline: "Found on Google and Maps.",
    body: "Your Google Business Profile set up properly, and pages written for what people near you actually search.",
    includes: ["Google Business Profile, filled in properly", "Pages written around real searches", "Your details the same everywhere they appear"],
    short: "Google",
    parts: ["Business Profile", "Maps listing", "Pages for real searches", "Same details everywhere"],
    services: ["Google Business Profile", "SEO and content"],
    link: { href: "/services/local-seo", label: "More on local SEO" },
    enquiryOption: "Getting more customers",
  },
  {
    slug: "bookings",
    phrase: "online bookings",
    headline: "Bookings without the phone tag.",
    body: "Customers book a free slot online, any hour. We set up a booking app if one fits, and build one if none does.",
    includes: ["Real availability, so nobody books a taken slot", "Confirmations to you and your customer", "A screen to manage it all"],
    short: "Bookings",
    parts: ["Real availability", "Confirmations both ways", "A screen to manage it"],
    services: ["Booking systems and dashboards"],
    link: { href: "/services/booking-systems", label: "More on booking systems" },
    enquiryOption: "A booking system or dashboard",
  },
  {
    slug: "store",
    phrase: "to sell online",
    headline: "An online store, set up properly.",
    body: "Products, payments, GST and shipping, on a platform you own, usually Shopify. Tell us what you sell first.",
    includes: ["Products, photos and stock", "Payments and GST", "Shipping and delivery options"],
    short: "Store",
    parts: ["Products and stock", "Payments and GST", "Shipping"],
    services: ["Online stores"],
    link: { href: "/services/online-store", label: "More on online stores" },
    enquiryOption: "Getting more customers",
  },
  {
    slug: "crm",
    phrase: "my customers in one place",
    headline: "Every customer and quote in one place.",
    body: "We help you pick a CRM or job app that suits your trade, then set it up so no quote goes cold.",
    includes: ["A tool chosen for how your trade works", "Your existing contacts brought across", "Reminders for the quotes you're waiting on"],
    short: "CRM",
    parts: ["Chosen for your trade", "Contacts brought across", "Quote reminders"],
    services: ["CRM setup"],
    link: { href: "/services/crm-setup", label: "More on CRM setup" },
    enquiryOption: "Getting more customers",
  },
  {
    slug: "ads",
    phrase: "ads that pay their way",
    headline: "Ads, once your site can convert them.",
    body: "Google search ads, set up and watched. We check your site first, so you don't pay for clicks that go nowhere.",
    includes: ["Search ads on Google", "Landing pages that match each ad", "A budget agreed before anything runs"],
    short: "Ads",
    parts: ["Google search ads", "Matching landing pages", "Budget agreed first"],
    services: ["Paid ads"],
    link: { href: "/services/google-ads", label: "More on Google Ads" },
    enquiryOption: "Getting more customers",
  },
  {
    slug: "email",
    phrase: "email that matches my domain",
    headline: "Your own domain, and email to match.",
    body: "A domain in your name, and email on Google Workspace or Microsoft 365 for everyone on your team.",
    includes: ["Your domain, in your name", "Email, calendars and shared files", "Set up on your team's phones and laptops"],
    short: "Email",
    parts: ["Domain in your name", "Email and calendars", "On every device"],
    services: ["Domain and business email", "Google Workspace and Microsoft 365 setup"],
    link: { href: "/services/business-email", label: "More on business email" },
    enquiryOption: "Getting started",
  },
  {
    slug: "support",
    phrase: "someone to look after it",
    headline: "Someone picks up.",
    body: "Hosting, updates and changes, handled by the people who built it. Send it through and it's done.",
    includes: ["Hosting and security updates", "Changes on request", "No lock-in. Stop any time."],
    short: "Support",
    parts: ["Hosting", "Security updates", "Changes on request", "No lock-in"],
    services: ["Hosting and updates", "Changes on request"],
    link: { href: "/support", label: "How support works" },
    enquiryOption: "Ongoing support",
  },
  {
    slug: "unsure",
    phrase: "help working out what I need",
    headline: "Not sure yet? Start there.",
    body: "Tell us what keeps getting in the way. You'll get a plan and a price within 72 hours.",
    includes: [],
    short: "Your plan",
    parts: [],
    services: [],
    enquiryOption: "Not sure yet",
  },
];

/**
 * The homepage drawing stacks these needs bottom to top: the domain and email underneath,
 * the ads that bring people in on top. Support is drawn as rails around the whole stack,
 * and "not sure" as an empty layer, so neither sits in it.
 */
export const STACK = ["email", "website", "bookings", "store", "crm", "google", "ads"] as const;

const ALL_SERVICES: PillarService[] = PILLARS.flatMap((p) => p.services);

export function needServices(need: Need): PillarService[] {
  return need.services.map((name) => {
    const service = ALL_SERVICES.find((s) => s.name === name);
    if (!service) throw new Error(`Need "${need.slug}" names an unknown service: ${name}`);
    return service;
  });
}

/** Live only when every service behind the need is live. Undefined when no service is named. */
export function needStatus(need: Need): ServiceStatus | undefined {
  const services = needServices(need);
  if (services.length === 0) return undefined;
  return services.every((s) => s.status === "live") ? "live" : "ask";
}
