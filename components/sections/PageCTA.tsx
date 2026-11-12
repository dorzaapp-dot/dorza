"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/seo";
import { CTA_LABEL } from "@/lib/site";

interface PageCTAProps {
  headline?: string;
  description?: string;
}

export default function PageCTA({
  headline = "Tell us where you’re up to.",
  description = "Tell us about your business. We'll come back with a plan and a price within 72 hours.",
}: PageCTAProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <section className="on-inverse py-section-tight md:py-section">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="d-display d-display-md">{headline}</h2>
            <p className="d-lede mx-auto mt-5 max-w-lg">{description}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-x-7 gap-y-4 sm:flex-row">
              <button type="button" onClick={() => setEnquiryOpen(true)} className={buttonClasses("inverse", "lg")}>
                {CTA_LABEL}
              </button>
              <a href="/#pricing" className="d-link text-[15px]">
                See pricing
              </a>
            </div>
            <p className="d-body mx-auto mt-7">
              {"Prefer to talk? "}
              <a href={`tel:${PHONE_TEL}`} className="d-link font-mono text-[14px]" aria-label={`Call Dorza on ${PHONE_DISPLAY}`}>
                {PHONE_DISPLAY}
              </a>
            </p>
            <p className="d-label mt-4">No lock-in &middot; Quote within 72 hours</p>
          </div>
        </Reveal>
      </Container>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </section>
  );
}
