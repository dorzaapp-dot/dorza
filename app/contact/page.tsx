"use client";

import { useState } from "react";
import Nav from "@/components/sections/Nav";
import InnerHero from "@/components/sections/InnerHero";
import Footer from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, SITE_URL } from "@/lib/seo";
import { CTA_LABEL } from "@/lib/site";

export default function ContactPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Nav />

      <main id="main">
        <InnerHero
          title="Talk to us."
          description="Call, email or send the form. You'll have a plan and a price within 72 hours."
          breadcrumbs={[{ label: "Contact", href: "/contact" }]}
        />

        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">Reach us directly.</h2>
                <p className="d-body mt-5">Based in Sydney. Working with small businesses across Australia.</p>
                <div className="mt-9">
                  <button type="button" onClick={() => setEnquiryOpen(true)} className={buttonClasses("primary", "lg")}>
                    {CTA_LABEL}
                  </button>
                  <p className="d-label mt-4">Plan and price within 72 hours</p>
                </div>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-6 md:col-start-7">
                <dl className="m-0">
                  <div className="border-t border-rule-soft py-5">
                    <dt className="d-label">Call</dt>
                    <dd className="m-0 mt-2">
                      <a
                        href={`tel:${PHONE_TEL}`}
                        className="d-link inline-block font-mono text-[17px]"
                        aria-label={`Call Dorza on ${PHONE_DISPLAY}`}
                      >
                        {PHONE_DISPLAY}
                      </a>
                    </dd>
                  </div>
                  <div className="border-t border-rule-soft py-5">
                    <dt className="d-label">Email</dt>
                    <dd className="m-0 mt-2">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="d-link inline-block font-mono text-[17px]">
                        {CONTACT_EMAIL}
                      </a>
                    </dd>
                  </div>
                  <div className="border-y border-rule-soft py-5">
                    <dt className="d-label">How we work with you</dt>
                    <dd className="d-body m-0 mt-2">By phone, video and email, wherever you are in Australia.</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>

      <Footer />

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
