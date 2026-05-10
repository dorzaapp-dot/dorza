"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { DORZA_EASE } from "@/components/motion/Reveal";

const MOCKUP_DIR = "/images/mockups";

type Site = {
  key: string;
  name: string;
  url: string;
  tagline: string;
  cta: string;
  bg: string;
  heroOverlay: string;
  heroImg: string;
  cardImgs: [string, string, string];
  accent: string;
  textOnHero: string;
  chip: string;
};

const SITES: Site[] = [
  {
    key: "cafe",
    name: "Cremorne Coffee Co.",
    url: "cremornecoffee.com.au",
    tagline: "Single-origin roasts, made next door.",
    cta: "Order online",
    bg: "#FBF6EE",
    heroOverlay:
      "linear-gradient(135deg, rgba(92,61,46,0.85) 0%, rgba(140,107,79,0.55) 60%, rgba(217,182,140,0.25) 100%)",
    heroImg: `${MOCKUP_DIR}/cafe-hero.jpg`,
    cardImgs: [
      `${MOCKUP_DIR}/cafe-1.jpg`,
      `${MOCKUP_DIR}/cafe-2.jpg`,
      `${MOCKUP_DIR}/cafe-3.jpg`,
    ],
    accent: "#7A9E7E",
    textOnHero: "#FFF7EC",
    chip: "#E9DCC4",
  },
  {
    key: "tradie",
    name: "Sydney Trade Co.",
    url: "sydneytrade.com.au",
    tagline: "Licensed sparkies. On-site in 2 hours.",
    cta: "Get a free quote",
    bg: "#F2F4F8",
    heroOverlay:
      "linear-gradient(135deg, rgba(27,42,74,0.88) 0%, rgba(44,62,102,0.65) 60%, rgba(232,116,42,0.35) 100%)",
    heroImg: `${MOCKUP_DIR}/tradie-hero.jpg`,
    cardImgs: [
      `${MOCKUP_DIR}/tradie-1.jpg`,
      `${MOCKUP_DIR}/tradie-2.jpg`,
      `${MOCKUP_DIR}/tradie-3.jpg`,
    ],
    accent: "#E8742A",
    textOnHero: "#FFFFFF",
    chip: "#D9DEE8",
  },
  {
    key: "salon",
    name: "Bondi Hair Studio",
    url: "bondihair.com.au",
    tagline: "Cuts, colour and balayage by the beach.",
    cta: "Book now",
    bg: "#FBF1F2",
    heroOverlay:
      "linear-gradient(135deg, rgba(232,180,184,0.55) 0%, rgba(216,154,160,0.4) 50%, rgba(196,163,90,0.3) 100%)",
    heroImg: `${MOCKUP_DIR}/salon-hero.jpg`,
    cardImgs: [
      `${MOCKUP_DIR}/salon-1.jpg`,
      `${MOCKUP_DIR}/salon-2.jpg`,
      `${MOCKUP_DIR}/salon-3.jpg`,
    ],
    accent: "#C4A35A",
    textOnHero: "#FFFFFF",
    chip: "#F1D9DC",
  },
];

const CYCLE_MS = 3600;

export default function HeroBrowserMockup() {
  const shouldReduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const site = SITES[index];

  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SITES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [shouldReduce]);

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: DORZA_EASE }}
      className="relative"
      aria-hidden="true"
    >
      <Tilt
        tiltMaxAngleX={4}
        tiltMaxAngleY={5}
        tiltAngleYInitial={-6}
        perspective={1500}
        scale={1}
        transitionSpeed={1800}
        glareEnable={false}
        tiltEnable={!shouldReduce}
        className="rounded-card"
      >
        <div className="rounded-card border border-border overflow-hidden bg-white shadow-card">
          <BrowserChrome url={site.url} />

          <div
            className="relative h-[340px] sm:h-[360px]"
            style={{ background: site.bg }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={site.key}
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: DORZA_EASE }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Mini nav */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-black/5 bg-white">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: site.accent }}
                    />
                    <span className="font-body font-semibold text-[13px] tracking-[-0.01em] text-dark/90">
                      {site.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="h-1.5 w-7 rounded-full"
                      style={{ background: site.chip }}
                    />
                    <span
                      className="h-1.5 w-7 rounded-full"
                      style={{ background: site.chip }}
                    />
                    <span
                      className="h-1.5 w-7 rounded-full"
                      style={{ background: site.chip }}
                    />
                  </div>
                </div>

                {/* Hero block — themed image with gradient overlay */}
                <div
                  className="relative flex-1 flex flex-col justify-end p-5 overflow-hidden"
                  style={{ backgroundColor: site.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={site.heroImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: site.heroOverlay }}
                  />
                  <div className="relative space-y-2">
                    <p
                      className="font-body font-semibold text-[18px] leading-tight tracking-[-0.01em] max-w-[80%]"
                      style={{ color: site.textOnHero }}
                    >
                      {site.tagline}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold"
                        style={{ background: site.accent, color: "#fff" }}
                      >
                        {site.cta}
                      </span>
                      <span
                        className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          color: site.textOnHero,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        Learn more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cards row — themed thumbnails */}
                <div
                  className="grid grid-cols-3 gap-2 p-3"
                  style={{ background: site.bg }}
                >
                  {site.cardImgs.map((src, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-md overflow-hidden"
                      style={{ background: site.chip }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}

function BrowserChrome({ url }: { url: string }) {
  const [typed, setTyped] = useState(url);

  useEffect(() => {
    let cancelled = false;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      if (cancelled) return;
      i += 1;
      setTyped(url.slice(0, i));
      if (i >= url.length) clearInterval(id);
    }, 35);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url]);

  return (
    <div className="bg-surface border-b border-border px-3 py-2.5 flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      <div className="flex-1 mx-3 h-6 bg-white border border-border rounded-full px-3 flex items-center">
        <span className="font-mono text-[11px] text-text-muted truncate">
          {typed}
          <span className="inline-block w-px h-3 bg-text-muted/60 align-middle ml-px animate-pulse-subtle" />
        </span>
      </div>
    </div>
  );
}
