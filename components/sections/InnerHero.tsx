import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HeroRise } from "@/components/motion/HeroRise";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface InnerHeroProps {
  /** Kept so existing callers compile. Never rendered: brand pages carry no eyebrow label. */
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function InnerHero({ title, description, breadcrumbs }: InnerHeroProps) {
  return (
    <section className="bg-chalk pb-12 pt-section-tight md:pb-16 md:pt-section">
      <Container>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="d-label m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
              <li>
                <Link href="/" className="-my-3 inline-block py-3 transition-colors duration-fast ease-dorza hover:text-forest">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={`${crumb.href}-${i}`} className="flex items-center gap-1.5">
                  <span aria-hidden>/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-ink-soft">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="-my-3 inline-block py-3 transition-colors duration-fast ease-dorza hover:text-forest">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <HeroRise>
          <h1 className="d-display d-display-md max-w-[18ch]">{title}</h1>
          <p className="d-lede mt-6 max-w-text">{description}</p>
        </HeroRise>
      </Container>
    </section>
  );
}
