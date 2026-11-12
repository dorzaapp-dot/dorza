"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryFormFields from "@/components/forms/EnquiryFormFields";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { useEnquirySubmit } from "@/lib/useEnquirySubmit";
import { CTA_LABEL } from "@/lib/site";
import type { EnquiryFormData } from "@/lib/types";

const initialForm: EnquiryFormData = {
  name: "",
  email: "",
  businessType: "",
  suburb: "",
  servicesInterested: [],
  source: "inline",
  website: "",
};

export default function WaitlistCTA() {
  const [form, setForm] = useState<EnquiryFormData>(initialForm);
  const { submitting, submitted, error, submit } = useEnquirySubmit();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit(form);
  }

  return (
    <section id="quote" className="on-inverse scroll-mt-24 py-section-tight md:py-section-large">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Reveal>
            <h2 className="d-display d-display-md mb-5">Tell us where you&rsquo;re up to.</h2>
            <p className="d-lede mx-auto max-w-md">
              A few details is enough. You&rsquo;ll hear back with a plan and a price within 72 hours.
            </p>
          </Reveal>

          <div className="mt-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <Confirmation key="confirm" />
              ) : (
                <motion.form
                  key="form"
                  data-reveal=""
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: DORZA_EASE }}
                  onSubmit={handleSubmit}
                  className="relative space-y-3 text-left"
                >
                  <EnquiryFormFields theme="dark" value={form} onChange={setForm} />

                  <div className="relative pt-2">
                    <button type="submit" disabled={submitting} className={buttonClasses("inverse", "default", "w-full")}>
                      {submitting ? "Sending…" : CTA_LABEL}
                    </button>
                  </div>

                  {error && (
                    <p role="alert" className="pt-1 text-center font-body text-[13px] text-ochre">
                      {error}
                    </p>
                  )}

                  <p className="d-label mt-3 text-center">No spam &middot; No lock-in &middot; No obligation</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Confirmation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: DORZA_EASE }}
      className="rounded-card border border-chalk/20 bg-chalk/5 p-10 text-center"
    >
      <p className="d-label mb-3">Got it</p>
      <h3 className="d-heading mb-2">Thanks. We&rsquo;ve got your details.</h3>
      <p className="d-body mx-auto">You&rsquo;ll hear from us within 72 hours.</p>
    </motion.div>
  );
}
