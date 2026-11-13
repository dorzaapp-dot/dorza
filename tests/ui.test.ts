import { describe, expect, it } from "vitest";
import { buttonClasses } from "@/components/ui/buttonClasses";

describe("buttonClasses", () => {
  it("uses v7 colours, never the legacy names", () => {
    for (const v of ["primary", "secondary", "ghost", "accent", "inverse"] as const) {
      expect(buttonClasses(v)).not.toMatch(/primary|accent-|bg-dark|bg-white/);
    }
    expect(buttonClasses("primary")).toContain("bg-pine");
    expect(buttonClasses("inverse")).toContain("bg-chalk");
  });

  it("gives every variant exactly one focus colour: claret on light, ochre on forest", () => {
    expect(buttonClasses("primary").match(/focus-visible:outline-(claret|ochre)/g)).toEqual(["focus-visible:outline-claret"]);
    expect(buttonClasses("inverse").match(/focus-visible:outline-(claret|ochre)/g)).toEqual(["focus-visible:outline-ochre"]);
  });

  it("has three sizes at 36, 48 and 56px", () => {
    expect(buttonClasses("primary", "sm")).toContain("h-9");
    expect(buttonClasses("primary", "default")).toContain("h-12");
    expect(buttonClasses("primary", "lg")).toContain("h-14");
  });

  it("appends a caller's classes", () => {
    expect(buttonClasses("primary", "default", "w-full")).toMatch(/w-full$/);
  });
});
