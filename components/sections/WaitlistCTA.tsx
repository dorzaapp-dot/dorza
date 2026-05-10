"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";
import { submitForm } from "@/lib/api";
import type { BusinessType } from "@/lib/types";

const businessTypes: (BusinessType | "Other")[] = [
  "Tradie",
  "Cafe/Restaurant",
  "Salon/Beauty",
  "Fitness/Wellness",
  "Retail",
  "Professional Services",
  "Other",
];

const inputCls =
  "w-full h-12 px-4 rounded-2xl md:rounded-full text-base text-white placeholder-white/40 bg-white/[0.06] border border-white/15 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-dorza hover:bg-white/[0.08]";

const labelCls = "block text-[12px] font-medium text-white/60 mb-1.5 ml-1 uppercase tracking-[0.12em] font-mono";

export default function WaitlistCTA() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessType: "" as BusinessType | "",
    suburb: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await submitForm("/api/waitlist", form);
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section
      id="waitlist"
      className="relative py-16 md:py-[10rem] bg-dark text-white overflow-hidden"
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
              {"// Founding client offer"}
            </p>
            <h2 className="font-display text-[44px] md:text-[76px] leading-[1.02] tracking-[-0.025em] text-white mb-5">
              Ready to stop being invisible online?
            </h2>
            <p className="text-[17px] md:text-[18px] leading-relaxed tracking-[-0.01em] text-white/60 max-w-md mx-auto">
              Join the first 20 founding clients in Sydney and lock in 50% off
              your setup.
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
                  className="text-left space-y-3"
                >
                  <div>
                    <label className={labelCls}>Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@business.com.au"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <label className={labelCls}>Business type</label>
                      <select
                        required
                        value={form.businessType}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            businessType: e.target.value as BusinessType,
                          })
                        }
                        className={`${inputCls} appearance-none pr-10`}
                      >
                        <option value="" className="bg-dark text-white">
                          Select type
                        </option>
                        {businessTypes.map((t) => (
                          <option key={t} value={t} className="bg-dark text-white">
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 bottom-3.5 text-white/40 pointer-events-none"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Suburb</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Surry Hills"
                        value={form.suburb}
                        onChange={(e) =>
                          setForm({ ...form, suburb: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                    >
                      {loading ? "Submitting…" : "Join the waitlist →"}
                    </button>
                  </div>
                  <p className="text-center font-mono text-[10px] text-white/30 uppercase tracking-[0.18em] mt-3">
                    No spam · No lock-in · Cancel any time
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
        You&rsquo;re in
      </p>
      <h3 className="font-body font-semibold text-[26px] md:text-[30px] tracking-[-0.02em] text-white mb-2">
        Welcome to the front of the queue.
      </h3>
      <p className="text-white/60 text-[15px] leading-relaxed">
        Dorza will contact you within 72 hours — from a real Sydney human.
      </p>
    </motion.div>
  );
}
