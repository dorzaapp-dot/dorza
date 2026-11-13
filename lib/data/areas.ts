export interface Area {
  slug: string;
  name: string;
  postcode: string;
  isHub: boolean;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  localContext: string;
  localPoints: string[];
  businessTypes: string[];
  nearbySlugs: string[];
}

export const AREAS: Area[] = [
  {
    slug: "western-sydney",
    name: "Western Sydney",
    postcode: "2150",
    isHub: true,
    metaTitle: "Web Design & Digital Marketing for Western Sydney Small Business",
    metaDescription:
      "Dorza helps Western Sydney small businesses get found online with professional web design, local SEO and Google Business Profile setup. Social media is available on request.",
    eyebrow: "// Western Sydney",
    title: "Web design and digital marketing for Western Sydney small business",
    description:
      "From Parramatta to Penrith, plenty of local businesses are hard to find online. We help Western Sydney small businesses get a professional website, show up on Google, and turn local searches into real customers.",
    localContext:
      "Western Sydney is home to a big population and a lot of small businesses that form the backbone of the local economy. From cafes on Church Street to tradies in Blacktown, these businesses serve their communities every day, but many are hard to find online. More and more people search for local services on their phones, so a professional web presence is no longer optional. It is the difference between being found and being forgotten.",
    localPoints: [
      "A large and growing population across Greater Western Sydney",
      "New suburbs and infrastructure going in across the region",
      "Plenty of local businesses still without a proper website or Google presence",
      "Mobile-first customers searching for services near them every day",
    ],
    businessTypes: [
      "Cafes & restaurants",
      "Tradies & contractors",
      "Hair & beauty salons",
      "Gyms & fitness studios",
      "Retail shops",
      "Professional services",
      "Healthcare providers",
      "Automotive services",
    ],
    nearbySlugs: ["parramatta", "blacktown", "penrith", "liverpool", "campbelltown"],
  },
  {
    slug: "parramatta",
    name: "Parramatta",
    postcode: "2150",
    isHub: false,
    metaTitle: "Web Design & Digital Marketing for Parramatta Businesses",
    metaDescription:
      "Professional websites, local SEO and Google profiles for Parramatta businesses. Stand out from national chains on Church Street and across Sydney's second CBD.",
    eyebrow: "// Parramatta",
    title: "Web design and digital marketing for Parramatta businesses",
    description:
      "Parramatta is Sydney's second CBD, a hub of commerce, dining and professional services. We help local businesses stand out against national chains with websites that convert and marketing that reaches the right customers.",
    localContext:
      "Parramatta has transformed into Sydney's second CBD, with the new Parramatta Light Rail, the Powerhouse Parramatta arts precinct, and a skyline that grows every year. Church Street remains the beating heart of local business, from long-standing family restaurants to new cafes and boutiques. But as national chains move in and competition intensifies, local operators need more than foot traffic. A strong digital presence helps Parramatta businesses compete on Google, attract customers from surrounding suburbs, and build the kind of reputation that keeps people coming back.",
    localPoints: [
      "Sydney's second CBD with major commercial and residential growth",
      "Church Street dining and retail strip with intense local competition",
      "New Parramatta Metro station bringing more daily commuters into the area",
      "Powerhouse Parramatta and Riverside Theatre drawing visitors to the area",
    ],
    businessTypes: [
      "Cafes & restaurants",
      "Professional services",
      "Retail shops",
      "Hair & beauty salons",
      "Healthcare providers",
      "Fitness studios",
    ],
    nearbySlugs: ["western-sydney", "blacktown", "castle-hill"],
  },
  {
    slug: "blacktown",
    name: "Blacktown",
    postcode: "2148",
    isHub: false,
    metaTitle: "Websites & Digital Marketing for Blacktown Businesses",
    metaDescription:
      "Dorza builds professional websites and runs digital marketing for Blacktown businesses. Reach customers across a big, diverse and growing community.",
    eyebrow: "// Blacktown",
    title: "Websites and digital marketing for Blacktown businesses",
    description:
      "Blacktown is a big, diverse and growing community. We help local businesses reach it with websites and Google profiles that get them found.",
    localContext:
      "The City of Blacktown is a large, diverse, multicultural community. From the bustling Blacktown Markets on Sundays to the shops lining Main Street and the surrounding retail centres, small businesses are everywhere, but many still rely on word of mouth alone. With such a large and growing population, the opportunity for businesses to reach new customers online is enormous. A professional website and Google presence can connect a Blacktown business with nearby residents searching for exactly what they offer.",
    localPoints: [
      "A large council area with a big and growing population",
      "Diverse, multicultural community with varied service needs",
      "Blacktown Markets and Main Street as key local commercial hubs",
      "Rapid residential growth in surrounding suburbs like Marsden Park and Schofields",
    ],
    businessTypes: [
      "Tradies & contractors",
      "Cafes & restaurants",
      "Retail shops",
      "Automotive services",
      "Hair & beauty salons",
      "Healthcare providers",
    ],
    nearbySlugs: ["western-sydney", "parramatta", "penrith"],
  },
  {
    slug: "penrith",
    name: "Penrith",
    postcode: "2750",
    isHub: false,
    metaTitle: "Web Design & Marketing for Penrith Small Businesses",
    metaDescription:
      "Professional web design, local SEO and Google profiles for Penrith businesses. Reach customers across the gateway to the Blue Mountains and the new Western Sydney Airport corridor.",
    eyebrow: "// Penrith",
    title: "Web design and marketing for Penrith small businesses",
    description:
      "Penrith sits at the gateway to the Blue Mountains and the doorstep of the new Western Sydney Airport. We help local businesses get online and get found, from High Street shops to Panthers precinct services.",
    localContext:
      "Penrith is going through a major transformation. The new Western Sydney International Airport at Badgerys Creek is set to reshape the entire region, bringing jobs, infrastructure and new residents. High Street remains the commercial spine of the city, while the Panthers precinct has grown into a major entertainment and dining destination. For Penrith businesses, the next few years are a real opportunity, but only if potential customers can find them online. A professional website and strong local SEO help make sure that when someone searches for a service in Penrith, your business is the one they call.",
    localPoints: [
      "Gateway to the Blue Mountains with strong tourism and visitor traffic",
      "Western Sydney International Airport at Badgerys Creek driving regional growth",
      "High Street and Penrith CBD as the main retail and services corridor",
      "Panthers precinct drawing visitors for dining, events and entertainment",
    ],
    businessTypes: [
      "Tradies & contractors",
      "Cafes & restaurants",
      "Fitness studios",
      "Retail shops",
      "Professional services",
      "Automotive services",
    ],
    nearbySlugs: ["western-sydney", "blacktown", "campbelltown"],
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    postcode: "2170",
    isHub: false,
    metaTitle: "Websites & Digital Marketing for Liverpool Businesses",
    metaDescription:
      "Dorza builds professional websites and manages digital marketing for Liverpool businesses. Reach a young and growing local population.",
    eyebrow: "// Liverpool",
    title: "Websites and digital marketing for Liverpool businesses",
    description:
      "Liverpool is a major commercial hub in south-west Sydney with a young, growing population. We help local businesses get a website, show up on Google and connect with the community.",
    localContext:
      "Liverpool is one of south-west Sydney's key commercial centres, anchored by Westfield Liverpool, Liverpool Hospital and a growing CBD that attracts professionals, families and students alike. It has a young population, which means a digitally native customer base that expects to find businesses online before they visit in person. From medical practices near the hospital to food outlets along Macquarie Street and trade services across the surrounding suburbs, Liverpool businesses that invest in their online presence reach customers that word of mouth alone cannot.",
    localPoints: [
      "Major south-west Sydney commercial hub with a growing CBD",
      "A young, digitally native local population",
      "Liverpool Hospital precinct driving demand for health and allied services",
      "Westfield Liverpool and Macquarie Street as key retail and dining strips",
    ],
    businessTypes: [
      "Healthcare providers",
      "Cafes & restaurants",
      "Retail shops",
      "Professional services",
      "Hair & beauty salons",
      "Tradies & contractors",
    ],
    nearbySlugs: ["western-sydney", "campbelltown", "parramatta"],
  },
  {
    slug: "campbelltown",
    name: "Campbelltown",
    postcode: "2560",
    isHub: false,
    metaTitle: "Web Design & Marketing for Campbelltown Businesses",
    metaDescription:
      "Professional web design, local SEO and Google Business Profile for Campbelltown businesses. Reach customers across a growing part of south-west Sydney.",
    eyebrow: "// Campbelltown",
    title: "Web design and marketing for Campbelltown businesses",
    description:
      "Campbelltown is a growing area, anchored by a major university campus and a busy local economy. We help Campbelltown businesses build a professional web presence and attract more local customers.",
    localContext:
      "Campbelltown has grown from a satellite town into a major growth corridor for Sydney. The Western Sydney University campus brings a steady flow of students, the Queen Street mall remains the heart of local retail, and Macarthur Square draws shoppers from across the Macarthur region. With significant residential development in suburbs like Oran Park, Gregory Hills and Leppington, the local customer base keeps expanding. For businesses in Campbelltown, being online is no longer a nice-to-have. It is essential to catching the attention of new residents and competing with the chains that are moving into the area.",
    localPoints: [
      "A growth corridor with steady residential development",
      "Western Sydney University campus bringing students and young professionals",
      "Queen Street mall and Macarthur Square as key retail destinations",
      "New suburbs like Oran Park and Gregory Hills expanding the local customer base",
    ],
    businessTypes: [
      "Cafes & restaurants",
      "Tradies & contractors",
      "Fitness studios",
      "Retail shops",
      "Hair & beauty salons",
      "Professional services",
    ],
    nearbySlugs: ["western-sydney", "liverpool", "penrith"],
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getNearbySlugs(slugs: string[]): Area[] {
  return slugs
    .map((s) => AREAS.find((a) => a.slug === s))
    .filter((a): a is Area => a !== undefined);
}
