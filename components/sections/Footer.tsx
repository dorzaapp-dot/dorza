import Link from "next/link";
import { visibleCaseStudies } from "@/lib/data/work";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/seo";
import { ABN, FOOTER_GROUPS, SOCIALS, TAGLINE } from "@/lib/site";

export default function Footer() {
  const showWork = visibleCaseStudies().length > 0;
  const year = new Date().getFullYear();

  return (
    <footer className="on-inverse border-t border-chalk/10">
      <div className="mx-auto max-w-layout px-6 py-section-tight lg:px-8 md:py-section">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label="Dorza home" className="font-display text-[32px] leading-none text-chalk">
              d<span className="text-ochre">o</span>rza
            </Link>
            <p className="d-lede mt-5 max-w-[22ch]">{TAGLINE}</p>
            <p className="d-mono mt-8">
              <a href={`tel:${PHONE_TEL}`} className="d-link" aria-label={`Call Dorza on ${PHONE_DISPLAY}`}>
                {PHONE_DISPLAY}
              </a>
              <br />
              <a href={`mailto:${CONTACT_EMAIL}`} className="d-link">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className="md:col-span-2 md:first-of-type:col-start-7">
              <p className="d-label">{group.title}</p>
              <ul className="m-0 mt-4 list-none space-y-3 p-0">
                {group.links
                  .filter((l) => l.href !== "/work" || showWork)
                  .map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[15px] text-chalk/80 transition-colors duration-fast ease-dorza hover:text-ochre">
                        {l.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-chalk/20 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="d-label">
            &copy; {year} Dorza &middot; ABN {ABN} &middot; Sydney, Australia
          </p>
          <ul className="m-0 flex list-none gap-6 p-0">
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="d-label transition-colors duration-fast ease-dorza hover:text-ochre" rel="noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
