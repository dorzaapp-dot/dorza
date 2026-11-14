import Link from "next/link";

import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import InnerHero from "@/components/sections/InnerHero";
import PageCTA from "@/components/sections/PageCTA";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { LinkLabel } from "@/components/ui/LinkLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { PILLARS } from "@/lib/data/pillars";
import { routableHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

/*
 * Every service on one page, grouped by pillar, straight from lib/data/pillars.ts, so a
 * service's Live or Ask us tag here always matches the pillar page. It's also the
 * "Services" step in every service page's breadcrumb.
 */
export const metadata = pageMetadata({
  title: "Small business tech services",
  description:
    "Every service Dorza sets up for Australian small businesses: websites, Google, bookings, stores, CRMs, ads and email, each marked Live or Ask us.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <InnerHero
          title="Everything we set up, in one place."
          description="Grouped by where your business is up to. Services marked Live we take on now. Ask us about the rest and we'll say plainly whether we're the right people."
          breadcrumbs={[{ label: "Services", href: "/services" }]}
        />

        {PILLARS.map((pillar, i) => (
          <section key={pillar.slug} className={`${i % 2 ? "bg-chalk" : "bg-paper"} py-section-tight md:py-section`}>
            <Container>
              <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
                <Reveal className="md:col-span-5">
                  <h2 className="d-heading">{pillar.headline}</h2>
                  <p className="d-body mt-4 max-w-text">{pillar.lede}</p>
                  <Link href={`/${pillar.slug}`} className="d-link mt-5 inline-block text-[15px]">
                    <LinkLabel label={`More on ${pillar.name}`} href={`/${pillar.slug}`} />
                  </Link>
                </Reveal>

                <Reveal delay={0.09} className="md:col-span-7">
                  <ul className="m-0 list-none p-0">
                    {pillar.services.map((service) => {
                      const href = routableHref(service.href);
                      return (
                        <li key={service.name} className="border-t border-rule-soft py-5 last:border-b">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-body text-[17px] font-semibold text-ink">
                              {href ? (
                                <Link href={href} className="d-link">
                                  {service.name}
                                </Link>
                              ) : (
                                service.name
                              )}
                            </h3>
                            <span className="shrink-0">
                              <StatusTag status={service.status} />
                            </span>
                          </div>
                          <p className="d-body mt-2">{service.blurb}</p>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              </div>
            </Container>
          </section>
        ))}

        <PageCTA />
      </main>
      <Footer />
    </>
  );
}
