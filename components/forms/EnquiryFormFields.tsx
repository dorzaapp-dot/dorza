"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICE_OPTIONS } from "@/lib/constants";
import type { BusinessType, EnquiryFormData } from "@/lib/types";

type Theme = "dark" | "light";

type Props = {
  theme: Theme;
  value: EnquiryFormData;
  onChange: (next: EnquiryFormData) => void;
  showMessage?: boolean;
};

const businessTypes: (BusinessType | "Other")[] = [
  "Tradie",
  "Cafe/Restaurant",
  "Salon/Beauty",
  "Fitness/Wellness",
  "Retail",
  "Professional Services",
  "Other",
];

function classes(theme: Theme) {
  const isDark = theme === "dark";
  const field =
    "w-full rounded-card border text-base transition-colors duration-fast ease-dorza focus:outline-none focus:ring-2";
  return {
    label: isDark
      ? "mb-1.5 ml-px block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-chalk/70"
      : "mb-1.5 ml-px block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft",
    input: isDark
      ? `${field} h-12 px-4 border-chalk/15 bg-chalk/[0.06] text-chalk placeholder-chalk/60 hover:bg-chalk/[0.09] focus:border-ochre focus:ring-ochre/40`
      : `${field} h-12 px-4 border-rule-soft bg-paper text-ink placeholder-ink-soft/75 hover:border-rule focus:border-pine focus:ring-claret/25`,
    selectOption: isDark ? "bg-forest text-chalk" : "bg-paper text-ink",
    chevron: isDark
      ? "pointer-events-none absolute bottom-4 right-4 text-chalk/60"
      : "pointer-events-none absolute bottom-4 right-4 text-ink-mute",
    chipBase:
      "inline-flex h-11 cursor-pointer select-none items-center rounded-chip border px-4 text-[13px] font-medium transition-colors duration-fast ease-dorza",
    chipIdle: isDark
      ? "border-chalk/15 bg-chalk/[0.04] text-chalk/80 hover:border-chalk/30 hover:bg-chalk/[0.08]"
      : "border-rule-soft bg-paper text-ink-soft hover:border-rule hover:bg-stone",
    chipSelected: isDark ? "border-ochre bg-ochre text-forest" : "border-pine bg-pine text-chalk",
    textarea: isDark
      ? `${field} resize-none px-4 py-3 border-chalk/15 bg-chalk/[0.06] text-chalk placeholder-chalk/60 focus:border-ochre focus:ring-ochre/40`
      : `${field} resize-none px-4 py-3 border-rule-soft bg-paper text-ink placeholder-ink-soft/75 focus:border-pine focus:ring-claret/25`,
  };
}

export default function EnquiryFormFields({ theme, value, onChange, showMessage = false }: Props) {
  const c = classes(theme);
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  function patch(partial: Partial<EnquiryFormData>) {
    onChange({ ...value, ...partial });
  }

  function toggleService(service: string) {
    const next = value.servicesInterested.includes(service)
      ? value.servicesInterested.filter((s) => s !== service)
      : [...value.servicesInterested, service];
    patch({ servicesInterested: next });
  }

  return (
    <>
      <div>
        <label htmlFor={fid("name")} className={c.label}>Name</label>
        <input
          id={fid("name")}
          type="text"
          required
          placeholder="Your name"
          value={value.name}
          onChange={(e) => patch({ name: e.target.value })}
          className={c.input}
        />
      </div>

      <div>
        <label htmlFor={fid("email")} className={c.label}>Email</label>
        <input
          id={fid("email")}
          type="email"
          required
          placeholder="you@business.com.au"
          value={value.email}
          onChange={(e) => patch({ email: e.target.value })}
          className={c.input}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <label htmlFor={fid("type")} className={c.label}>Business type</label>
          <select
            id={fid("type")}
            required
            value={value.businessType}
            onChange={(e) => patch({ businessType: e.target.value as BusinessType })}
            className={`${c.input} appearance-none pr-10`}
          >
            <option value="" className={c.selectOption}>Select type</option>
            {businessTypes.map((t) => (
              <option key={t} value={t} className={c.selectOption}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className={c.chevron} />
        </div>
        <div>
          <label htmlFor={fid("suburb")} className={c.label}>Suburb or town</label>
          <input
            id={fid("suburb")}
            type="text"
            required
            placeholder="Where you're based"
            value={value.suburb}
            onChange={(e) => patch({ suburb: e.target.value })}
            className={c.input}
          />
        </div>
      </div>

      <fieldset className="pt-1">
        <legend className={`${c.label} mb-2`}>What are you interested in?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((service) => {
            const selected = value.servicesInterested.includes(service);
            return (
              <button
                key={service}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleService(service)}
                className={`${c.chipBase} ${selected ? c.chipSelected : c.chipIdle}`}
              >
                <span>{service}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {showMessage && (
        <div>
          <label htmlFor={fid("message")} className={c.label}>Anything else? (optional)</label>
          <textarea
            id={fid("message")}
            rows={3}
            placeholder="What's on your mind?"
            value={value.message ?? ""}
            onChange={(e) => patch({ message: e.target.value })}
            className={c.textarea}
          />
        </div>
      )}

      {/* Honeypot: visually hidden, aria-hidden, off-screen. Bots fill it; humans don't. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={value.website ?? ""}
            onChange={(e) => patch({ website: e.target.value })}
          />
        </label>
      </div>
    </>
  );
}
