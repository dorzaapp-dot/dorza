"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";

const links = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const CTA_LABEL = "Get your free consultation";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function openEnquiry() {
    setOpen(false);
    setEnquiryOpen(true);
  }

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-dorza ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-border/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-layout mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="/"
            className="font-display text-[28px] leading-none text-dark"
            aria-label="Dorza home"
          >
            d<span className="text-primary">o</span>rza
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-text-secondary hover:text-dark font-medium text-sm transition-colors duration-300 ease-dorza py-1"
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-dark transition-transform duration-300 ease-dorza group-hover:scale-x-100"
                />
              </a>
            ))}
            <button
              type="button"
              onClick={openEnquiry}
              className="inline-flex items-center justify-center h-12 px-5 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {CTA_LABEL}
            </button>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 text-dark rounded-sm focus-visible:ring-2 focus-visible:ring-primary relative z-50"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={shouldReduce ? { opacity: 0 } : { y: "-100%" }}
            animate={shouldReduce ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.5, ease: DORZA_EASE }}
            className="md:hidden fixed inset-0 z-40 bg-white flex flex-col px-6 pt-24 pb-10"
          >
            <motion.nav
              aria-label="Mobile navigation"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: shouldReduce ? 0 : 0.08,
                    delayChildren: shouldReduce ? 0 : 0.2,
                  },
                },
              }}
            >
              {links.map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: shouldReduce ? {} : { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: DORZA_EASE },
                    },
                  }}
                  className="flex items-center py-5 text-[24px] font-body font-semibold tracking-[-0.01em] text-dark border-b border-border"
                >
                  {l.label}
                </motion.a>
              ))}
            </motion.nav>
            <motion.button
              type="button"
              onClick={openEnquiry}
              initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: DORZA_EASE }}
              className="inline-flex items-center justify-center h-12 px-5 mt-8 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors"
            >
              {CTA_LABEL}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
