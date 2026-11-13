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
    metaTitle: "Web design for small businesses",
    metaDescription:
      "Websites built by hand for your business, set up to be found on Google and easy to use on a phone. From $499, with a plan and a price within 72 hours. No lock-in.",
    eyebrow: "// Web design",
    title: "Websites that bring in work.",
    description:
      "A proper website, built by hand for your business. It shows up on Google, works on a phone and makes it easy for people to get in touch.",
    problemHeadline: "Your website is costing you calls.",
    problemDescription:
      "Plenty of small businesses have no website, or one that hasn't been touched in years. Either way, the people searching for what you do right now can't find you.",
    problemPoints: [
      "You don't show up when people nearby search for your trade or service",
      "Your site is hard to use on a phone, and that's where people look you up",
      "Your site loads slowly and doesn't show up in search",
      "You can't change anything without paying someone every time",
    ],
    solutionHeadline: "A website that does its job.",
    solutionDescription:
      "We build every site from scratch. It's fast, it's clean, and it's set up to be found on Google and to turn visitors into enquiries.",
    features: [
      {
        title: "Built by hand",
        description:
          "We write the code for your business, not a shared template. It loads fast, search engines can read it, and it's yours.",
      },
      {
        title: "Built for phones first",
        description:
          "People look you up on their phone, so that's where we start. We check every page on real phones before launch.",
      },
      {
        title: "Ready for search from day one",
        description:
          "Page titles, descriptions, schema markup and page speed, set up properly before launch. Google gets a clear picture of what you do and where.",
      },
      {
        title: "Google Business Profile setup",
        description:
          "We connect the site to your Google Business Profile, so you show up on Maps and in local search too.",
      },
      {
        title: "A plan and a price in 72 hours",
        description:
          "Tell us what you need and you'll have an exact plan and price within 72 hours. Work starts after you approve the plan.",
      },
      {
        title: "You own everything",
        description:
          "Your code, your domain, your content. If you leave, it all goes with you. No lock-in.",
      },
    ],
    steps: [
      {
        title: "Tell us about your business",
        description:
          "One short form. What you do, who your customers are and where you work.",
      },
      {
        title: "We build your site",
        description:
          "Once you approve the plan, we build the site, set up hosting and connect your Google Business Profile.",
      },
      {
        title: "Go live and get found",
        description:
          "You see the real site before it goes live. After launch we look after updates and changes, so you can run the business.",
      },
    ],
    faqs: [
      {
        q: "How long does it take to get my website live?",
        a: "It depends on the site. You'll have a plan and a price within 72 hours, and the timeline is in the plan. Work starts after you approve it.",
      },
      {
        q: "What if I don't have content or photos ready?",
        a: "No worries. We can write the words from your brief, and we'll work with whatever photos you have for now. Start with what you have and swap things in later.",
      },
      {
        q: "Can I update the website myself?",
        a: "You can, but you don't have to. Small changes like a new phone number or a new photo are part of your plan. If you'd rather make changes yourself, tell us and we'll set that up.",
      },
      {
        q: "What happens if I want to cancel?",
        a: "You cancel. That's it. No exit fees and no lock-in. You keep your domain, your content and your code, and it all goes with you if you go elsewhere.",
      },
    ],
    relatedSlugs: ["local-seo", "google-business-profile", "social-media-management"],
  },
  {
    slug: "social-media-management",
    metaTitle: "Social media help for small businesses",
    metaDescription:
      "Need help with social media? Dorza can plan and write posts in your voice for Instagram and Facebook, and nothing goes out without your OK. Ask us.",
    eyebrow: "// Social media",
    title: "Social media, when you want a hand.",
    description:
      "Social media isn't one of our main services, but we do it when you ask. We plan your posts, write them in your voice and publish them once you've said yes.",
    problemHeadline: "Your last post was in March.",
    problemDescription:
      "You know you should be posting. People check your socials before they call. But between running the business and doing the work, social media drops to the bottom of the list. Every time.",
    problemPoints: [
      "You post when you remember, then nothing for weeks",
      "You've run out of ideas and you're sick of posting the same thing",
      "Your Instagram looks quiet, and people wonder if you've closed",
      "You tried a scheduling tool, but you still had to come up with every post yourself",
    ],
    solutionHeadline: "Posts that sound like you.",
    solutionDescription:
      "We plan and write posts around your business, your customers and what's on in your area. You approve them, we publish them. How often you post is up to you, and we'll quote for it.",
    features: [
      {
        title: "Regular posting",
        description:
          "We agree how often you want to post, then we keep to it. No long gaps, and no flooding your followers either.",
      },
      {
        title: "A plan you can see",
        description:
          "We plan posts ahead around the seasons, local events and what's happening in your trade. You always know what's coming.",
      },
      {
        title: "In your voice",
        description:
          "We learn how you talk and write that way. A no-nonsense plumber's posts should sound like a no-nonsense plumber.",
      },
      {
        title: "What's working",
        description:
          "We look at which posts get a response and change the plan to suit. You hear about what matters to the business, not follower counts.",
      },
      {
        title: "Instagram, Facebook and Google",
        description:
          "We can post to Instagram, Facebook and your Google Business Profile, with each post set up for where it's going.",
      },
      {
        title: "About your area",
        description:
          "Posts about your community, your area and the jobs you actually do, with your own photos wherever we can.",
      },
    ],
    steps: [
      {
        title: "Tell us about your business",
        description:
          "How you talk, who your customers are, and a few posts you like the look of. That's how we get the tone right.",
      },
      {
        title: "We plan and write your posts",
        description:
          "You see the plan ahead of time. Approve it, ask for changes, or tell us to run with it. Your call.",
      },
      {
        title: "We post, you run the business",
        description:
          "Posts go out as planned. We keep an eye on how they're doing and adjust as we go.",
      },
    ],
    faqs: [
      {
        q: "Do I need to provide my own photos?",
        a: "It helps, but you don't have to. Phone photos from the job or the shop floor work well. We can also make simple branded graphics.",
      },
      {
        q: "Do I get to approve posts before they go live?",
        a: "Yes. You see the plan before anything goes out, and you can approve, change or drop any post. Approve every one, or tell us to run with it once you're happy with the tone.",
      },
      {
        q: "Which platforms do you manage?",
        a: "Instagram and Facebook to start, plus posts on your Google Business Profile. Ask us about LinkedIn or TikTok and we'll tell you if they suit your business.",
      },
      {
        q: "Can't I just use a scheduling tool?",
        a: "You can. A scheduling tool posts what you give it. You still have to come up with the ideas, write the captions and make the graphics. We do that part, and you approve it.",
      },
    ],
    relatedSlugs: ["web-design", "google-business-profile", "local-seo"],
  },
  {
    slug: "google-business-profile",
    metaTitle: "Google Business Profile setup and management",
    metaDescription:
      "Show up on Google Maps and in local search. Dorza sets up your Google Business Profile properly, keeps it current with photos and posts, and helps you get reviews.",
    eyebrow: "// Google Business Profile",
    title: "Show up on Google Maps.",
    description:
      "When someone searches 'plumber near me', Google shows a map and a short list of businesses. We set up your Google Business Profile, fill it in properly and keep it current, so you have a real shot at that list.",
    problemHeadline: "Nobody can find you on Maps.",
    problemDescription:
      "The businesses getting the calls aren't always better than you. Often their Google Business Profile is set up properly and yours isn't. Or you don't have one at all.",
    problemPoints: [
      "You don't have a Google Business Profile, or it's half filled in",
      "You don't show up on Maps when people nearby search for what you do",
      "Other businesses show up above you because their profiles are complete",
      "You've got no reviews, no photos and no posts, so Google has little to go on",
    ],
    solutionHeadline: "Your profile, done properly.",
    solutionDescription:
      "We handle it, from creating the profile to keeping it current with new photos, regular posts and a simple way to ask for reviews. The aim is to show up when people near you search for what you do.",
    features: [
      {
        title: "Profile setup",
        description:
          "We set up your profile with the right categories, service areas and hours, and a clear description of what you do.",
      },
      {
        title: "Every field filled in",
        description:
          "Every field, category and attribute that applies to you, done. Google gets the full picture of your business.",
      },
      {
        title: "Photos",
        description:
          "Photos of your work, your team and your premises, added regularly so the profile looks current.",
      },
      {
        title: "Reviews",
        description:
          "A simple way to ask happy customers for reviews, plus templates for replying to each one. Reviews help people choose you.",
      },
      {
        title: "Google posts",
        description:
          "Short updates on your profile: new work, offers, news. We write and publish them so the profile doesn't go stale.",
      },
      {
        title: "Plain reports",
        description:
          "How people found you, how many called and how many asked for directions, taken from Google's own figures. No vanity metrics.",
      },
    ],
    steps: [
      {
        title: "We check or create your profile",
        description:
          "Already have one? We go through it and fix what's wrong. Don't have one? We create it and take you through Google's verification.",
      },
      {
        title: "We fill it in properly",
        description:
          "Every field, your photos, your description, your service areas and your first posts.",
      },
      {
        title: "We keep it current",
        description:
          "Regular posts, new photos, an eye on your reviews and a plain report on how it's going.",
      },
    ],
    faqs: [
      {
        q: "Is Google Business Profile free?",
        a: "Yes. The profile is free from Google. What you pay us for is setting it up properly and keeping it current, so it keeps working for you.",
      },
      {
        q: "How long before I start showing up on Maps?",
        a: "Google has to verify the profile first, and that runs on Google's timing. After that, where you show up depends on how many businesses near you do the same thing. We don't promise a position. We set it up properly and keep it current.",
      },
      {
        q: "I already have a Google Business Profile. Can you improve it?",
        a: "Yes, and that's common. We go through your profile, fix what's wrong, fill the gaps and keep it current from there.",
      },
      {
        q: "Do I need a physical shop or office address?",
        a: "No. If you go to your customers, like a tradie, cleaner or mobile mechanic, you can hide your address and list the areas you serve. We'll set that up so you still show up in local results.",
      },
    ],
    relatedSlugs: ["local-seo", "web-design", "social-media-management"],
  },
  {
    slug: "local-seo",
    metaTitle: "Local SEO for small businesses",
    metaDescription:
      "Get found on Google by people near you. Dorza handles on-page SEO, your Google Business Profile, directory listings, reviews and pages for the areas you serve.",
    eyebrow: "// Local SEO",
    title: "Get found by people near you.",
    description:
      "You don't need to rank everywhere. You need to show up where your customers live and work. That's what local SEO is for, and it's what we work on.",
    problemHeadline: "The business down the road shows up first.",
    problemDescription:
      "Someone searches 'electrician [your suburb]' or 'cafe near me', and another business comes up instead of you. Usually not because they're better at the job. They've put work into local SEO and you haven't yet.",
    problemPoints: [
      "You don't show up for '[your service] + [your suburb]' searches",
      "Other businesses appear above you in Google and on Maps",
      "You've got no plan for reviews, directory listings or the searches people near you make",
      "You're relying on word of mouth while enquiries go elsewhere",
    ],
    solutionHeadline: "Rank where your customers are.",
    solutionDescription:
      "We put together a local SEO plan for your business and the areas you serve. It covers your website, your Google Business Profile, directory listings, reviews and pages for each area, all aimed at the searches people near you are making.",
    features: [
      {
        title: "On-page SEO",
        description:
          "We set up your titles, descriptions, headings and content around the searches your customers actually make. Proper foundations, not keyword stuffing.",
      },
      {
        title: "Google Business Profile",
        description:
          "We set up and look after your profile. It's what puts you on the map when people nearby search for what you do.",
      },
      {
        title: "Directory listings",
        description:
          "We list your business on the directories that matter for your trade, with the same name, address and phone number everywhere.",
      },
      {
        title: "Reviews",
        description:
          "A simple way to ask happy customers for reviews. We give you the templates, you send them. Reviews help people pick you.",
      },
      {
        title: "Pages for your areas",
        description:
          "A page for each area you serve. 'Plumber [your suburb]' and 'plumber near me' are different searches, so we write for both.",
      },
      {
        title: "Plain reports",
        description:
          "Plain-English reports on where you rank, your traffic and your enquiries. You'll know what's working and what we're doing about the rest.",
      },
    ],
    steps: [
      {
        title: "We check where you stand",
        description:
          "We look at your site, your Google profile and the local searches you should be showing up for. Then we work from what we find, not guesswork.",
      },
      {
        title: "We fix and build",
        description:
          "We fix your site's SEO foundations, set up your Google Business Profile, list you on directories and write pages for your areas.",
      },
      {
        title: "We track and keep going",
        description:
          "We track your rankings, report back and keep improving. Local SEO takes time, so we stay on it.",
      },
    ],
    faqs: [
      {
        q: "How long does local SEO take to show results?",
        a: "It takes time, and how long depends on your trade, your area and how much ground there is to make up. We'll tell you what we're seeing as it happens, in plain English.",
      },
      {
        q: "What's the difference between local SEO and regular SEO?",
        a: "Regular SEO tries to rank you everywhere. Local SEO is about searches tied to a place, like 'near me' and '[service] [suburb]'. If your customers come from your area, that's the SEO that matters.",
      },
      {
        q: "Do I need a website before starting local SEO?",
        a: "It helps a lot, but we can start with your Google Business Profile and directory listings. A proper website gives Google much more to work with, and we can build one for you at the same time.",
      },
      {
        q: "Can you guarantee first-page rankings?",
        a: "No. Google decides rankings, so we don't guarantee them. What we do: set up the foundations properly, track where you stand, keep working on it and tell you plainly how it's going.",
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
    .filter((s): s is ServicePage => typeof s === "object");
}
