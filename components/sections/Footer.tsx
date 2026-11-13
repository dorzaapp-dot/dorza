import Link from "next/link";
import { LinkLabel } from "@/components/ui/LinkLabel";
import { hasPublicWork } from "@/lib/data/workStatus";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/seo";
import { ABN, FOOTER_GROUPS, SOCIALS, TAGLINE } from "@/lib/site";

export default function Footer() {
  const showWork = hasPublicWork();
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
            <div className="d-mono mt-6">
              <a href={`tel:${PHONE_TEL}`} className="d-link flex w-fit min-h-11 items-center" aria-label={`Call Dorza on ${PHONE_DISPLAY}`}>
                {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="d-link flex w-fit min-h-11 items-center">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className="md:col-span-2 md:first-of-type:col-start-7">
              <p className="d-label">{group.title}</p>
              <ul className="m-0 mt-2 list-none p-0">
                {group.links
                  .filter((l) => l.href !== "/work" || showWork)
                  .map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-11 items-center text-[15px] text-chalk/80 transition-colors duration-fast ease-dorza hover:text-ochre">
                        <LinkLabel label={l.label} href={l.href} />
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
                <a href={s.href} className="d-label inline-flex min-h-11 items-center transition-colors duration-fast ease-dorza hover:text-ochre" rel="noopener noreferrer" target="_blank">
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
