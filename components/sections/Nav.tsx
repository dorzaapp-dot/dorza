"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";
import ScrollProgress from "@/components/ui/ScrollProgress";

const menuSections = [
  {
    heading: "Services",
    links: [
      { label: "Web Design", href: "/services/web-design" },
      { label: "Social Media", href: "/services/social-media-management" },
      { label: "Google Business", href: "/services/google-business-profile" },
      { label: "Local SEO", href: "/services/local-seo" },
    ],
  },
  {
    heading: "Areas",
    links: [
      { label: "Western Sydney", href: "/areas/western-sydney" },
      { label: "Parramatta", href: "/areas/parramatta" },
      { label: "Blacktown", href: "/areas/blacktown" },
      { label: "Penrith", href: "/areas/penrith" },
      { label: "Liverpool", href: "/areas/liverpool" },
      { label: "Campbelltown", href: "/areas/campbelltown" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Cafes & Restaurants", href: "/industries/cafes-restaurants" },
      { label: "Tradies", href: "/industries/tradies" },
      { label: "Salons & Beauty", href: "/industries/salons-beauty" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
];

const CTA_LABEL = "Get my free audit";

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
      <ScrollProgress />
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

          <div className="hidden md:flex items-center gap-7">
            <a
              href="/#services"
              className="text-sm font-medium text-dark hover:text-primary transition-colors duration-200"
            >
              Services
            </a>
            <a
              href="/areas/western-sydney"
              className="text-sm font-medium text-dark hover:text-primary transition-colors duration-200"
            >
              Areas
            </a>
            <a
              href="/#pricing"
              className="text-sm font-medium text-dark hover:text-primary transition-colors duration-200"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={openEnquiry}
              className="hidden sm:inline-flex items-center justify-center h-12 px-5 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {CTA_LABEL}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 text-dark rounded-sm focus-visible:ring-2 focus-visible:ring-primary relative z-50"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-overlay"
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: DORZA_EASE }}
            className="fixed inset-0 z-40 bg-white overflow-y-auto"
          >
            <div className="max-w-layout mx-auto px-6 lg:px-8 pt-24 pb-16">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: shouldReduce ? 0 : 0.06,
                      delayChildren: shouldReduce ? 0 : 0.15,
                    },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
              >
                {menuSections.map((section) => (
                  <motion.div
                    key={section.heading}
                    variants={{
                      hidden: shouldReduce ? {} : { opacity: 0, y: 24 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: DORZA_EASE },
                      },
                    }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent block mb-4">
                      {section.heading}
                    </span>
                    <ul className="space-y-1">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-[18px] lg:text-[20px] font-body font-semibold tracking-[-0.01em] text-dark hover:text-primary transition-colors duration-200"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: DORZA_EASE }}
                className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <button
                  type="button"
                  onClick={openEnquiry}
                  className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {CTA_LABEL}
                </button>
                <a
                  href="mailto:customer@dorza.com.au"
                  className="text-[14px] text-text-secondary hover:text-dark transition-colors duration-200"
                >
                  customer@dorza.com.au
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
