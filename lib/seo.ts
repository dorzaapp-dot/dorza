export const SITE_URL = "https://dorza.com.au";
export const BUSINESS_NAME = "Dorza";
export const CONTACT_EMAIL = "customer@dorza.com.au";
export const PHONE_DISPLAY = "0494 436 553";
export const PHONE_TEL = "+61494436553";
export const ADDRESS = {
  street: "",
  locality: "Parramatta",
  region: "NSW",
  postcode: "2150",
  country: "AU",
};

export const WESTERN_SYDNEY_SUBURBS = [
  { name: "Parramatta", slug: "parramatta", postcode: "2150" },
  { name: "Blacktown", slug: "blacktown", postcode: "2148" },
  { name: "Penrith", slug: "penrith", postcode: "2750" },
  { name: "Liverpool", slug: "liverpool", postcode: "2170" },
  { name: "Campbelltown", slug: "campbelltown", postcode: "2560" },
  { name: "Castle Hill", slug: "castle-hill", postcode: "2154" },
] as const;

export const SERVICE_PAGES = [
  { name: "Web Design", slug: "web-design" },
  { name: "Social Media Management", slug: "social-media-management" },
  { name: "Google Business Profile", slug: "google-business-profile" },
  { name: "Local SEO", slug: "local-seo" },
] as const;

export const INDUSTRY_PAGES = [
  { name: "Cafes & Restaurants", slug: "cafes-restaurants" },
  { name: "Tradies", slug: "tradies" },
  { name: "Salons & Beauty", slug: "salons-beauty" },
] as const;
