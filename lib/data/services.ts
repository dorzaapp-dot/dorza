import { PILLARS, type PillarService, type ServiceStatus } from "@/lib/data/pillars";

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
  /** The pillar service this page sells, by its exact name in lib/data/pillars.ts. Its status comes from there. */
  pillarService?: string;
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
    pillarService: "Website and hosting",
    metaTitle: "Web design for small businesses",
    metaDescription:
      "Websites built by hand for your business, found on Google and easy to use on a phone. From $499, with a plan and a price in 72 hours. No lock-in.",
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
    relatedSlugs: ["local-seo", "online-store", "booking-systems"],
  },
  {
    slug: "social-media-management",
    pillarService: "Social media",
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
    pillarService: "Google Business Profile",
    metaTitle: "Google Business Profile setup and management",
    metaDescription:
      "Show up on Google Maps and in local search. We set up your Google Business Profile properly, keep it current and help you get reviews.",
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
    pillarService: "SEO and content",
    metaTitle: "Local SEO for small businesses",
    metaDescription:
      "Get found on Google by people near you: on-page SEO, your Google Business Profile, directory listings, reviews and pages for the areas you serve.",
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
    relatedSlugs: ["google-business-profile", "google-ads", "web-design"],
  },
  {
    slug: "booking-systems",
    pillarService: "Booking systems and dashboards",
    metaTitle: "Online booking systems for small businesses",
    metaDescription:
      "Online bookings with real availability and confirmations both ways. We set up a booking app if one fits, and build one if none does, like Drivable's.",
    eyebrow: "// Booking systems",
    title: "Bookings without the phone tag.",
    description:
      "Customers book a slot that's actually free, online, at any hour. If a booking app you can buy already fits your business, we'll set that up. If none does, we'll build one.",
    problemHeadline: "Every booking starts with a phone call.",
    problemDescription:
      "You're on a job when the phone rings, so you call back between tasks and leave a message. By the time you two connect, they've booked with someone who let them do it online.",
    problemPoints: [
      "Bookings depend on you picking up the phone",
      "Two people manage the diary, so slots get double booked",
      "Customers forget appointments and don't turn up",
      "The booking apps you've tried can't handle how your business works",
    ],
    solutionHeadline: "Off the shelf first. Custom if needed.",
    solutionDescription:
      "Plenty of businesses are well served by an app like Square Appointments or Setmore, and we'll set it up properly on your site. When your rules are too specific for an app, we build the booking system and the screen you run it from.",
    features: [
      {
        title: "Real availability",
        description: "Customers only see times that are actually free, so nobody books a slot that's already taken.",
      },
      {
        title: "Confirmations both ways",
        description: "An email to you and one to your customer the moment a booking comes in.",
      },
      {
        title: "Reminders",
        description: "A reminder before the appointment, so fewer people forget. Most booking apps include them, and we switch them on.",
      },
      {
        title: "A screen to manage it",
        description: "See, move and cancel bookings from one place, on your phone or at the desk.",
      },
      {
        title: "Book from your site and Google",
        description: "A booking button on your website and, where your app supports it, on your Google Business Profile too.",
      },
    ],
    steps: [
      {
        title: "We look at how you take bookings",
        description: "What people book, how long it takes, who does it and what you charge. That tells us whether an app will do.",
      },
      {
        title: "We set it up or build it",
        description: "An app configured and added to your site, or a custom system built and tested. You'll know which, and the price, before we start.",
      },
      {
        title: "Bookings come in online",
        description: "We launch it with you, show you the admin screen and stay on for changes.",
      },
    ],
    faqs: [
      {
        q: "What's the best online booking system for a small business?",
        a: "It depends on what you take bookings for. One-on-one appointments suit most apps. Hire fleets, classes, rosters and packages are where apps start to struggle. Tell us how bookings work for you and we'll say which app fits, or whether it's worth building.",
      },
      {
        q: "Do I need a custom booking system?",
        a: "Usually not, and we'll say so. We build one when no app handles your rules. Drivable hires out accessible vans and 4WDs, and customers needed to compare the fleet and book a vehicle, so we built the website and the booking system behind it.",
      },
      {
        q: "Can customers pay when they book?",
        a: "Most booking apps can take a payment or a deposit at the time of booking. If you want that, we'll set it up.",
      },
      {
        q: "How much does an online booking system cost?",
        a: "A booking app has its own monthly fee, which you pay to the app. A custom build is a one-off price. Either way, you'll have our price in your plan within 72 hours of telling us how you take bookings.",
      },
    ],
    relatedSlugs: ["web-design", "crm-setup", "google-business-profile"],
  },
  {
    slug: "online-store",
    pillarService: "Online stores",
    metaTitle: "Shopify store setup for small businesses",
    metaDescription:
      "We set up your online store on Shopify, or the platform that suits what you sell, with products, payments, GST and shipping on an account you own.",
    eyebrow: "// Online stores",
    title: "An online store, set up properly.",
    description:
      "Products, payments, GST and shipping, set up on a platform you own, usually Shopify, and tested before your first real order.",
    problemHeadline: "Setting up a store eats your weekends.",
    problemDescription:
      "Picking a theme is the easy bit. Then come tax settings, shipping zones, payment providers, product photos that don't match and a checkout you've never tried on a phone. It's easy to lose a month to it and still launch something you don't trust.",
    problemPoints: [
      "You can't tell whether Shopify, Square or something else suits what you sell",
      "GST, shipping rates and payment fees are confusing to set up",
      "Your products, photos and stock live in a spreadsheet",
      "Stock in the shop and stock online never match",
    ],
    solutionHeadline: "We set it up. You start selling.",
    solutionDescription:
      "We look at what you sell and how you sell it now, recommend a platform, then build the store and test it before it takes a real order. The account is in your name from the first day.",
    features: [
      {
        title: "The right platform",
        description:
          "Usually Shopify. If you already take payments in person with Square, Square Online can keep it all in one place, and we'll tell you so.",
      },
      {
        title: "Products and stock",
        description: "Products, sizes, photos and stock levels loaded in and checked, so what the store says matches the shelf.",
      },
      {
        title: "Payments and GST",
        description: "Your payment provider connected, and GST set up on your prices and shown properly at checkout.",
      },
      {
        title: "Shipping and pickup",
        description: "Shipping rates and delivery options that match how you actually send things, plus local pickup if you offer it.",
      },
      {
        title: "Tested before launch",
        description: "We place test orders from start to finish, on a phone and a laptop, before a real customer does.",
      },
      {
        title: "Yours to run",
        description: "A walkthrough so you can add products and send orders yourself. Changes after that come through Support.",
      },
    ],
    steps: [
      {
        title: "Tell us what you sell",
        description: "What you sell, roughly how many products, and where you sell now. We'll say plainly if a store is the right move.",
      },
      {
        title: "We set it up",
        description: "Platform, products, payments, GST and shipping, built and tested on an account in your name.",
      },
      {
        title: "You start selling",
        description: "We launch it with you, show you how to run it and stay on for changes.",
      },
    ],
    faqs: [
      {
        q: "How much does it cost to set up a Shopify store?",
        a: "There are two costs. The platform's monthly plan and payment fees go to Shopify. The setup work is a one-off price, and you'll have ours in your plan within 72 hours of telling us what you sell.",
      },
      {
        q: "Shopify or Square: which should I use?",
        a: "If you already sell in person with Square, Square Online keeps your stock and payments in one place. If online is your main channel, or you have a lot of products, Shopify is usually the better fit. We recommend one for your business, not by habit.",
      },
      {
        q: "Do I own the store?",
        a: "Yes. The account, the domain and your customer list are in your name. If you stop working with us, it all stays with you.",
      },
      {
        q: "Can you move my existing store?",
        a: "Often, yes. Tell us where it runs now and how many products you have, and we'll tell you what moving it involves before you commit.",
      },
    ],
    relatedSlugs: ["web-design", "google-ads", "local-seo"],
  },
  {
    slug: "crm-setup",
    pillarService: "CRM setup",
    metaTitle: "CRM setup for small businesses and tradies",
    metaDescription:
      "Quotes going cold? We help you pick a CRM or job management app that fits your trade, bring your contacts across and set up quote reminders.",
    eyebrow: "// CRM setup",
    title: "Every customer and quote in one place.",
    description:
      "We help you pick the right app for how your business runs, set it up and bring your contacts across, so follow-ups stop living in your inbox and your head.",
    problemHeadline: "The quote goes out. Then nothing.",
    problemDescription:
      "You send a quote, get busy, and a week later can't remember who you're waiting on. Your customer list is split between your phone, your email and a notebook in the ute, so the job goes to whoever rang back first.",
    problemPoints: [
      "Customer details are spread across your phone, email and paper",
      "You can't see which quotes are still open",
      "Follow-ups happen when you remember, not when they're due",
      "You've read the CRM comparisons and still can't tell which one you need",
    ],
    solutionHeadline: "The right app, set up properly.",
    solutionDescription:
      "Plenty of trades don't need a sales CRM at all. Job management apps like ServiceM8, Tradify and Fergus handle quotes, jobs and invoices, while HubSpot or Zoho suit businesses chasing leads. We work out which fits, then set it up for the way you work.",
    features: [
      {
        title: "Chosen for your trade",
        description:
          "We look at how work comes in, gets quoted and gets done, then recommend an app and tell you its monthly cost before you sign up.",
      },
      {
        title: "Your contacts brought across",
        description: "Customers and open quotes moved in from your phone, email, spreadsheets or old software, with duplicates cleaned out.",
      },
      {
        title: "Quote reminders",
        description: "A reminder for every quote you're waiting on, so nothing goes cold because you got busy.",
      },
      {
        title: "Enquiries land in one place",
        description: "Where the app allows it, enquiries from your website arrive as new leads, not only as emails.",
      },
      {
        title: "On every phone",
        description: "Installed and signed in on the phones and laptops your team uses, with a walkthrough for everyone.",
      },
    ],
    steps: [
      {
        title: "We look at how you work",
        description: "How enquiries arrive, how you quote and how you follow up. Then we recommend an app, with its monthly cost.",
      },
      {
        title: "We set it up",
        description: "The account, your stages from enquiry to paid, your contacts, reminders and the link from your website.",
      },
      {
        title: "Your team starts using it",
        description: "A walkthrough for you and your staff, and Support for changes after that.",
      },
    ],
    faqs: [
      {
        q: "What's the best CRM for a small business?",
        a: "The one your team will actually open. For most trades that's a job management app that also tracks quotes. For businesses selling to other businesses, a sales CRM like HubSpot often fits better. We recommend one after we've seen how you work.",
      },
      {
        q: "Do tradies need a CRM?",
        a: "Not always. If the problem is quoting, scheduling and invoicing, a job management app covers it. If leads go cold before you quote, a CRM helps. Plenty of businesses only need one of the two.",
      },
      {
        q: "How much does a CRM cost?",
        a: "Most charge a monthly fee for each person using it, and some have free plans for small teams. You'll know the app's cost before you commit, and our setup price comes in your plan within 72 hours.",
      },
      {
        q: "Can you move my contacts from my phone or old system?",
        a: "Yes. We bring across what you have, from a phone, spreadsheets or most older apps, and clean out duplicates on the way.",
      },
    ],
    relatedSlugs: ["booking-systems", "business-email", "web-design"],
  },
  {
    slug: "google-ads",
    pillarService: "Paid ads",
    metaTitle: "Google Ads management for small businesses",
    metaDescription:
      "Google search ads set up and watched for small businesses. We check your site can turn clicks into enquiries first, then agree a budget with you.",
    eyebrow: "// Google Ads",
    title: "Ads, once your site can convert them.",
    description:
      "Search ads on Google that show up when people look for what you do. We make sure the page they land on is ready first, so you aren't paying for clicks that go nowhere.",
    problemHeadline: "Paying for clicks that never call.",
    problemDescription:
      "Google makes it easy to start spending and hard to tell what's working. Broad keywords pull in the wrong searches, the ad sends people to a homepage that doesn't answer their question, and the bill arrives anyway.",
    problemPoints: [
      "You're spending on ads and can't say what you get back",
      "Your ads show up for searches that have nothing to do with you",
      "People click through to a page that doesn't match the ad",
      "You've been quoted a management fee and can't tell if it's fair",
    ],
    solutionHeadline: "Your site first, then ads.",
    solutionDescription:
      "We check the pages your ads will point to before any money goes to Google. Then we set up search campaigns around the searches that bring in work, agree a monthly budget with you and keep watching them.",
    features: [
      {
        title: "Your site checked first",
        description:
          "If the page an ad lands on won't turn a click into a call or an enquiry, we fix that before the ads run. Sometimes that fix is enough on its own.",
      },
      {
        title: "Search campaigns",
        description: "Ads for the searches that bring in work, like your service plus your area, with the time-wasting searches blocked.",
      },
      {
        title: "Landing pages that match",
        description: "Each ad points to a page that answers the search, not to your homepage.",
      },
      {
        title: "Calls and enquiries counted",
        description: "Tracking for calls and form enquiries, so you can see what the ads actually bring in.",
      },
      {
        title: "A budget agreed first",
        description: "You set what goes to Google each month. Nothing runs until you've agreed it.",
      },
      {
        title: "Plain reports",
        description: "What you spent, what came in and what we're changing, in plain English.",
      },
    ],
    steps: [
      {
        title: "We check your site and your searches",
        description: "Whether your pages are ready for paid traffic, and which searches are worth paying for in your area.",
      },
      {
        title: "We set up and launch",
        description: "Campaigns, landing pages and tracking, built around the budget you've agreed.",
      },
      {
        title: "We watch and adjust",
        description: "We cut what doesn't work, keep what does and report back in plain English.",
      },
    ],
    faqs: [
      {
        q: "How much do Google Ads cost for a small business?",
        a: "There are two costs. Your ad spend goes straight to Google, and you set it. The management fee pays for setting up and watching the campaigns. Ask anyone you talk to, us included, for both numbers in writing. You'll get ours in your plan within 72 hours.",
      },
      {
        q: "Should I run Google Ads or work on SEO?",
        a: "Ads bring in calls from the day they go live and stop when you stop paying. SEO takes longer and keeps working. Plenty of small businesses run ads while their SEO builds, then spend less on ads as search picks up.",
      },
      {
        q: "How long until ads bring in enquiries?",
        a: "Search ads can bring clicks within days of going live. Turning clicks into steady enquiries takes a few weeks of watching and adjusting.",
      },
      {
        q: "Do you run Facebook and Instagram ads?",
        a: "We start with Google search ads, because people searching are already looking for what you do. Ask us about social ads if that's where your customers spend their time.",
      },
    ],
    relatedSlugs: ["local-seo", "web-design", "google-business-profile"],
  },
  {
    slug: "business-email",
    pillarService: "Domain and business email",
    metaTitle: "Business email: Google Workspace or Microsoft 365",
    metaDescription:
      "Email at your own domain on Google Workspace or Microsoft 365, set up for your whole team, with old emails moved across and every phone signed in.",
    eyebrow: "// Business email",
    title: "Your own domain, and email to match.",
    description:
      "A web address registered in your name, and email on Google Workspace or Microsoft 365 that works on every phone and laptop your team uses.",
    problemHeadline: "Still quoting from a Gmail address?",
    problemDescription:
      "A quote from a free email address looks less sure of itself than one from you@yourbusiness.com.au. And when a staff member leaves, their emails and files shouldn't walk out the door with them.",
    problemPoints: [
      "You're quoting from a free Gmail, Hotmail or BigPond address",
      "Someone else registered your domain and you can't get into it",
      "Staff use their own accounts, so customer emails leave when they do",
      "Emails from your address keep landing in customers' junk folders",
    ],
    solutionHeadline: "One address, set up properly.",
    solutionDescription:
      "We register or recover your domain in your name, set up Google Workspace or Microsoft 365, sort out the settings that keep your mail out of junk folders and get every device signed in.",
    features: [
      {
        title: "Your domain, in your name",
        description: "Registered to you, not to a web designer you can't reach. If someone else holds it, we help you get it back.",
      },
      {
        title: "Google Workspace or Microsoft 365",
        description: "Google if your team lives in Gmail and works in a browser. Microsoft if you work in Word, Excel and Outlook. We'll help you pick.",
      },
      {
        title: "Out of the junk folder",
        description: "SPF, DKIM and DMARC set up properly. They're the settings that prove to inboxes your email really comes from you.",
      },
      {
        title: "Old emails moved across",
        description: "Your existing mail, contacts and calendars brought into the new account before we switch over.",
      },
      {
        title: "On every device",
        description: "Set up on your team's phones and laptops, with shared calendars and files.",
      },
    ],
    steps: [
      {
        title: "We check what you have",
        description: "Who holds your domain, where your email lives now and how many people need an account.",
      },
      {
        title: "We set it up",
        description: "Domain, accounts, mail settings and your old emails moved across, with no gap in between.",
      },
      {
        title: "Everyone's signed in",
        description: "Every phone and laptop set up, and Support for new staff and changes after that.",
      },
    ],
    faqs: [
      {
        q: "Google Workspace or Microsoft 365: which is better for a small business?",
        a: "Both handle email on your own domain well. Pick Google if your team already uses Gmail and works in a browser. Pick Microsoft if you rely on Word, Excel and Outlook on a computer. We'll ask how you work and recommend one.",
      },
      {
        q: "How much does business email cost?",
        a: "Google and Microsoft charge for each person, each month, and you pay them directly. Your domain has a small yearly fee. Our setup price comes in your plan within 72 hours.",
      },
      {
        q: "Will I lose my old emails?",
        a: "No. We move your existing mail, contacts and calendars across before the switch.",
      },
      {
        q: "Can I keep my current domain?",
        a: "Yes. If it's registered somewhere you can log in to, we use it. If it isn't, we help you get it back first.",
      },
    ],
    relatedSlugs: ["web-design", "crm-setup", "google-business-profile"],
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

/** The pillar service a page sells: its name, status and one-line blurb. */
export function servicePillar(page: ServicePage): PillarService | undefined {
  return PILLARS.flatMap((p) => p.services).find((s) => s.name === page.pillarService);
}

/** Live unless the pillar service behind the page is still "ask". */
export function serviceStatus(page: ServicePage): ServiceStatus {
  if (!page.pillarService) return "live";
  return servicePillar(page)?.status ?? "ask";
}
