"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryFormFields from "@/components/forms/EnquiryFormFields";
import { useEnquirySubmit } from "@/lib/useEnquirySubmit";
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
    <section
      id="waitlist"
      className="scroll-mt-24 relative py-16 md:py-[10rem] bg-dark text-white overflow-hidden"
    >
      {/* Radial spotlights */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 15% 20%, rgba(212,132,90,0.18), transparent 60%), radial-gradient(800px circle at 85% 80%, rgba(107,143,113,0.12), transparent 60%)",
        }}
      />

      <Container>
        <div className="relative max-w-xl mx-auto text-center">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-6">
              {"// Free audit · Sydney founding clients"}
            </p>
            <h2 className="font-display text-[44px] md:text-[76px] leading-[1.02] tracking-[-0.025em] text-white mb-5">
              Ready to stop being invisible online?
            </h2>
            <p className="text-[17px] md:text-[18px] leading-relaxed tracking-[-0.01em] text-white/60 max-w-md mx-auto">
              First 20 Western Sydney businesses. 50% off your build. Real human
              follow-up in 72 hours.
            </p>
          </Reveal>

          <div className="mt-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <Confirmation key="confirm" />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: DORZA_EASE }}
                  onSubmit={handleSubmit}
                  className="text-left space-y-3 relative"
                >
                  <EnquiryFormFields theme="dark" value={form} onChange={setForm} />

                  <div className="relative pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="relative w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                    >
                      {submitting ? "Submitting…" : "Get my free audit →"}
                    </button>
                  </div>

                  {error && (
                    <p role="alert" className="text-center text-[13px] text-primary-light font-body pt-1">
                      {error}
                    </p>
                  )}

                  <p className="text-center font-mono text-[10px] text-white/45 uppercase tracking-[0.18em] mt-3">
                    No spam · No lock-in · No obligation
                  </p>
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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: DORZA_EASE }}
      className="rounded-card border border-white/10 bg-white/[0.03] p-10 text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-light mb-3">
        Audit on the way
      </p>
      <h3 className="font-body font-semibold text-[26px] md:text-[30px] tracking-[-0.02em] text-white mb-2">
        Thanks &mdash; we&rsquo;ve got your details.
      </h3>
      <p className="text-white/60 text-[15px] leading-relaxed">
        A real Sydney human from Dorza will reach out within 72 hours.
      </p>
    </motion.div>
  );
}
