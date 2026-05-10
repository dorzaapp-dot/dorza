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

  // Step 5 - Brand & style
  hasLogo: "Yes" | "No" | "";
  brandColours: string;
  tone: string;
  inspirationSites: string;
  brandKeywords: string;

  // Step 6 - Photos & assets
  logoStatus: "Received" | "Client will send" | "No logo" | "";
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

  // Step 9 - Review
  notes: string;
}

export type OnboardAction =
  | { type: "UPDATE_FIELD"; field: keyof OnboardState; value: unknown }
  | { type: "ADD_SERVICE" }
  | { type: "REMOVE_SERVICE"; index: number }
  | { type: "UPDATE_SERVICE"; index: number; value: string }
  | { type: "TOGGLE_DISCOVERY_CHANNEL"; channel: string }
  | { type: "TOGGLE_WEBSITE_SECTION"; section: string };
