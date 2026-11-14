import Link from "next/link";
import { NeedPickerEnhance } from "@/components/sections/home/NeedPickerEnhance";
import { PlusList } from "@/components/ui/PlusList";
import { StatusTag } from "@/components/ui/StatusTag";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { NEEDS, needStatus, type Need } from "@/lib/data/needs";
import { CTA_LABEL } from "@/lib/site";

/*
 * The picker is real radio buttons plus CSS :has(), so it works on first paint and with
 * JavaScript off. Browsers without :has() skip the @supports block and show every answer
 * stacked, which still reads fine. Every answer is in the HTML for search engines either way.
 */
const SHOW_SELECTED = NEEDS.map(
  (n) => `.need-picker:has(#need-${n.slug}:checked) [data-need-panel="${n.slug}"]`
).join(",");
const PICKER_CSS = `@supports selector(:has(*)){.need-picker [data-need-panel]{display:none}${SHOW_SELECTED}{display:block}}`;

export function NeedPicker() {
  return (
    <div className="need-picker mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:gap-x-8">
      <style dangerouslySetInnerHTML={{ __html: PICKER_CSS }} />

      <fieldset className="m-0 min-w-0 border-0 p-0 md:col-span-5">
        <legend className="d-heading p-0">I need&hellip;</legend>
        <div className="need-options mt-6">
          {NEEDS.map((need, i) => (
            <div key={need.slug} className="need-option">
              <input
                type="radio"
                name="need"
                id={`need-${need.slug}`}
                value={need.slug}
                defaultChecked={i === 0}
                className="sr-only"
              />
              <label htmlFor={`need-${need.slug}`}>{need.phrase}</label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="md:col-span-7">
        {NEEDS.map((need) => (
          <NeedPanel key={need.slug} need={need} />
        ))}
      </div>

      <NeedPickerEnhance />
    </div>
  );
}

function NeedPanel({ need }: { need: Need }) {
  const status = needStatus(need);
  const meta = [need.price, "Quote within 72 hours", "No lock-in"].filter(Boolean).join(" · ");

  return (
    <article
      data-need-panel={need.slug}
      className="need-panel rounded-card border border-rule-soft bg-paper p-6 sm:p-8 md:min-h-[29rem] md:p-10"
    >
      <div className="flex items-start justify-between gap-6">
        <h2 className="d-heading">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="d-line-rise block">{need.headline}</span>
          </span>
        </h2>
        {status ? (
          <span className="mt-1.5 shrink-0">
            <StatusTag status={status} />
          </span>
        ) : null}
      </div>

      <div className="need-panel-body d-rise">
        <p className="d-body mt-4">{need.body}</p>
        {need.includes.length > 0 ? <PlusList className="mt-6" items={need.includes} /> : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href="#quote"
            data-need-quote=""
            data-need-option={need.enquiryOption}
            data-need-message={`I need ${need.phrase}.`}
            className={buttonClasses("primary", "default")}
          >
            {status === "ask" ? "Ask us about this" : CTA_LABEL}
          </Link>
          {need.link ? (
            <Link href={need.link.href} className="d-link inline-block text-[15px]">
              {need.link.label}
            </Link>
          ) : null}
        </div>

        <p className="d-label mt-7">{meta}</p>
      </div>
    </article>
  );
}
