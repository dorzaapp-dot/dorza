import { describe, expect, it } from "vitest";
import { NEEDS, needServices, needStatus } from "@/lib/data/needs";
import { PILLARS } from "@/lib/data/pillars";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { isHeadline } from "./helpers/voice";

const allServices = PILLARS.flatMap((p) => p.services);

describe("homepage needs (the 'I need' picker)", () => {
  it("names only services that exist on a pillar page, so the picker can't promise something the site doesn't list", () => {
    for (const need of NEEDS) {
      for (const name of need.services) {
        expect(allServices.some((s) => s.name === name), `${need.slug}: ${name}`).toBe(true);
      }
    }
  });

  it("takes each need's status from the pillar data: live only when every service behind it is live", () => {
    for (const need of NEEDS) {
      const services = needServices(need);
      if (services.length === 0) {
        expect(needStatus(need), need.slug).toBeUndefined();
      } else {
        expect(needStatus(need), need.slug).toBe(services.every((s) => s.status === "live") ? "live" : "ask");
      }
    }
  });

  it("files every enquiry under an option the form already offers", () => {
    for (const need of NEEDS) expect(SERVICE_OPTIONS, need.slug).toContain(need.enquiryOption);
  });

  it("gives each need a unique slug and a Dorza headline", () => {
    expect(new Set(NEEDS.map((n) => n.slug)).size).toBe(NEEDS.length);
    for (const need of NEEDS) {
      expect(need.slug, need.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(isHeadline(need.headline), need.headline).toBe(true);
    }
  });

  it("shows a price only where Dorza has promised one (websites from $499)", () => {
    for (const need of NEEDS) {
      const text = JSON.stringify(need);
      if (need.slug === "website") expect(need.price).toBe("From $499");
      else expect(need.price, need.slug).toBeUndefined();
      expect(text.replace("From $499", ""), need.slug).not.toMatch(/\$\d/);
    }
  });

  it("covers what Mahir asked to lead with: stores, CRMs, web design, SEO and ads", () => {
    const covered = new Set(NEEDS.flatMap((n) => n.services));
    for (const name of ["Online stores", "CRM setup", "Website and hosting", "SEO and content", "Paid ads"]) {
      expect(covered.has(name), name).toBe(true);
    }
  });
});
