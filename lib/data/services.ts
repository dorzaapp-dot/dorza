export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServicePage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  problemHeadline: string;
  problemDescription: string;
  problemPoints: string[];
  solutionHeadline: string;
  solutionDescription: string;
  features: ServiceFeature[];
  steps: ServiceStep[];
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
}

export const SERVICES: ServicePage[] = [
  {
    slug: "web-design",
    metaTitle: "Web Design for Small Businesses in Western Sydney | Dorza",
    metaDescription:
      "Custom, hand-coded websites built to get Western Sydney businesses found online. Mobile-first, SEO-ready, live in 24 hours. No templates, no lock-in.",
    eyebrow: "// Web design",
    title: "Custom websites that actually get you customers",
    description:
      "Not a Wix template with your logo slapped on. A proper website, hand-built for your business, designed to show up on Google and turn visitors into paying customers across Western Sydney.",
    problemHeadline: "Your website is costing you customers",
    problemDescription:
      "Most small businesses in Western Sydney either have no website, or one that looks like it was built in 2014. Either way, you're invisible to the people searching for what you do right now.",
    problemPoints: [
      "You're not showing up when locals Google your trade or service",
      "Your site looks terrible on mobile — where most of your traffic comes from",
      "You paid an agency thousands for a template that loads slowly and ranks nowhere",
      "You can't update anything yourself without paying someone every time",
    ],
    solutionHeadline: "A website that works as hard as you do",
    solutionDescription:
      "We hand-code every site from scratch. No page builders, no bloated templates. Just a fast, clean website that's built to rank on Google and convert visitors into enquiries.",
    features: [
      {
        title: "Hand-coded, not templated",
        description:
          "Every line of code is written for your business. No drag-and-drop builders, no shared templates. Faster load times, better SEO, fully yours.",
      },
      {
        title: "Mobile-first design",
        description:
          "Built for phones first, because that's where your customers are. Every tap target, every image, every layout — tested on real devices.",
      },
      {
        title: "SEO-ready from day one",
        description:
          "Proper page titles, meta descriptions, schema markup, and site speed optimisation baked in. You start ranking faster because the foundations are right.",
      },
      {
        title: "Google Business Profile setup",
        description:
          "We don't just build the site — we connect it to your Google Business Profile so you show up on Maps and local search results across Western Sydney.",
      },
      {
        title: "Live in 24 hours",
        description:
          "Send us your details and we'll have a working site ready within a day. No six-week timelines, no endless revision rounds.",
      },
      {
        title: "You own everything",
        description:
          "Your code, your domain, your content. If you leave, you take it all with you. No lock-in contracts, no hostage situations.",
      },
    ],
    steps: [
      {
        title: "Tell us about your business",
        description:
          "Fill out a quick brief — what you do, who your customers are, what suburb you're in. Takes about five minutes.",
      },
      {
        title: "We build your site",
        description:
          "Our team hand-codes your website, sets up hosting, and connects your Google Business Profile. Usually done within 24 hours.",
      },
      {
        title: "Go live and start getting found",
        description:
          "Your site goes live with SEO baked in. We handle ongoing updates and improvements so you can focus on running your business.",
      },
    ],
    faqs: [
      {
        q: "How long does it take to get my website live?",
        a: "Most sites go live within 24 hours of receiving your brief and content. If you need custom photography or copywriting, it might take a couple of extra days — but we'll always give you a clear timeline upfront.",
      },
      {
        q: "What if I don't have content or photos ready?",
        a: "No worries. We can write your copy based on the brief you fill out, and we'll use professional stock images until you're ready with your own. Most of our Western Sydney clients start with what they have and upgrade later.",
      },
      {
        q: "Can I update the website myself?",
        a: "You can, but you don't have to. Minor updates like changing a phone number or adding a photo are included in your plan. If you want full control, we'll set you up with a simple editing workflow.",
      },
      {
        q: "What happens if I want to cancel?",
        a: "You cancel. That's it. No exit fees, no lock-in contracts. You keep your domain, your content, and your code. We'll even help you migrate if you want to go elsewhere.",
      },
    ],
    relatedSlugs: ["local-seo", "google-business-profile", "social-media-management"],
  },
  {
    slug: "social-media-management",
    metaTitle: "Social Media Management for Western Sydney Businesses | Dorza",
    metaDescription:
      "Consistent, on-brand social media posts for your business. 3-5 posts per week, a done-for-you content calendar, performance tracking. Built for Western Sydney locals.",
    eyebrow: "// Social media",
    title: "Social media that runs itself — and actually sounds like you",
    description:
      "No more staring at a blank Instagram screen at 10pm. We handle your content calendar, create posts that match your brand voice, and keep your socials active so your customers know you're still open for business.",
    problemHeadline: "Your Instagram hasn't posted since March",
    problemDescription:
      "You know you should be posting. Your customers check your socials before they call. But between running the business and actually doing the work, social media falls to the bottom of the list. Every time.",
    problemPoints: [
      "You post once a month when you remember — then nothing for weeks",
      "You've run out of content ideas and you're sick of posting the same thing",
      "Your Instagram looks dead and potential customers assume you've closed down",
      "You tried scheduling tools but you still had to come up with all the content yourself",
    ],
    solutionHeadline: "Consistent posts without the headache",
    solutionDescription:
      "We create and schedule 3 to 5 posts per week that actually sound like you, not some generic marketing agency. Real content ideas tailored to your business, your suburb, and your customers across Western Sydney.",
    features: [
      {
        title: "3-5 posts per week",
        description:
          "Consistent posting across your platforms. Enough to stay visible without spamming your followers. We handle the scheduling so nothing falls through the cracks.",
      },
      {
        title: "Done-for-you content calendar",
        description:
          "We use smart tools to plan your content weeks ahead — local events, seasonal trends, industry moments. You always know what's coming.",
      },
      {
        title: "On-brand, every time",
        description:
          "We learn your voice and stick to it. If you're a no-nonsense plumber in Penrith, your posts won't sound like a Surry Hills branding agency wrote them.",
      },
      {
        title: "Performance tracking",
        description:
          "Monthly reports showing what's working, what's not, and what we're changing. No vanity metrics — just the numbers that matter for your business.",
      },
      {
        title: "Multi-platform management",
        description:
          "Instagram, Facebook, Google Business posts — all managed from one place. We format and optimise content for each platform so it performs properly everywhere.",
      },
      {
        title: "Local content focus",
        description:
          "Posts that reference your suburb, your local community, and the things your Western Sydney customers actually care about. Not generic stock photo content.",
      },
    ],
    steps: [
      {
        title: "Tell us about your brand",
        description:
          "We learn your business, your voice, and your audience. Share examples of posts you like and we'll nail the tone from week one.",
      },
      {
        title: "We plan and create your content",
        description:
          "You get a content calendar for the month. Approve it, request changes, or just let us run with it. Your call.",
      },
      {
        title: "We post, you focus on your business",
        description:
          "Content goes live on schedule. We monitor performance and adjust the strategy each month to keep improving your results.",
      },
    ],
    faqs: [
      {
        q: "Do I need to provide my own photos?",
        a: "It helps, but it's not essential. We can work with what you've got — even phone photos from the job site or shop floor. We'll also create branded graphics and source stock imagery when needed.",
      },
      {
        q: "Do I get to approve posts before they go live?",
        a: "Absolutely. You'll get the content calendar ahead of time and can approve, tweak, or reject anything. Some clients prefer to approve everything; others tell us to just run with it after the first month.",
      },
      {
        q: "Which platforms do you manage?",
        a: "Instagram and Facebook as standard. We can also manage your Google Business Profile posts, LinkedIn, and TikTok depending on your plan. We'll recommend the right mix based on where your customers actually hang out.",
      },
      {
        q: "How is this different from a scheduling tool like Later or Buffer?",
        a: "Those tools help you schedule — but you still have to come up with the content, write the captions, design the graphics, and figure out what to post. We do all of that for you. You just approve and we handle the rest.",
      },
    ],
    relatedSlugs: ["web-design", "google-business-profile", "local-seo"],
  },
  {
    slug: "google-business-profile",
    metaTitle: "Google Business Profile Setup & Management | Western Sydney | Dorza",
    metaDescription:
      "Get your business on Google Maps and local search. Full GBP setup, optimisation, photo management, and review strategy for Western Sydney businesses.",
    eyebrow: "// Google Business Profile",
    title: "Show up when locals search for what you do",
    description:
      "When someone in Parramatta Googles 'plumber near me', you either show up in the top three — or you don't exist. We set up, optimise, and manage your Google Business Profile so you're the one they call.",
    problemHeadline: "You're invisible on Google Maps",
    problemDescription:
      "Your competitors are getting the calls because they show up first. Not because they're better — because their Google Business Profile is set up properly and yours isn't. Or worse, you don't have one at all.",
    problemPoints: [
      "You don't have a Google Business Profile, or it's half-filled and collecting dust",
      "You're not showing up on Google Maps when locals search for your service",
      "Your competitors rank above you because their profiles are fully optimised",
      "You've got no reviews, no photos, and no posts — so Google doesn't trust you",
    ],
    solutionHeadline: "Your business, front and centre on Google",
    solutionDescription:
      "We handle everything — from creating your profile to keeping it active with fresh photos, weekly posts, and a review strategy that builds trust. All so you rank higher in local search results across Western Sydney.",
    features: [
      {
        title: "Full profile creation",
        description:
          "We set up your Google Business Profile from scratch with accurate categories, service areas, business hours, and a compelling description that tells Google exactly what you do.",
      },
      {
        title: "Complete optimisation",
        description:
          "Every field filled, every category selected, every attribute checked. We make sure Google has zero reason to rank your competitors above you.",
      },
      {
        title: "Photo management",
        description:
          "Regular photo uploads of your work, your team, and your premises. Profiles with photos get 42% more direction requests — we keep yours fresh.",
      },
      {
        title: "Review management",
        description:
          "A simple system to get more reviews from happy customers, plus templates for responding to every review professionally. More reviews means higher rankings.",
      },
      {
        title: "Weekly GBP posts",
        description:
          "Google Business posts keep your profile active and give Google a reason to rank you. We write and publish them weekly so your profile never goes stale.",
      },
      {
        title: "Insights and reporting",
        description:
          "Monthly reports showing how many people found you, called you, and got directions to your business. Real numbers, not vanity metrics.",
      },
    ],
    steps: [
      {
        title: "We audit or create your profile",
        description:
          "Already have a GBP? We'll audit it and fix everything. Don't have one? We'll create and verify it for you — usually takes a few days.",
      },
      {
        title: "Full optimisation",
        description:
          "We fill every field, upload photos, write your business description, set your service areas across Western Sydney, and publish your first posts.",
      },
      {
        title: "Ongoing management",
        description:
          "Weekly posts, regular photo updates, review monitoring, and monthly performance reports. Your profile stays active and keeps climbing the rankings.",
      },
    ],
    faqs: [
      {
        q: "Is Google Business Profile free?",
        a: "The profile itself is completely free from Google. What you're paying for is the expertise to set it up properly, optimise it so you actually rank, and manage it on an ongoing basis so it keeps working for you.",
      },
      {
        q: "How long before I start showing up on Maps?",
        a: "Most businesses start appearing within 1-2 weeks of verification. Ranking in the top 3 of the Map Pack depends on competition in your area, but we typically see strong improvements within the first month for Western Sydney suburbs.",
      },
      {
        q: "I already have a Google Business Profile. Can you improve it?",
        a: "That's actually most of our clients. We'll audit your existing profile, fix any issues, fill the gaps, and implement an ongoing management strategy. Most see a noticeable jump in visibility within the first few weeks.",
      },
      {
        q: "Do I need a physical shop or office address?",
        a: "No. If you're a service-area business — like a tradie, cleaner, or mobile mechanic — you can hide your address and just list the suburbs you serve. We'll set this up correctly so you still show up in local results.",
      },
    ],
    relatedSlugs: ["local-seo", "web-design", "social-media-management"],
  },
  {
    slug: "local-seo",
    metaTitle: "Local SEO Services for Western Sydney Small Businesses | Dorza",
    metaDescription:
      "Get found on Google by Western Sydney locals. On-page SEO, Google Business Profile, local citations, review strategy, and suburb-targeted content.",
    eyebrow: "// Local SEO",
    title: "Get found on Google by the people who matter most — locals",
    description:
      "You don't need to rank globally. You need to rank in Parramatta, Blacktown, Penrith, and the suburbs where your customers actually live. We make that happen with local SEO built specifically for Western Sydney businesses.",
    problemHeadline: "Your competitors are getting all the Google traffic",
    problemDescription:
      "When someone searches 'electrician Blacktown' or 'cafe near Parramatta', your competitors show up and you don't. It's not because they're better at what they do — it's because they've invested in local SEO and you haven't.",
    problemPoints: [
      "You're not ranking for '[your service] + [your suburb]' searches",
      "Your competitors appear above you in Google and on Maps — every single time",
      "You've got no strategy for getting reviews, building citations, or targeting local keywords",
      "You're relying on word of mouth and hoping for the best while leads go elsewhere",
    ],
    solutionHeadline: "Rank where it matters — your backyard",
    solutionDescription:
      "We build a local SEO strategy tailored to your business and your suburbs. On-page optimisation, Google Business Profile, local citations, review management, and suburb-targeted content — everything you need to outrank the competition in Western Sydney.",
    features: [
      {
        title: "On-page SEO optimisation",
        description:
          "We optimise your website's titles, descriptions, headings, and content to target the local searches your customers are actually making. Proper technical foundations, not keyword stuffing.",
      },
      {
        title: "Google Business Profile",
        description:
          "Full setup and ongoing management of your GBP — the single most important factor for showing up in the Map Pack when locals search for what you do.",
      },
      {
        title: "Local citation building",
        description:
          "We list your business on the directories that actually matter — Yellow Pages, True Local, Yelp, and industry-specific sites. Consistent name, address, and phone number everywhere.",
      },
      {
        title: "Review strategy",
        description:
          "A system to get more five-star reviews from your happy customers. We give you the tools and templates — you just have to ask. More reviews means more trust and higher rankings.",
      },
      {
        title: "Suburb-targeted content",
        description:
          "Landing pages and content that target the specific suburbs you serve across Western Sydney. 'Plumber Penrith' and 'plumber Castle Hill' are different searches — we cover them all.",
      },
      {
        title: "Monthly reporting",
        description:
          "Clear, jargon-free monthly reports showing your rankings, traffic, and enquiries. You'll know exactly what's working and what we're doing about the rest.",
      },
    ],
    steps: [
      {
        title: "SEO audit and keyword research",
        description:
          "We audit your current online presence and identify the exact local searches you should be ranking for. No guesswork — just data.",
      },
      {
        title: "Optimise and build",
        description:
          "We fix your website's SEO foundations, set up or optimise your Google Business Profile, build citations, and create suburb-targeted content.",
      },
      {
        title: "Track, report, improve",
        description:
          "Monthly performance reviews, ranking tracking, and ongoing improvements. Local SEO is a long game — we keep pushing until you're at the top and then we keep you there.",
      },
    ],
    faqs: [
      {
        q: "How long does local SEO take to show results?",
        a: "You'll start seeing movement within 4-6 weeks, with meaningful ranking improvements by month 3. Local SEO in Western Sydney is less competitive than inner-city, so results tend to come faster — but it depends on your industry and how much ground you need to cover.",
      },
      {
        q: "What's the difference between local SEO and regular SEO?",
        a: "Regular SEO tries to rank you nationally or globally. Local SEO focuses specifically on geographic searches — the 'near me' and suburb-specific queries that your actual customers are typing. For most small businesses in Western Sydney, local SEO is the only SEO that matters.",
      },
      {
        q: "Do I need a website before starting local SEO?",
        a: "It helps a lot, but we can start with just your Google Business Profile and local citations. That said, a proper website gives Google a lot more to work with. We can build one for you as part of a combined package — most clients do both.",
      },
      {
        q: "Can you guarantee first-page rankings?",
        a: "No one can guarantee specific rankings — and anyone who does is either lying or using tactics that'll get you penalised. What we can guarantee is that we'll implement best-practice local SEO, track your progress monthly, and keep improving until you're ranking where you should be.",
      },
    ],
    relatedSlugs: ["google-business-profile", "web-design", "social-media-management"],
  },
];

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[]): ServicePage[] {
  return slugs
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is ServicePage => s !== undefined);
}
