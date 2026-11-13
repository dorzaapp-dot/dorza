import type { PillarSlug } from "@/lib/data/pillars";
import { SHOW_DRAFTS, WORK_PUBLISHED } from "@/lib/data/workStatus";

export { SHOW_DRAFTS };

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  location: string;
  pillar: PillarSlug;
  /** Public only after the owner's written OK. Set it in lib/data/workStatus.ts. */
  published: boolean;
  liveUrl: string;
  headline: string;
  /** One place-free line for cards on brand pages. */
  teaser: string;
  /** Opening paragraph on the case study page. May name places: they are facts about the client. */
  summary: string;
  /** Slugs of the /services pages this build demonstrates. Each links here, and this page links to each. */
  services: string[];
  /** Date the case study went public, YYYY-MM-DD. Used as the article's datePublished. */
  publishedOn: string;
  /** Slugs of /areas pages where the client trades. Those pages link here as local proof. */
  areas?: string[];
  facts: { label: string; value: string }[];
  problem: string[];
  built: { title: string; body: string }[];
  /** Optional. Rendered only when supplied. Must have a row in docs/proof-sources.md. */
  result?: string;
  quote?: { text: string; name: string; role: string };
  closing: string;
  shots: { desktop: string; mobile: string; alt: string };
  metaDescription: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "active-rise-health",
    client: "Active Rise Health",
    industry: "Physiotherapy",
    location: "Mays Hill and Westmead, NSW",
    pillar: "start",
    published: WORK_PUBLISHED["active-rise-health"],
    liveUrl: "https://www.activerisehealth.com.au/",
    services: ["web-design"],
    areas: ["parramatta", "western-sydney"],
    publishedOn: "2026-11-13",
    headline: "One physio. Two clinics. One front door.",
    teaser: "A website for a physio working across two clinics and home visits, with a pathway for referrers.",
    summary:
      "Active Rise Health is Yoon Yoo's physiotherapy practice in Western Sydney. Yoon works from two medical centres and visits people on the NDIS and in aged care at home. We built the website that ties it together.",
    facts: [
      { label: "Client", value: "Active Rise Health" },
      { label: "Industry", value: "Physiotherapy" },
      { label: "Where", value: "Mays Hill and Westmead, NSW" },
      { label: "What we built", value: "Practice website with a referral pathway" },
      { label: "Live site", value: "activerisehealth.com.au" },
    ],
    problem: [
      "A physio who works inside other people's medical centres has no front door of their own. Patients find the medical centre, not the practitioner. A support coordinator or GP who wants to refer someone has nowhere to send the details.",
      "The practice also runs three ways at once: two clinics on different days, and home visits across Western Sydney. One page couldn't explain that.",
    ],
    built: [
      {
        title: "A page for each service.",
        body: "Physiotherapy, home visits and dry needling each say what they treat, what a session involves and how it's paid for.",
      },
      {
        title: "Two clinics, clearly.",
        body: "Mays Hill and Westmead each have a page with the address, the days and hours, a map and the clinic's phone number.",
      },
      {
        title: "A door for referrers.",
        body: "Support coordinators, aged care providers and GPs have their own page and their own form. Yoon acknowledges each referral the same business day and contacts the patient directly.",
      },
      {
        title: "Funding in plain words.",
        body: "Medicare care plans, NDIS, aged care packages, WorkCover, CTP, DVA and private health each get a line. A patient knows what applies before they call.",
      },
      {
        title: "One way to get in touch.",
        body: "Every booking button leads to the same short form: name, contact details, preferred location and a message. Yoon replies the same business day.",
      },
      {
        title: "The paperwork a health site needs.",
        body: "A privacy policy written for health information and a medical disclaimer, both linked in the footer.",
      },
    ],
    closing: "We'll set your practice up properly.",
    shots: {
      desktop: "/images/work/active-rise-health/desktop.jpg",
      mobile: "/images/work/active-rise-health/mobile.jpg",
      alt: "The Active Rise Health homepage, with the headline Move again, with confidence.",
    },
    metaDescription:
      "How Dorza set up Active Rise Health online: one website for a physio working across two clinics and home visits, with a pathway for referrers.",
  },
  {
    slug: "drivable",
    client: "Drivable",
    industry: "Specialised vehicle hire",
    location: "Sydney, NSW",
    pillar: "grow",
    published: WORK_PUBLISHED.drivable,
    liveUrl: "https://drivablehire.com.au/",
    services: ["web-design"],
    publishedOn: "2026-11-13",
    headline: "Open for bookings.",
    teaser: "A website and booking system for a specialised vehicle hire business.",
    summary:
      "Drivable hires out wheelchair accessible vans and 4WDs across Sydney. We built the website customers book on and the booking system behind it.",
    facts: [
      { label: "Client", value: "Drivable" },
      { label: "Industry", value: "Specialised vehicle hire" },
      { label: "Where", value: "Sydney, NSW" },
      { label: "What we built", value: "Website, fleet catalogue and booking system" },
      { label: "Live site", value: "drivablehire.com.au" },
    ],
    problem: [
      "Hiring a wheelchair accessible vehicle usually starts with a phone call and a wait for one back. You can't see what's available. You can't tell if your chair will fit.",
      "Drivable wanted customers to see the fleet, check the dates and ask for a vehicle without the owner answering the phone all day.",
    ],
    built: [
      {
        title: "A fleet you can compare.",
        body: "Every vehicle has its own page with photos and a day rate. It also lists the measurements that matter for a wheelchair: ramp length, internal height and how the chair is restrained. Where a number hasn't been measured yet, the page says \"Ask us\". It doesn't guess.",
      },
      {
        title: "Booking in three steps.",
        body: "Choose the vehicle and your dates. Add your suburb. Leave your name and number. Dates already booked are crossed out, so nobody asks for a van that's gone.",
      },
      {
        title: "A person checks every request.",
        body: "A wheelchair has to fit the vehicle safely, so nothing is locked in until Drivable has confirmed the vehicle and the rate with the customer.",
      },
      {
        title: "A system behind the site.",
        body: "The fleet and the bookings live in a booking system built for Drivable. That's how the site knows which dates are taken.",
      },
      {
        title: "Pages people search for.",
        body: "Wheelchair accessible vehicle hire, 4WD hire, NDIS hire and Western Sydney each have their own page, with two hiring guides behind them.",
      },
    ],
    closing: "Your hire business is next.",
    shots: {
      desktop: "/images/work/drivable/desktop.jpg",
      mobile: "/images/work/drivable/mobile.jpg",
      alt: "The Drivable homepage, showing wheelchair accessible vehicles and 4WDs for hire.",
    },
    metaDescription:
      "How Dorza built Drivable's website and booking system: a fleet you can compare, dates you can see, and a booking request in three steps.",
  },
];

export function visibleCaseStudies(showDrafts: boolean = SHOW_DRAFTS): CaseStudy[] {
  return CASE_STUDIES.filter((c) => showDrafts || c.published);
}

export function getCaseStudy(slug: string, showDrafts: boolean = SHOW_DRAFTS): CaseStudy | undefined {
  return visibleCaseStudies(showDrafts).find((c) => c.slug === slug);
}
