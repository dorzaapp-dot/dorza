import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const whatYouGet = [
  "Where you rank on Google & Maps vs nearby competitors",
  "Your Google Business Profile — what's missing",
  "Your website — mobile, speed, and whether it's converting",
  "A prioritised list: what's losing you customers, and what we'd fix first",
];

const howItWorks = [
  { num: "01", title: "Tell us your business" },
  { num: "02", title: "We audit your online presence" },
  { num: "03", title: "You get your breakdown within 72 hours" },
];

export default function FreeAudit() {
  return (
    <section id="free-audit" className="scroll-mt-24 py-16 md:py-[7.5rem] bg-white">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
              {"// Free audit"}
            </p>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark">
              See exactly where you&apos;re losing customers online — free.
            </h2>
            <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              We&apos;ll check how your business shows up on Google, Maps, and
              social against your local competitors — then send you a
              plain-English breakdown of what&apos;s costing you customers and
              what to fix first.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// What you get"}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {whatYouGet.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[15px] leading-relaxed text-text-secondary"
                >
                  <Check size={16} className="text-accent mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// How it works"}
            </p>
            <ol className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((step) => (
                <li
                  key={step.num}
                  className="rounded-card border border-border bg-white p-6"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    {step.num}
                  </span>
                  <p className="mt-3 font-body font-semibold text-[18px] leading-snug tracking-[-0.01em] text-dark">
                    {step.title}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Get my free audit →
            </a>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-text-secondary">
              Free for the first 20 Western Sydney businesses. No pitch, no
              pressure — keep the report whether you work with us or not.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
