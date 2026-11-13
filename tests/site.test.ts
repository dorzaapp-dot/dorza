import { describe, expect, it } from "vitest";
import { CTA_LABEL, FOOTER_GROUPS, NAV_LINKS, TAGLINE, canonical, cleanTitle, pageMetadata } from "@/lib/site";

describe("cleanTitle", () => {
  it("strips a trailing brand suffix so the layout template adds it once", () => {
    expect(cleanTitle("Web Design for Small Businesses | Dorza")).toBe("Web Design for Small Businesses");
    expect(cleanTitle("Contact us | Dorza | Dorza")).toBe("Contact us");
    expect(cleanTitle("Page not found — Dorza")).toBe("Page not found");
  });

  it("leaves a clean title alone", () => {
    expect(cleanTitle("About Dorza")).toBe("About Dorza");
  });
});

describe("canonical", () => {
  it("builds absolute URLs with no trailing slash", () => {
    expect(canonical("/")).toBe("https://www.dorza.com.au");
    expect(canonical("/work/drivable/")).toBe("https://www.dorza.com.au/work/drivable");
  });
});

describe("pageMetadata", () => {
  it("cleans the title, sets the page's own canonical and a share image", () => {
    const m = pageMetadata({ title: "About | Dorza", description: "d", path: "/about" });
    expect(m.title).toBe("About");
    expect(m.alternates?.canonical).toBe("https://www.dorza.com.au/about");
    expect(JSON.stringify(m.openGraph)).toContain("https://www.dorza.com.au/images/og/default.png");
    expect(JSON.stringify(m.openGraph)).toContain("About | Dorza");
  });

  it("accepts a page-specific share image", () => {
    const m = pageMetadata({ title: "Work", description: "d", path: "/work/drivable", image: "/images/og/drivable.png" });
    expect(JSON.stringify(m.twitter)).toContain("https://www.dorza.com.au/images/og/drivable.png");
  });
});

describe("navigation", () => {
  it("leads with the three pillars in the order a client meets them", () => {
    expect(NAV_LINKS.slice(0, 3).map((l) => l.href)).toEqual(["/start", "/grow", "/support"]);
  });

  it("keeps the local layer out of the main nav but linked from the footer", () => {
    expect(NAV_LINKS.some((l) => l.href.startsWith("/areas"))).toBe(false);
    const footerHrefs = FOOTER_GROUPS.flatMap((g) => g.links.map((l) => l.href));
    expect(footerHrefs).toContain("/areas");
    expect(footerHrefs).toContain("/privacy");
  });

  it("uses the approved tagline and action", () => {
    expect(TAGLINE).toBe("You run the business. We'll mind the tech.");
    expect(CTA_LABEL).toBe("Get a quote");
  });
});
