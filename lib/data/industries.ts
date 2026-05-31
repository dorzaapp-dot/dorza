export interface IndustryPainPoint {
  title: string;
  description: string;
}

export interface IndustrySolution {
  title: string;
  description: string;
}

export interface IndustryOutcome {
  stat: string;
  label: string;
}

export interface IndustryPage {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  painPoints: IndustryPainPoint[];
  solutions: IndustrySolution[];
  features: string[];
  outcomes: IndustryOutcome[];
  relevantServiceSlugs: string[];
}

export const INDUSTRIES: IndustryPage[] = [
  {
    slug: "cafes-restaurants",
    name: "Cafes & Restaurants",
    metaTitle:
      "Cafe & Restaurant Websites Sydney — Menus, Booking & Social | Dorza",
    metaDescription:
      "Websites and marketing built for cafes and restaurants. Mobile-first menus, online booking integration, social media management, and Google Business setup.",
    eyebrow: "// Cafes & restaurants",
    title: "Websites and marketing built for cafes and restaurants",
    description:
      "Your food is incredible — but if your website is a PDF menu from 2019 and your Instagram hasn't posted since last month, you're losing customers to the place down the road. We fix that.",
    painPoints: [
      {
        title: "Your menu is a PDF from 2019",
        description:
          "Customers Google your cafe, find a blurry PDF that doesn't load on their phone, and go somewhere else. You're losing walk-ins before they even see the door.",
      },
      {
        title: "Instagram is dead or inconsistent",
        description:
          "You post a flat white photo every three weeks and wonder why engagement is flat. Meanwhile your competitor posts daily and has a queue out the door.",
      },
      {
        title: "No online booking",
        description:
          "People want to book a table in 10 seconds. If they have to call during service, most won't bother — they'll book the place that lets them tap a button.",
      },
      {
        title: "Competing with UberEats for your own customers",
        description:
          "You're paying 30% commission on every order to a delivery app while your own website sends people straight to them. You need a direct channel.",
      },
    ],
    solutions: [
      {
        title: "Mobile-first menu that actually works",
        description:
          "A clean, visual menu that loads instantly on any phone. No PDF downloads, no pinch-to-zoom. Organised by category with photos that make people hungry.",
      },
      {
        title: "Consistent social media — 3-5 posts per week",
        description:
          "We handle your Instagram and Facebook so your socials look alive. Real food photography tips, seasonal content, and posts that actually drive foot traffic.",
      },
      {
        title: "Booking integration that fills tables",
        description:
          "We integrate OpenTable, Quandoo, ResDiary, or whichever system you use — directly into your website. One tap, table booked. No phone calls required.",
      },
      {
        title: "Google Business Profile for walk-ins",
        description:
          "When someone searches 'cafe near me', you need to be in the top three results on Maps. We set up and manage your profile so you show up for hungry locals.",
      },
    ],
    features: [
      "Mobile-first website with visual menu",
      "Instagram & Facebook management",
      "Google Business Profile setup and management",
      "Online booking integration (OpenTable, Quandoo, ResDiary)",
      "Review management and response templates",
      "Food photography tips and content guidance",
    ],
    outcomes: [
      {
        stat: "Up to 3-5x",
        label: "More Google profile views in 90 days",
      },
      {
        stat: "Up to 2x",
        label: "Instagram engagement growth",
      },
      {
        stat: "70%",
        label: "Of customers check your menu online before visiting",
      },
    ],
    relevantServiceSlugs: [
      "web-design",
      "social-media-management",
      "google-business-profile",
    ],
  },
  {
    slug: "tradies",
    name: "Tradies",
    metaTitle: "Tradie Websites Sydney — Get More Jobs Online | Dorza",
    metaDescription:
      "Websites and marketing that get tradies more jobs. Professional trade websites, Google Business dominance, before/after portfolios, and lead capture that works.",
    eyebrow: "// Tradies",
    title: "Websites and marketing that get tradies more jobs",
    description:
      "You're great at what you do — but if no one can find you on Google, you're leaving jobs on the table. We build websites and marketing that get tradies found online and turn searches into enquiries.",
    painPoints: [
      {
        title: "Relying on word of mouth alone",
        description:
          "Word of mouth is good — until it dries up. You need a steady stream of new enquiries, not feast-or-famine months where you're either flat out or twiddling your thumbs.",
      },
      {
        title: "No Google presence",
        description:
          "When someone searches 'electrician Parramatta' or 'plumber near me', your competitors show up and you don't. You're invisible to the people actively looking for your trade.",
      },
      {
        title: "Paying $30-60 per lead on HiPages",
        description:
          "You're spending thousands a year on lead aggregators who send the same lead to five other tradies. You pay whether you win the job or not.",
      },
      {
        title: "Facebook page is your 'website'",
        description:
          "A Facebook business page isn't a website. It looks unprofessional, you can't rank on Google with it, and half your potential customers can't even find your phone number.",
      },
    ],
    solutions: [
      {
        title: "Professional trade website that ranks",
        description:
          "A proper website built to rank for '[your trade] + [your suburb]' searches. Service area pages, click-to-call buttons, and a design that says 'professional' — not 'my nephew built this'.",
      },
      {
        title: "Google Business Profile dominance",
        description:
          "We set up and optimise your Google Business Profile so you show up in the Map Pack when locals search. Photos of your work, regular posts, and a review strategy that builds trust.",
      },
      {
        title: "Before/after portfolio that sells",
        description:
          "Show off your best work with a before/after gallery. Nothing sells a tradie better than proof of what you can do — and it builds the trust that gets people to pick up the phone.",
      },
      {
        title: "Lead capture that works — click-to-call and forms",
        description:
          "Big, obvious call buttons on mobile. Simple quote request forms. Every page designed to make it dead easy for customers to contact you, not hunt for your number.",
      },
    ],
    features: [
      "Professional website with service area pages",
      "Google Business Profile setup and management",
      "Before/after project gallery",
      "Click-to-call buttons and mobile-optimised forms",
      "Review collection and management",
      "Local SEO for trade + suburb keyword rankings",
    ],
    outcomes: [
      {
        stat: "Up to 3-4",
        label: "New enquiries per week from Google",
      },
      {
        stat: "$0",
        label: "Per lead vs $30-60 on HiPages",
      },
    ],
    relevantServiceSlugs: [
      "web-design",
      "google-business-profile",
      "local-seo",
    ],
  },
  {
    slug: "salons-beauty",
    name: "Salons & Beauty",
    metaTitle:
      "Salon & Beauty Websites Sydney — Booking & Instagram | Dorza",
    metaDescription:
      "Websites and marketing designed for salons and beauty businesses. Portfolio websites, booking integration, Instagram management, and Google reviews strategy.",
    eyebrow: "// Salons & beauty",
    title: "Websites and marketing designed for salons and beauty businesses",
    description:
      "Your work speaks for itself — but only if people can actually see it. We build salon websites that showcase your portfolio, integrate your booking system, and keep your Instagram looking as polished as your clients.",
    painPoints: [
      {
        title: "Instagram is your only website",
        description:
          "You're running your entire business through Instagram DMs. No proper website, no Google presence, no way for new clients to find you unless the algorithm decides to show your posts.",
      },
      {
        title: "Booking is a nightmare",
        description:
          "DMs, phone calls, texts, voicemails — you're juggling five channels and still double-booking. Your clients want to book at 11pm on a Sunday, not call during business hours.",
      },
      {
        title: "Your work looks amateur online",
        description:
          "You're incredible at what you do, but bad lighting and phone photos make your work look average. Your online presence doesn't match the quality of what you deliver in the chair.",
      },
      {
        title: "No reviews strategy",
        description:
          "Happy clients walk out and never leave a review. Meanwhile a competitor with half your skill has 200 Google reviews and gets all the new clients searching 'salon near me'.",
      },
    ],
    solutions: [
      {
        title: "Portfolio-first website that shows off your work",
        description:
          "A beautiful website built around your best work. High-quality image galleries, service menus with pricing, team bios — everything a new client needs to book with confidence.",
      },
      {
        title: "Online booking integration",
        description:
          "We connect Fresha, Timely, Square Appointments, or your preferred system directly to your website. Clients book 24/7 without a single DM or phone call.",
      },
      {
        title: "Instagram that sells — 3-5 posts per week",
        description:
          "Consistent, on-brand content that shows your work at its best. Before/after transformations, styling tips, and content that turns followers into paying clients.",
      },
      {
        title: "Review engine — automated requests",
        description:
          "A simple system that automatically asks happy clients for Google reviews after their appointment. More reviews means more trust and higher Google rankings.",
      },
    ],
    features: [
      "Portfolio website with image gallery",
      "Booking system integration (Fresha, Timely, Square)",
      "Instagram & Facebook management",
      "Google Business Profile with photos and reviews",
      "Service menu with pricing",
      "Team bios and salon showcase",
    ],
    outcomes: [
      {
        stat: "Up to 2x",
        label: "More bookings from new clients",
      },
      {
        stat: "40%",
        label: "Fewer phone calls with online booking",
      },
      {
        stat: "Up to 5x",
        label: "More Google reviews in 90 days",
      },
    ],
    relevantServiceSlugs: [
      "web-design",
      "social-media-management",
      "google-business-profile",
    ],
  },
];

export function getIndustryBySlug(slug: string): IndustryPage | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
