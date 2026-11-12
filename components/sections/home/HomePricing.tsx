import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { CTA_LABEL } from "@/lib/site";

export default function HomePricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-haze py-section-tight md:py-section">
      <Container>
        <Reveal className="max-w-text">
          <h2 className="d-display d-display-md">Priced for your business.</h2>
          <p className="d-lede mt-6">
            Every business is different, so every quote is too. Websites start from $499. You get an exact plan
            and price within 72 hours, and there&rsquo;s no lock-in.
          </p>
          <p className="d-label mt-7 !text-forest">From $499 &middot; Quote within 72 hours &middot; No lock-in</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="#quote" className={buttonClasses("primary", "default")}>
              {CTA_LABEL}
            </Link>
            <Link href="/website-cost" className="d-link text-[15px]">
              What a website costs, and why
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
