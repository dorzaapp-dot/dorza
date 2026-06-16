"use client";

import { useId } from "react";
import { Pipette, Plus, X } from "lucide-react";
import type { BrandColour, BrandColourRole } from "@/lib/types";
import { Tooltip } from "./_primitives";

const ROLE_ORDER: BrandColourRole[] = ["primary", "secondary", "tertiary"];

const ROLE_META: Record<BrandColourRole, { label: string; tip: string; seed: string }> = {
  primary: {
    label: "Primary",
    tip: "Your main brand colour — buttons, links, and the things you want noticed first.",
    seed: "#D4845A",
  },
  secondary: {
    label: "Secondary",
    tip: "A supporting colour — backgrounds, section fills, and secondary buttons.",
    seed: "#6B8F71",
  },
  tertiary: {
    label: "Tertiary",
    tip: "An optional accent — small details and highlights, used sparingly.",
    seed: "#1A1A2E",
  },
};

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const isValidHex = (h: string) => HEX_RE.test(h);

/** Sanitize keystrokes into a hex-ish string: leading #, hex chars only, max 7 chars. */
function normalizeHex(raw: string): string {
  const digits = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
  return ("#" + digits).toUpperCase();
}

/** A value the native <input type="color"> will accept (#rrggbb), falling back to seed. */
function toColorValue(hex: string, fallback: string): string {
  let h = hex.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) {
    h = "#" + h.slice(1).split("").map((c) => c + c).join("");
  }
  return /^#[0-9a-f]{6}$/.test(h) ? h : fallback.toLowerCase();
}

export default function BrandPalette({
  value,
  onChange,
}: {
  value: BrandColour[];
  onChange: (next: BrandColour[]) => void;
}) {
  const reactId = useId();

  // Render in canonical role order regardless of insertion order.
  const ordered = ROLE_ORDER.map((r) => value.find((c) => c.role === r)).filter(
    Boolean,
  ) as BrandColour[];
  const nextRole = ROLE_ORDER.find((r) => !value.some((c) => c.role === r));

  function updateHex(role: BrandColourRole, hex: string) {
    onChange(value.map((c) => (c.role === role ? { ...c, hex } : c)));
  }
  function addColour() {
    if (!nextRole) return;
    onChange([...value, { role: nextRole, hex: ROLE_META[nextRole].seed }]);
  }
  function removeColour(role: BrandColourRole) {
    onChange(value.filter((c) => c.role !== role));
  }

  return (
    <div className="flex flex-col gap-2.5">
      {ordered.map((c) => {
        const meta = ROLE_META[c.role];
        const inputId = `${reactId}-${c.role}`;
        const swatch = toColorValue(c.hex, meta.seed);
        return (
          <div
            key={c.role}
            className="flex items-center gap-3 rounded-[12px] border border-border bg-white p-2.5"
          >
            <label
              htmlFor={inputId}
              className="group relative w-11 h-11 rounded-[10px] border border-black/[0.08] shadow-soft cursor-pointer flex-shrink-0 transition-all duration-200 ease-dorza hover:shadow-medium hover:ring-2 hover:ring-primary/25 active:scale-95"
              style={{ background: swatch }}
            >
              <input
                id={inputId}
                type="color"
                value={swatch}
                onChange={(e) => updateHex(c.role, e.target.value.toUpperCase())}
                aria-label={`${meta.label} colour swatch`}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Always-visible affordance (so it reads as tappable on touch) that brightens on hover. */}
              <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-white text-text-secondary shadow-soft transition-colors duration-200 ease-dorza group-hover:text-primary">
                <Pipette size={11} />
              </span>
            </label>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[13px] font-semibold text-dark">{meta.label}</span>
                <Tooltip label={meta.tip} />
              </div>
              <input
                value={c.hex}
                onChange={(e) => updateHex(c.role, normalizeHex(e.target.value))}
                placeholder={meta.seed}
                spellCheck={false}
                aria-label={`${meta.label} hex code`}
                aria-invalid={c.hex !== "#" && !isValidHex(c.hex)}
                className="w-full max-w-[150px] h-9 rounded-[8px] border border-border bg-white px-3 font-mono text-[13px] uppercase tracking-[0.04em] text-dark transition-colors duration-200 ease-dorza focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(212,132,90,0.12)] aria-[invalid=true]:border-red-400"
              />
            </div>

            <button
              type="button"
              onClick={() => removeColour(c.role)}
              aria-label={`Remove ${meta.label} colour`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-dark hover:bg-surface transition-colors duration-200 ease-dorza flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}

      {nextRole && (
        <button
          type="button"
          onClick={addColour}
          className="inline-flex items-center gap-1.5 self-start h-9 px-4 rounded-full border border-dashed border-border-strong text-[13px] font-medium text-text-secondary hover:border-primary-light hover:text-dark transition-colors duration-200 ease-dorza"
        >
          <Plus size={15} />
          {ordered.length === 0
            ? "Pick your colours"
            : `Add ${ROLE_META[nextRole].label.toLowerCase()} colour`}
        </button>
      )}
    </div>
  );
}
