"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";
import {
  SITE_URL,
  CONTACT_EMAIL,
  WESTERN_SYDNEY_SUBURBS,
} from "@/lib/seo";

export default function ContactPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${SITE_URL}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Nav />

      <main>
        <InnerHero
          eyebrow="// Contact"
          title="Let's talk about your business"
          description="No pitch decks, no discovery phases. Tell us what you need and we'll come back with a plan and a price within 72 hours."
          breadcrumbs={[{ label: "Contact", href: "/contact" }]}
        />

        {/* ── Contact details + service areas ── */}
        <section className="py-20 md:py-[7.5rem] bg-warm">
          <Container>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Left — get in touch */}
              <Reveal>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
                    {"// Get in touch"}
                  </p>
                  <h2 className="font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-dark mb-8">
                    Reach out
                  </h2>

                  {/* Email */}
                  <div className="flex items-start gap-3 mb-6">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                      <Mail size={18} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-dark mb-0.5">
                        Email us
                      </p>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-[15px] text-primary hover:underline transition-colors duration-200"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 mb-8">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-dark mb-0.5">
                        Based in
                      </p>
                      <p className="text-[15px] text-text-secondary leading-relaxed">
                        Parramatta, NSW 2150
                        <br />
                        Serving all of Western Sydney
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => setEnquiryOpen(true)}
                    className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Start a conversation
                  </button>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    Response within 72 hours
                  </p>
                </div>
              </Reveal>

              {/* Right — service areas */}
              <Reveal delay={0.15}>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
                    {"// Service areas"}
                  </p>
                  <h2 className="font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-dark mb-8">
                    Areas we serve
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    {WESTERN_SYDNEY_SUBURBS.map((suburb) => (
                      <Link
                        key={suburb.slug}
                        href={`/areas/${suburb.slug}`}
                        className="flex items-center gap-2.5 p-3 bg-white border border-border rounded-card hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza group"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                          <MapPin size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-dark leading-tight truncate">
                            {suburb.name}
                          </p>
                          <p className="font-mono text-[10px] text-text-muted tracking-wide">
                            {suburb.postcode}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── Google Maps embed ── */}
        <section className="py-20 md:py-[7.5rem] bg-white">
          <Container>
            <Reveal>
              <div className="rounded-card border border-border overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26539.34285027529!2d150.98!3d-33.815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a3e3acaee4c1%3A0x5017d681632bfc0!2sParramatta+NSW!5e0!3m2!1sen!2sau!4v1"
                  title="Dorza location — Parramatta, Western Sydney"
                  loading="lazy"
                  width="100%"
                  height="100%"
                  style={{ minHeight: 400, border: 0 }}
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </>
  );
}
