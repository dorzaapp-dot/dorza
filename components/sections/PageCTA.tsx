"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";

interface PageCTAProps {
  headline?: string;
  description?: string;
}

export default function PageCTA({
  headline = "Ready to grow your business?",
  description = "Tell us about your business. We'll come back with a plan and a price within 72 hours.",
}: PageCTAProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <section className="py-16 md:py-[7.5rem] bg-dark text-white overflow-hidden relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 20% 30%, rgba(212,132,90,0.15), transparent 60%), radial-gradient(700px circle at 80% 70%, rgba(107,143,113,0.10), transparent 60%)",
        }}
      />
      <Container>
        <Reveal>
          <div className="relative max-w-2xl mx-auto text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-6">
              {"// Get started"}
            </p>
            <h2 className="font-display text-[40px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-white mb-5">
              {headline}
            </h2>
            <p className="text-[17px] md:text-[18px] leading-relaxed text-white/60 max-w-lg mx-auto mb-8">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                Get your free consultation
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform duration-300 ease-dorza group-hover:translate-x-1"
                />
              </button>
              <a
                href="/#pricing"
                className="inline-flex items-center justify-center h-12 px-6 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-full hover:bg-white/10 transition-all duration-300 ease-dorza hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                View pricing
              </a>
            </div>
            <p className="mt-6 font-mono text-[10px] text-white/30 uppercase tracking-[0.18em]">
              No lock-in contracts · Response within 72 hours
            </p>
          </div>
        </Reveal>
      </Container>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </section>
  );
}
