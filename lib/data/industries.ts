export interface IndustryPainPoint {
  title: string;
  description: string;
}

export interface IndustrySolution {
  title: string;
  description: string;
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
  relevantServiceSlugs: string[];
}

export const INDUSTRIES: IndustryPage[] = [
  {
    slug: "cafes-restaurants",
    name: "Cafes & Restaurants",
    metaTitle: "Cafe and restaurant websites: menus and bookings",
    metaDescription:
      "Websites for cafes and restaurants. A menu that works on a phone, online bookings and a Google profile that's set up properly. Social media on request.",
    eyebrow: "// Cafes & restaurants",
    title: "Websites for cafes and restaurants.",
    description:
      "People choose where to eat on their phone. If your menu won't load or your hours are wrong, they pick somewhere else. We build sites that show the menu, take the booking and keep your details right on Google.",
    painPoints: [
      {
        title: "Your menu is hard to read on a phone.",
        description:
          "Someone looks up your cafe and finds a PDF that won't open properly on their phone. Most won't pinch and zoom. They move on to the next place.",
      },
      {
        title: "Your socials have gone quiet.",
        description:
          "Posting takes time you don't have during service, so the feed slows down. When someone checks it before they visit, a quiet page can look like a closed one.",
      },
      {
        title: "Booking means a phone call.",
        description:
          "If the only way to book is to ring during service, plenty of people won't. They book wherever lets them do it online.",
      },
      {
        title: "Delivery apps sit between you and your customers.",
        description:
          "Commission comes off every order that goes through a delivery app, and your own website may be sending people there. A direct way to book or order keeps more of it with you.",
      },
    ],
    solutions: [
      {
        title: "A menu that works on any phone.",
        description:
          "A clear menu, sorted by category, that loads fast and reads well on a small screen. Nothing to download and no zooming in.",
      },
      {
        title: "Social media, if you want it.",
        description:
          "We can plan and post to Instagram and Facebook for you. It's available on request, so ask us and we'll quote it.",
      },
      {
        title: "Online booking on your own site.",
        description:
          "We link the booking system you already use into your website, so people can book a table without calling.",
      },
      {
        title: "A Google profile that's set up properly.",
        description:
          "When someone nearby searches for a cafe, your profile is often the first thing they see. We set it up with the right hours, photos and links so it's accurate when they find you.",
      },
    ],
    features: [
      "Mobile-first website with a clear menu",
      "Instagram and Facebook posts, on request",
      "Google Business Profile setup",
      "Online booking through the system you already use",
      "A simple way to ask for reviews",
      "Tips on food photos and what to post",
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
    metaTitle: "Websites for tradies: get more jobs online",
    metaDescription:
      "Websites and Google profiles for tradies: service area pages, click-to-call buttons, before and after galleries and quote forms that bring in work.",
    eyebrow: "// Tradies",
    title: "Websites that help tradies get more jobs.",
    description:
      "You're good at the work. The hard part is being found when someone searches for your trade in your area. We build websites and Google profiles that help you show up in those searches and make it easy to call you.",
    painPoints: [
      {
        title: "Word of mouth comes and goes.",
        description:
          "Referrals are great until they slow down. Then you're flat out one month and quiet the next. You need a steady way for new customers to find you.",
      },
      {
        title: "You don't show up on Google.",
        description:
          "When someone searches 'electrician near me' or your trade plus their area, other businesses appear and you don't. Those are people ready to hire.",
      },
      {
        title: "You're paying for shared leads.",
        description:
          "Lead sites charge per lead and often send the same job to several other tradies. You pay whether you win the work or not.",
      },
      {
        title: "Your Facebook page is your website.",
        description:
          "A Facebook page is a start, but it won't show up on Google the way a website does. People also struggle to find your number or the areas you cover.",
      },
    ],
    solutions: [
      {
        title: "A trade website built to be found.",
        description:
          "A proper site built around the searches people actually make: your trade plus your area. Service area pages, click-to-call buttons and a design as tidy as your work.",
      },
      {
        title: "A Google Business Profile done properly.",
        description:
          "We set up and tidy your Google Business Profile so you can show up on Maps when people nearby search. Photos of your work, the right service areas and a simple way to ask for reviews.",
      },
      {
        title: "A before and after gallery.",
        description:
          "Nothing makes the case like the work itself. A before and after gallery shows people what you can do and gives them a reason to call.",
      },
      {
        title: "Easy to call, easy to quote.",
        description:
          "Big call buttons on mobile and a short quote form on every page. Nobody has to hunt for your number.",
      },
    ],
    features: [
      "Website with service area pages",
      "Google Business Profile setup",
      "Before and after project gallery",
      "Click-to-call buttons and mobile-friendly quote forms",
      "A simple way to ask for reviews",
      "Local SEO for your trade and your area",
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
    metaTitle: "Salon and beauty websites: bookings and portfolio",
    metaDescription:
      "Salon and beauty websites with a portfolio of your work, booking through the system you already use and a Google profile set up properly.",
    eyebrow: "// Salons & beauty",
    title: "Websites for salons and beauty businesses.",
    description:
      "Your work is your best advert, as long as people can see it. We build salon websites around your portfolio, connect your booking system and set up your Google profile, so new clients can find you and book.",
    painPoints: [
      {
        title: "Instagram is your only website.",
        description:
          "Everything runs through DMs. New clients only find you if the algorithm shows them a post, and you don't show up when someone searches on Google.",
      },
      {
        title: "Booking is all over the place.",
        description:
          "DMs, calls, texts and voicemails, all for the same appointments. It's easy to double-book, and clients who want to book after hours have to wait until you're open.",
      },
      {
        title: "Your photos don't match your work.",
        description:
          "Bad lighting and quick phone shots make great work look average. What people see online should match what you do in the chair.",
      },
      {
        title: "Happy clients don't leave reviews.",
        description:
          "Plenty mean to and then forget. When someone searches for a salon nearby, the business with more reviews often gets the booking.",
      },
    ],
    solutions: [
      {
        title: "A website built around your portfolio.",
        description:
          "Galleries of your best work, a service menu with prices and team bios. Everything a new client needs to book with confidence.",
      },
      {
        title: "Online booking on your site.",
        description:
          "We connect the booking system you already use to your website. Clients book any time, without a DM or a phone call.",
      },
      {
        title: "Instagram, if you want it.",
        description:
          "We can plan and post your Instagram for you, from before and after shots to new work. It's available on request, so ask us and we'll quote it.",
      },
      {
        title: "A simple way to ask for reviews.",
        description:
          "A direct link to your Google reviews that you can send after an appointment. It makes leaving a review quick for happy clients, and gives new ones a reason to trust you.",
      },
    ],
    features: [
      "Portfolio website with image gallery",
      "Booking system connected to your site",
      "Instagram and Facebook posts, on request",
      "Google Business Profile with photos and reviews",
      "Service menu with prices",
      "Team bios and salon photos",
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
