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
    metaTitle: "Web Design & Digital Marketing for Western Sydney Small Business | Dorza",
    metaDescription:
      "Dorza helps Western Sydney small businesses get found online with professional web design, local SEO, social media management and Google Business Profile setup.",
    eyebrow: "// Western Sydney",
    title: "Web design and digital marketing for Western Sydney small business",
    description:
      "From Parramatta to Penrith, most local businesses are invisible online. We help Western Sydney small businesses get a professional website, show up on Google, and turn local searches into real customers.",
    localContext:
      "Western Sydney is home to over 2.5 million residents and tens of thousands of small businesses that form the backbone of the local economy. From cafes on Church Street to tradies in Blacktown, these businesses serve their communities every day — but most are invisible online. With mobile searches for local services growing year on year, having a professional web presence is no longer optional. It is the difference between being found and being forgotten.",
    localPoints: [
      "Over 2.5 million residents across Greater Western Sydney",
      "One of Australia's fastest-growing regions with new suburbs and infrastructure",
      "Majority of local businesses lack a professional website or Google presence",
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
    metaTitle: "Web Design & Digital Marketing for Parramatta Businesses | Dorza",
    metaDescription:
      "Professional websites, local SEO and social media for Parramatta businesses. Stand out from national chains on Church Street and across Sydney's second CBD.",
    eyebrow: "// Parramatta",
    title: "Web design and digital marketing for Parramatta businesses",
    description:
      "Parramatta is Sydney's second CBD — a hub of commerce, dining and professional services. We help local businesses stand out against national chains with websites that convert and marketing that reaches the right customers.",
    localContext:
      "Parramatta has transformed into Sydney's second CBD, with the new Parramatta Light Rail, the Powerhouse Parramatta arts precinct, and a skyline that grows every year. Church Street remains the beating heart of local business — from long-standing family restaurants to new cafes and boutiques. But as national chains move in and competition intensifies, local operators need more than foot traffic. A strong digital presence helps Parramatta businesses compete on Google, attract customers from surrounding suburbs, and build the kind of reputation that keeps people coming back.",
    localPoints: [
      "Sydney's second CBD with major commercial and residential growth",
      "Church Street dining and retail strip with intense local competition",
      "New Parramatta Metro station bringing thousands of daily commuters",
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
    metaTitle: "Websites & Digital Marketing for Blacktown Businesses | Dorza",
    metaDescription:
      "Dorza builds professional websites and runs digital marketing for Blacktown businesses. Reach 400,000+ residents across Australia's most populated local government area.",
    eyebrow: "// Blacktown",
    title: "Websites and digital marketing for Blacktown businesses",
    description:
      "Blacktown is Australia's most populated local government area with over 400,000 residents. We help local businesses tap into that massive audience with websites, Google profiles, and social media that actually get results.",
    localContext:
      "The City of Blacktown is the most populated local government area in Australia, home to more than 400,000 people across a diverse, multicultural community. From the bustling Blacktown Markets on Sundays to the shops lining Main Street and the surrounding retail centres, small businesses are everywhere — but many still rely on word of mouth alone. With such a large and growing population, the opportunity for businesses to reach new customers online is enormous. A professional website and Google presence can connect a Blacktown business with thousands of nearby residents searching for exactly what they offer.",
    localPoints: [
      "Australia's most populated LGA with over 400,000 residents",
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
    metaTitle: "Web Design & Marketing for Penrith Small Businesses | Dorza",
    metaDescription:
      "Professional web design, local SEO and social media for Penrith businesses. Reach customers across the gateway to the Blue Mountains and the new Western Sydney Airport corridor.",
    eyebrow: "// Penrith",
    title: "Web design and marketing for Penrith small businesses",
    description:
      "Penrith sits at the gateway to the Blue Mountains and the doorstep of the new Western Sydney Airport. We help local businesses get online and get found — from High Street shops to Panthers precinct services.",
    localContext:
      "Penrith is undergoing one of the biggest transformations in Sydney's history. The new Western Sydney International Airport at Badgerys Creek is set to reshape the entire region, bringing jobs, infrastructure and a wave of new residents. High Street remains the commercial spine of the city, while the Panthers precinct has grown into a major entertainment and dining destination. For Penrith businesses, the next few years represent a once-in-a-generation opportunity — but only if potential customers can find them online. A professional website and strong local SEO ensure that when someone searches for a service in Penrith, your business is the one they call.",
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
    metaTitle: "Websites & Digital Marketing for Liverpool Businesses | Dorza",
    metaDescription:
      "Dorza builds professional websites and manages digital marketing for Liverpool businesses. Reach one of Sydney's youngest and fastest-growing populations.",
    eyebrow: "// Liverpool",
    title: "Websites and digital marketing for Liverpool businesses",
    description:
      "Liverpool is a major commercial hub in south-west Sydney with one of the youngest populations in the metro area. We help local businesses get a website, show up on Google and connect with the community.",
    localContext:
      "Liverpool is one of south-west Sydney's most important commercial centres, anchored by Westfield Liverpool, Liverpool Hospital — one of the busiest in NSW — and a growing CBD that attracts professionals, families and students alike. The area has one of the youngest median ages in Greater Sydney, which means a digitally native customer base that expects to find businesses online before they visit in person. From medical practices near the hospital to food outlets along Macquarie Street and trade services across the surrounding suburbs, Liverpool businesses that invest in their online presence reach customers that word of mouth alone cannot.",
    localPoints: [
      "Major south-west Sydney commercial hub with a growing CBD",
      "One of the youngest median populations in Greater Sydney",
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
    metaTitle: "Web Design & Marketing for Campbelltown Businesses | Dorza",
    metaDescription:
      "Professional web design, local SEO and Google Business Profile for Campbelltown businesses. Reach customers across one of Sydney's fastest-growing corridors.",
    eyebrow: "// Campbelltown",
    title: "Web design and marketing for Campbelltown businesses",
    description:
      "Campbelltown is one of Sydney's fastest-growing areas, anchored by a major university campus and a thriving local economy. We help Campbelltown businesses build a professional web presence and attract more local customers.",
    localContext:
      "Campbelltown has evolved from a satellite town into one of Sydney's most dynamic growth corridors. The Western Sydney University campus brings a steady flow of students, the Queen Street mall remains the heart of local retail, and Macarthur Square draws shoppers from across the Macarthur region. With significant residential development in suburbs like Oran Park, Gregory Hills and Leppington, the local customer base is expanding rapidly. For businesses in Campbelltown, being online is no longer a nice-to-have — it is essential to capturing the attention of new residents and competing with the chains that are moving into the area.",
    localPoints: [
      "One of Sydney's fastest-growing corridors with rapid residential development",
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
