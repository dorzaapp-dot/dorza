"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface InnerHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function InnerHero({ eyebrow, title, description, breadcrumbs }: InnerHeroProps) {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-white overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 40%, rgba(212,132,90,0.06), transparent 70%), radial-gradient(ellipse 50% 60% at 80% 20%, rgba(107,143,113,0.05), transparent 70%)",
        }}
      />
      <Container>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Reveal y={12}>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
                <li>
                  <a href="/" className="hover:text-dark transition-colors duration-200">Home</a>
                </li>
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-1.5">
                    <span aria-hidden className="text-border">/</span>
                    {i === breadcrumbs.length - 1 ? (
                      <span className="text-text-secondary">{crumb.label}</span>
                    ) : (
                      <a href={crumb.href} className="hover:text-dark transition-colors duration-200">
                        {crumb.label}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <Reveal>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {eyebrow}
            </p>
            <h1 className="font-display text-[40px] sm:text-[52px] md:text-[68px] leading-[1.02] tracking-[-0.025em] text-dark">
              {title}
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] leading-relaxed tracking-[-0.01em] text-text-secondary max-w-2xl">
              {description}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
