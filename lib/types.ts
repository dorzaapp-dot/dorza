export type BusinessType =
  | "Tradie"
  | "Cafe/Restaurant"
  | "Salon/Beauty"
  | "Fitness/Wellness"
  | "Retail"
  | "Professional Services"
  | "Other";

export interface WaitlistFormData {
  name: string;
  email: string;
  phone?: string;
  businessType: BusinessType | "";
  suburb: string;
  frustration?: string;
}

export type BrandColourRole = "primary" | "secondary" | "tertiary";

export interface BrandColour {
  role: BrandColourRole;
  hex: string;
}

export type EnquirySource = "inline" | "modal";

export interface EnquiryFormData {
  name: string;
  email: string;
  businessType: BusinessType | "";
  suburb: string;
  servicesInterested: string[];
  message?: string;
  source: EnquirySource;
  // Honeypot — must remain empty for genuine submissions.
  website?: string;
}

export interface OnboardState {
  // Step 1 - Business basics
  businessName: string;
  ownerName: string;
  businessType: BusinessType | "";
  customBusinessType: string;
  niche: string;
  abn: string;
  streetAddress: string;
  suburb: string;
  phone: string;
  email: string;
  openingHours: string;

  // Step 2 - Digital presence
  existingWebsite: string;
  googleBusiness: "Yes" | "No" | "Not sure" | "";
  instagramHandle: string;
  facebookPage: string;
  otherPlatforms: string;
  biggestFrustration: string;

  // Step 3 - Services
  services: string[];
  differentiator: string;
  priceRange: string;

  // Step 4 - Target customers
  typicalCustomer: string;
  serviceArea: string;
  discoveryChannels: string[];

  // Step 5 - Look & feel (brand + site vision)
  colourMood: string;        // own field — no longer overloaded into brandKeywords
  brandColours: string;      // free-text fallback ("navy and white")
  brandPalette: BrandColour[]; // up to 3 user-picked hex colours, role-labelled
  tone: string;
  inspirationSites: string;
  brandKeywords: string;     // now ONLY the three descriptive words
  logoStatus:
    | "Received"
    | "Client will send"
    | "No logo"
    | "Please design one"
    | "";

  // Step 6 - Photos & assets (logo lives in Look & feel now)
  photosStatus: "Received" | "Client will send" | "Use stock" | "Pull from Instagram" | "";
  menuDocStatus: "Received" | "Client will send" | "N/A" | "";
  testimonialsStatus: "Have specific ones" | "Pull from Google" | "None yet" | "";
  specificTestimonials: string;
  photoNotes: string;

  // Step 7 - Website sections
  websiteSections: Record<string, boolean>;
  bookingLink: string;
  ecommercePlatform: string;
  otherSections: string;
  siteVisionDescription: string;

  // Step 8 - Success
  successVision: string;

  // Step 8 - Review
  notes: string;
  agreedToTerms: boolean;
}

export type OnboardAction =
  | { type: "HYDRATE"; state: OnboardState }
  | { type: "UPDATE_FIELD"; field: keyof OnboardState; value: unknown }
  | { type: "ADD_SERVICE" }
  | { type: "REMOVE_SERVICE"; index: number }
  | { type: "UPDATE_SERVICE"; index: number; value: string }
  | { type: "TOGGLE_DISCOVERY_CHANNEL"; channel: string }
  | { type: "TOGGLE_WEBSITE_SECTION"; section: string };
