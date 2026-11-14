export const SITE_URL = "https://www.dorza.com.au";
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

export const INDUSTRY_PAGES = [
  { name: "Cafes & Restaurants", slug: "cafes-restaurants" },
  { name: "Tradies", slug: "tradies" },
  { name: "Salons & Beauty", slug: "salons-beauty" },
] as const;

/** IndexNow key. The same value sits in public/<key>.txt so Bing can verify pings from scripts/indexnow.mjs. */
export const INDEXNOW_KEY = "1edde3b2879424e0a1e619ccf79d1e91";
