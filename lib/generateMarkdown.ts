import type { OnboardState } from "./types";

/**
 * Emits an agent-consumable intake document in three layers:
 *   1. YAML frontmatter — typed keys for skills/agents that parse before reading
 *   2. Stable kebab-case sections — predictable anchors (## business, ## site, ...)
 *   3. ## machine — full state as fenced JSON for direct programmatic consumption
 *
 * Bumping the schema is a breaking change for downstream agents — update
 * SCHEMA_VERSION and add a migration note in CLAUDE.md.
 */
const SCHEMA_VERSION = "dorza-intake.v1";

type BuildHint = {
  fontPair: string;
  primary: string;
  accent: string;
};

const BUILD_HINTS: Record<string, BuildHint> = {
  Tradie: { fontPair: "Inter + Cabinet Grotesk", primary: "#1B2A4A", accent: "#E8742A" },
  "Cafe/Restaurant": { fontPair: "DM Sans + Fraunces", primary: "#5C3D2E", accent: "#7A9E7E" },
  "Salon/Beauty": { fontPair: "Outfit + Playfair Display", primary: "#E8B4B8", accent: "#C4A35A" },
  "Fitness/Wellness": { fontPair: "Space Grotesk + Syne", primary: "#1A1A1A", accent: "#A8D83A" },
  Retail: { fontPair: "DM Sans + Fraunces", primary: "#2D2D2D", accent: "#E8745A" },
  "Professional Services": { fontPair: "Inter + Newsreader", primary: "#1A2744", accent: "#2A9D8F" },
  Other: { fontPair: "Inter + Newsreader", primary: "#1A1A2E", accent: "#D4845A" },
};

const SECTION_SLUGS: Record<string, string> = {
  Hero: "hero",
  "Services/menu": "services-menu",
  "About us": "about-us",
  "Photo gallery": "photo-gallery",
  "Contact form": "contact-form",
  "Google Map": "google-map",
  Testimonials: "testimonials",
  "Online booking": "online-booking",
  "Social feed embed": "social-feed-embed",
  FAQ: "faq",
  "Blog future": "blog",
  "E-commerce": "ecommerce",
};

function yq(v: unknown): string {
  if (v === null || v === undefined || v === "") return '""';
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  const s = String(v)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, "\\n");
  return `"${s}"`;
}

function yamlList(key: string, items: string[], indent = ""): string {
  if (!items.length) return `${indent}${key}: []`;
  const lines = items.map((i) => `${indent}  - ${yq(i)}`);
  return `${indent}${key}:\n${lines.join("\n")}`;
}

function selectedSections(s: OnboardState): string[] {
  return Object.entries(s.websiteSections || {})
    .filter(([, on]) => on)
    .map(([id]) => SECTION_SLUGS[id] || id.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
}

function deriveTags(s: OnboardState): string[] {
  const tags = new Set<string>();
  const type = s.businessType === "Other" ? s.customBusinessType : s.businessType;
  if (type) tags.add(type.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  if (s.suburb) tags.add("local-business");
  if (s.serviceArea && /sydney|nsw|sutherland|inner west|eastern|north shore/i.test(s.serviceArea)) {
    tags.add("sydney");
  }
  if (s.websiteSections?.["E-commerce"]) tags.add("ecommerce");
  if (s.websiteSections?.["Online booking"]) tags.add("booking");
  tags.add("mobile-first");
  return Array.from(tags);
}

function deriveSummary(s: OnboardState): string {
  const type = s.businessType === "Other" ? s.customBusinessType : s.businessType;
  const where = [s.suburb, s.serviceArea].filter(Boolean).join(", ");
  const who = s.typicalCustomer ? ` serving ${s.typicalCustomer.toLowerCase()}` : "";
  const diff = s.differentiator ? ` Differentiator: ${s.differentiator}` : "";
  const tone = s.tone ? ` Tone: ${s.tone.toLowerCase()}.` : "";
  return [
    `${s.businessName || "Unnamed business"}${type ? ` is a ${type.toLowerCase()}` : ""}${where ? ` in ${where}` : ""}${who}.`,
    diff,
    tone,
  ]
    .join("")
    .trim();
}

function frontmatter(s: OnboardState, today: string): string {
  const type = s.businessType === "Other" ? s.customBusinessType : s.businessType;
  const sectionsOn = selectedSections(s);
  const lines = [
    "---",
    `schema: ${SCHEMA_VERSION}`,
    `generated_at: ${today}`,
    `business_name: ${yq(s.businessName)}`,
    `business_type: ${yq(type)}`,
    `niche: ${yq(s.niche)}`,
    `suburb: ${yq(s.suburb)}`,
    `service_area: ${yq(s.serviceArea)}`,
    `phone: ${yq(s.phone)}`,
    `email: ${yq(s.email)}`,
    `existing_website: ${yq(s.existingWebsite)}`,
    `tone: ${yq(s.tone)}`,
    `brand_keywords: ${yq(s.brandKeywords)}`,
    `brand_colours: ${yq(s.brandColours)}`,
    `has_logo: ${yq(s.hasLogo)}`,
    yamlList("website_sections", sectionsOn),
    yamlList("discovery_channels", s.discoveryChannels || []),
    `success_vision: ${yq(s.successVision)}`,
    yamlList("tags", deriveTags(s)),
    "---",
  ];
  return lines.join("\n");
}

function kvTable(rows: [string, string | undefined | null][]): string {
  const filled = rows.map(([k, v]) => [k, v && String(v).trim() ? String(v) : "—"] as const);
  return [
    "| Field | Value |",
    "|-------|-------|",
    ...filled.map(([k, v]) => `| ${k} | ${v.replace(/\|/g, "\\|")} |`),
  ].join("\n");
}

function bodyBusiness(s: OnboardState): string {
  const type = s.businessType === "Other" ? s.customBusinessType : s.businessType;
  return kvTable([
    ["business_name", s.businessName],
    ["owner_name", s.ownerName],
    ["business_type", type],
    ["niche", s.niche],
    ["abn", s.abn],
    ["street_address", s.streetAddress],
    ["suburb", s.suburb],
    ["phone", s.phone],
    ["email", s.email],
    ["opening_hours", s.openingHours],
  ]);
}

function bodyDigital(s: OnboardState): string {
  return kvTable([
    ["existing_website", s.existingWebsite],
    ["google_business", s.googleBusiness],
    ["instagram", s.instagramHandle],
    ["facebook", s.facebookPage],
    ["other_platforms", s.otherPlatforms],
    ["biggest_frustration", s.biggestFrustration],
  ]);
}

function bodyServices(s: OnboardState): string {
  const list =
    s.services.filter((x) => x.trim()).map((svc, i) => `${i + 1}. ${svc}`).join("\n") || "_None listed._";
  return [
    list,
    "",
    `**Differentiator:** ${s.differentiator || "—"}`,
    `**Starting price:** ${s.priceRange || "—"}`,
  ].join("\n");
}

function bodyCustomers(s: OnboardState): string {
  return kvTable([
    ["typical_customer", s.typicalCustomer],
    ["service_area", s.serviceArea],
    ["discovery_channels", s.discoveryChannels.join(", ")],
  ]);
}

function bodyBrand(s: OnboardState): string {
  return kvTable([
    ["has_logo", s.hasLogo],
    ["brand_colours", s.brandColours],
    ["tone", s.tone],
    ["brand_keywords", s.brandKeywords],
    ["inspiration_sites", s.inspirationSites],
  ]);
}

function bodyAssets(s: OnboardState): string {
  return [
    kvTable([
      ["logo_status", s.logoStatus],
      ["photos_status", s.photosStatus],
      ["menu_doc_status", s.menuDocStatus],
      ["testimonials_status", s.testimonialsStatus],
      ["photo_notes", s.photoNotes],
    ]),
    "",
    s.specificTestimonials
      ? `**Testimonials provided:**\n\n> ${s.specificTestimonials.replace(/\n/g, "\n> ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function bodySite(s: OnboardState): string {
  const sections = s.websiteSections || {};
  const checklist = Object.entries(sections)
    .map(([key, val]) => `- [${val ? "x" : " "}] ${key}`)
    .join("\n");
  const extras: string[] = [];
  if (sections["Online booking"]) extras.push(`**Booking link:** ${s.bookingLink || "—"}`);
  if (sections["E-commerce"]) extras.push(`**E-commerce platform:** ${s.ecommercePlatform || "—"}`);

  return [
    "**Sections requested:**",
    "",
    checklist || "_None._",
    "",
    extras.join("\n\n"),
    "",
    "**Other requests:**",
    "",
    s.otherSections || "_None._",
    "",
    "**Site vision (look & feel):**",
    "",
    s.siteVisionDescription || "_Not provided — fall back to brand keywords + tone._",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function bodySuccess(s: OnboardState): string {
  return s.successVision
    ? `> ${s.successVision.replace(/\n/g, "\n> ")}`
    : "_Not stated — interview client before setting KPIs._";
}

function bodyBuildHints(s: OnboardState): string {
  const type = s.businessType || "Other";
  const hint = BUILD_HINTS[type] || BUILD_HINTS.Other;
  return [
    "Auto-derived defaults for downstream build agents. Override only with explicit client confirmation.",
    "",
    kvTable([
      ["font_pair", hint.fontPair],
      ["palette_primary", hint.primary],
      ["palette_accent", hint.accent],
      ["client_brand_colours", s.brandColours || "—"],
      ["lighthouse_performance", "≥ 90"],
      ["lighthouse_accessibility", "≥ 95"],
      ["lighthouse_seo", "≥ 95"],
      ["mobile_breakpoint", "375px"],
      ["phone_links", "tel: required on every phone number"],
      ["maps_embed", "Google Maps embed on contact section"],
      ["required_outputs", "sitemap.xml, robots.txt, JSON-LD LocalBusiness"],
    ]),
  ].join("\n");
}

function bodyAgentBriefs(s: OnboardState): string {
  const name = s.businessName || "this business";
  const type = (s.businessType === "Other" ? s.customBusinessType : s.businessType) || "small business";
  const area = s.serviceArea || s.suburb || "their service area";
  const sectionsList = selectedSections(s).join(", ") || "(none toggled — confirm with client)";
  const tone = s.tone || "(unset — read brand_keywords)";
  const kw = s.brandKeywords || "(unset)";
  const diff = s.differentiator || "(unset — interview client before writing copy)";
  const channels = s.discoveryChannels.join(", ") || "(unknown)";
  const vision = s.siteVisionDescription || "(see brand_keywords + tone above)";
  const other = s.otherSections || "(none)";
  const success = s.successVision || "(not stated — interview client before setting KPIs)";

  return [
    "Pre-formed prompts ready to paste into a fresh Claude session. Each is self-contained and references frontmatter keys above.",
    "",
    "### site_build",
    "",
    "Compatible skills: `/ui-ux-pro-max`, `/design-review`, `/site-teardown`.",
    "",
    "```",
    `Build a customer website for ${name}, a ${type} in ${area}.`,
    "",
    `Source of truth: this intake.md — frontmatter + the \`## site\`, \`## brand\`, \`## services\`, \`## customers\` sections. Do not invent details.`,
    "",
    `Sections to build (toggled on): ${sectionsList}.`,
    `Other requests: ${other}.`,
    `Site vision: ${vision}.`,
    `Tone: ${tone}. Brand words: ${kw}.`,
    `Differentiator to lead with: ${diff}.`,
    `Optimise the site for the client's stated success vision: ${success}.`,
    "",
    "Apply the defaults in `## build_hints` (font pair, palette, Lighthouse targets, mobile breakpoint, required SEO outputs, tel: links, Maps embed).",
    "",
    "Deliverables: a deployable static site repo with this intake.md at the root, sitemap.xml, robots.txt, JSON-LD LocalBusiness schema, mobile-tested at 375px.",
    "```",
    "",
    "### seo_content",
    "",
    "```",
    `You are the SEO + content agent for ${name}.`,
    "",
    `Source of truth: frontmatter + \`## services\`, \`## customers\`, \`## brand\`, \`## success\` in this intake.md.`,
    "",
    "First-sprint deliverables:",
    `1. 10 primary keywords for ${type} in ${area}, ranked by intent (transactional > navigational > informational). Bias the ranking toward queries that drive the client's success vision: ${success}.`,
    "2. Meta titles + descriptions for: home, services overview, each individual service, about, contact.",
    `3. 5 article ideas matching the tone "${tone}" and questions a ${type} customer would Google before buying.`,
    "4. Local SEO checklist: Google Business Profile copy, suggested categories, 8–10 FAQ pairs.",
    "```",
    "",
    "### competitor_research",
    "",
    "```",
    `Identify 5–8 direct competitors of ${name} (a ${type}) in ${area}.`,
    "",
    "For each, return: name, website, positioning sentence, services, visible price signal, key differentiators, what they do well, what they miss.",
    "",
    `End with a one-page brief titled "How ${name} should position to win" — informed by this stated differentiator: "${diff}", current discovery channels (${channels}), and the client's success vision: ${success}.`,
    "",
    "Flag any obvious gaps the client should fill (no Google Business listing, no reviews, no booking, etc.).",
    "```",
    "",
    "### success_planning",
    "",
    "```",
    `You are the growth strategist for ${name}, a ${type} in ${area}.`,
    "",
    `The client's stated definition of success is: ${success}`,
    "",
    "Source of truth: full intake.md — read frontmatter + every body section.",
    "",
    "Deliverables:",
    "1. Translate the success vision into 2–4 measurable KPIs with target values and a 90-day deadline (e.g. \"30 booking enquiries/month by day 90\").",
    "2. The leading indicators for each KPI (the metric we'd watch weekly to know we're on track).",
    "3. A 90-day plan in 30-day blocks: what site changes, content pieces, SEO actions, social posts, and outreach should happen, and which KPI each one moves.",
    "4. A risk list: what could prevent these KPIs being hit, and the mitigation for each.",
    "5. A weekly check-in template the client can read in under 60 seconds.",
    "",
    "Use the tone, differentiator, and brand keywords from intake.md when phrasing anything client-facing. Don't invent metrics the client didn't imply — if the success vision is qualitative, propose KPIs that proxy it and flag the assumption.",
    "```",
  ].join("\n");
}

function bodyMachine(s: OnboardState, today: string): string {
  const snapshot = {
    schema: SCHEMA_VERSION,
    generated_at: today,
    state: s,
  };
  return ["```json", JSON.stringify(snapshot, null, 2), "```"].join("\n");
}

export function generateMarkdown(s: OnboardState): string {
  const today = new Date().toISOString().split("T")[0];
  const heading = `# Dorza Intake — ${s.businessName || "Untitled"}`;
  const meta = `_Generated ${today}. Schema \`${SCHEMA_VERSION}\`. Source: customer onboarding form._`;

  return [
    frontmatter(s, today),
    "",
    heading,
    "",
    meta,
    "",
    "## summary",
    "",
    deriveSummary(s),
    "",
    "## business",
    "",
    bodyBusiness(s),
    "",
    "## digital",
    "",
    bodyDigital(s),
    "",
    "## services",
    "",
    bodyServices(s),
    "",
    "## customers",
    "",
    bodyCustomers(s),
    "",
    "## brand",
    "",
    bodyBrand(s),
    "",
    "## assets",
    "",
    bodyAssets(s),
    "",
    "## site",
    "",
    bodySite(s),
    "",
    "## success",
    "",
    bodySuccess(s),
    "",
    "## notes",
    "",
    s.notes || "_None._",
    "",
    "## build_hints",
    "",
    bodyBuildHints(s),
    "",
    "## agent_briefs",
    "",
    bodyAgentBriefs(s),
    "",
    "## machine",
    "",
    bodyMachine(s, today),
  ].join("\n");
}
