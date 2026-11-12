"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { DORZA_EASE } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { visibleCaseStudies } from "@/lib/data/work";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/seo";
import { CTA_LABEL, NAV_LINKS } from "@/lib/site";

/** "Work" appears only once a case study is public. */
const links = NAV_LINKS.filter((l) => l.href !== "/work" || visibleCaseStudies().length > 0);

export default function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule-soft bg-chalk/[0.94] backdrop-blur-[8px]">
        <div className="mx-auto flex h-[68px] max-w-layout items-center justify-between px-6 lg:px-8">
          <Link href="/" aria-label="Dorza home" className="font-display text-[28px] leading-none text-forest">
            d<span className="text-claret">o</span>rza
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 min-[860px]:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-fast ease-dorza",
                  isActive(l.href)
                    ? "text-forest underline decoration-pine decoration-[1.5px] underline-offset-[6px]"
                    : "text-ink-soft hover:text-forest"
                )}
              >
                {l.label}
              </Link>
            ))}
            <button type="button" onClick={() => setEnquiryOpen(true)} className={buttonClasses("primary", "sm")}>
              {CTA_LABEL}
            </button>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-forest min-[860px]:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[68px] z-30 overflow-y-auto bg-chalk px-6 pb-10 pt-8 min-[860px]:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: DORZA_EASE }}
          >
            <nav aria-label="Mobile">
              <ul className="m-0 list-none p-0">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    className="border-b border-rule-soft"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.045 * i, ease: DORZA_EASE }}
                  >
                    <Link href={l.href} className="block py-4 font-display text-[32px] leading-none text-forest">
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setEnquiryOpen(true);
              }}
              className={buttonClasses("primary", "lg", "mt-8 w-full")}
            >
              {CTA_LABEL}
            </button>
            <a href={`tel:${PHONE_TEL}`} className="d-mono mt-6 block text-center" aria-label={`Call Dorza on ${PHONE_DISPLAY}`}>
              {PHONE_DISPLAY}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
