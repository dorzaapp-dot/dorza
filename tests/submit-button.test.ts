import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SubmitButton from "@/components/forms/SubmitButton";

const render = (submitting: boolean) =>
  renderToStaticMarkup(createElement(SubmitButton, { submitting, variant: "primary", idleLabel: "Get a quote" }));

describe("enquiry SubmitButton", () => {
  it("shows the label and no spinner while idle", () => {
    const html = render(false);
    expect(html).toContain("Get a quote");
    expect(html).not.toContain("data-spinner");
    expect(html).not.toContain('disabled=""');
    expect(html).toContain('aria-busy="false"');
  });

  it("shows a spinner, locks the button and announces it while sending", () => {
    const html = render(true);
    expect(html).toContain("data-spinner");
    expect(html).toContain("Sending…");
    expect(html).toMatch(/<button[^>]*disabled=""/);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('role="status"');
    expect(html).toContain("Sending your enquiry");
  });

  it("keeps the sending button at full strength so the spinner stays readable", () => {
    expect(render(true)).toContain("disabled:!opacity-100");
    expect(render(false)).not.toContain("disabled:!opacity-100");
  });

  it("stills the spinner for reduced-motion users", () => {
    expect(render(true)).toContain("motion-reduce:animate-none");
  });
});
