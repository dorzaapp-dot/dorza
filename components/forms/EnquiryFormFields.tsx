"use client";

import { ChevronDown, Check } from "lucide-react";
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
  return {
    label: isDark
      ? "block text-[12px] font-medium text-white/60 mb-1.5 ml-1 uppercase tracking-[0.12em] font-mono"
      : "block text-[12px] font-medium text-text-secondary mb-1.5 ml-1 uppercase tracking-[0.12em] font-mono",
    input: isDark
      ? "w-full h-12 px-4 rounded-2xl md:rounded-full text-base text-white placeholder-white/40 bg-white/[0.06] border border-white/15 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-dorza hover:bg-white/[0.08]"
      : "w-full h-12 px-4 rounded-2xl md:rounded-full text-base text-dark placeholder-text-muted bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 ease-dorza hover:border-[#E5DFD6]",
    selectOption: isDark ? "bg-dark text-white" : "bg-white text-dark",
    chevron: isDark
      ? "absolute right-4 bottom-3.5 text-white/40 pointer-events-none"
      : "absolute right-4 bottom-3.5 text-text-muted pointer-events-none",
    chipBase:
      "inline-flex items-center gap-1.5 h-9 px-4 rounded-full font-medium text-[13px] border transition-all duration-300 ease-dorza select-none cursor-pointer",
    chipIdle: isDark
      ? "bg-white/[0.04] border-white/15 text-white/70 hover:bg-white/[0.08] hover:border-white/25"
      : "bg-white border-border text-text-secondary hover:border-[#E5DFD6] hover:bg-surface",
    chipSelected: isDark
      ? "bg-primary border-primary text-white shadow-soft"
      : "bg-primary border-primary text-white shadow-soft",
    textarea: isDark
      ? "w-full px-4 py-3 rounded-2xl text-base text-white placeholder-white/40 bg-white/[0.06] border border-white/15 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-dorza resize-none"
      : "w-full px-4 py-3 rounded-2xl text-base text-dark placeholder-text-muted bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 ease-dorza resize-none",
  };
}

export default function EnquiryFormFields({ theme, value, onChange, showMessage = false }: Props) {
  const c = classes(theme);

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
        <label className={c.label}>Name</label>
        <input
          type="text"
          required
          placeholder="Your name"
          value={value.name}
          onChange={(e) => patch({ name: e.target.value })}
          className={c.input}
        />
      </div>

      <div>
        <label className={c.label}>Email</label>
        <input
          type="email"
          required
          placeholder="you@business.com.au"
          value={value.email}
          onChange={(e) => patch({ email: e.target.value })}
          className={c.input}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="relative">
          <label className={c.label}>Business type</label>
          <select
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
          <label className={c.label}>Suburb</label>
          <input
            type="text"
            required
            placeholder="e.g. Surry Hills"
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
                {selected && <Check size={13} aria-hidden />}
                <span>{service}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {showMessage && (
        <div>
          <label className={c.label}>Anything else? (optional)</label>
          <textarea
            rows={3}
            placeholder="What's on your mind?"
            value={value.message ?? ""}
            onChange={(e) => patch({ message: e.target.value })}
            className={c.textarea}
          />
        </div>
      )}

      {/* Honeypot — visually hidden, aria-hidden, off-screen. Bots fill it; humans don't. */}
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
