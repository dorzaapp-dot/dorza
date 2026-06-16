"use client";

import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import { Info } from "lucide-react";

/* ----- Eyebrow + StepLayout ----- */

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-[0.18em] text-accent font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function StepLayout({
  eyebrow,
  title,
  lead,
  why,
  maxWidth = 720,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  why?: ReactNode;
  maxWidth?: number;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-display text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.025em] text-dark mt-2.5 mb-3">
        {title}
      </h1>
      {why && (
        <p className="md:hidden font-mono text-[11px] text-text-muted leading-relaxed mb-3">
          {why}
        </p>
      )}
      {lead && (
        <p className="text-[15px] md:text-base text-text-secondary leading-relaxed mb-9">
          {lead}
        </p>
      )}
      <div className="flex flex-col gap-5 md:gap-6">{children}</div>
    </div>
  );
}

/* ----- Field + FieldGrid ----- */

export function Field({
  label,
  helper,
  error,
  optional,
  children,
}: {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="flex items-baseline justify-between mb-2">
          <span className="text-[13px] font-semibold text-dark">{label}</span>
          {optional && (
            <span className="text-[11px] text-text-muted font-mono">
              optional
            </span>
          )}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-[13px] text-text-muted mt-1.5 leading-relaxed">
          {helper}
        </p>
      )}
      {error && (
        <p className="text-[12px] text-red-500 mt-1.5 leading-relaxed">
          {error}
        </p>
      )}
    </div>
  );
}

export function FieldGrid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  const c = cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return <div className={`grid grid-cols-1 ${c} gap-4 md:gap-5`}>{children}</div>;
}

/* ----- Input + Textarea ----- */

const FIELD_BASE =
  "w-full border border-border bg-white text-[15px] text-dark placeholder:text-text-muted transition-colors duration-200 ease-dorza " +
  "focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(212,132,90,0.12)]";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${FIELD_BASE} h-12 rounded-[12px] px-4 ${className}`}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${FIELD_BASE} min-h-24 rounded-[12px] px-4 py-3 leading-relaxed resize-none ${className}`}
      {...props}
    />
  );
});

/* ----- Chip + ChipRow ----- */

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  size?: "sm" | "md";
}

export function Chip({
  selected = false,
  size = "md",
  className = "",
  children,
  ...props
}: ChipProps) {
  const h = size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-sm";
  return (
    <button
      type="button"
      className={`${h} rounded-full border font-medium inline-flex items-center justify-center transition-colors duration-200 ease-dorza ${
        selected
          ? "bg-primary text-white border-primary"
          : "bg-white text-dark border-border hover:border-primary-light"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChipRow<T extends string>({
  options,
  isSelected,
  onToggle,
  size = "sm",
}: {
  options: readonly T[];
  isSelected: (v: T) => boolean;
  onToggle: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip
          key={opt}
          selected={isSelected(opt)}
          onClick={() => onToggle(opt)}
          size={size}
        >
          {opt}
        </Chip>
      ))}
    </div>
  );
}

/* ----- OptionCard + OptionGrid ----- */

export interface OptionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  selected?: boolean;
  title: ReactNode;
  desc?: ReactNode;
  swatches?: string[];
  badge?: ReactNode;
  children?: ReactNode;
}

export function OptionCard({
  selected = false,
  title,
  desc,
  swatches,
  badge,
  className = "",
  children,
  ...props
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`relative text-left p-5 rounded-[16px] border transition-all duration-200 ease-dorza w-full ${
        selected
          ? "bg-primary-tint border-primary shadow-[0_8px_24px_rgba(184,103,63,0.12)] -translate-y-px"
          : "bg-white border-border hover:border-primary-light hover:-translate-y-0.5 hover:shadow-soft"
      } ${className}`}
      {...props}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full">
          {badge}
        </span>
      )}
      {swatches && (
        <div className="flex gap-1.5 mb-3">
          {swatches.map((c) => (
            <span
              key={c}
              className="w-6 h-6 rounded-full border border-black/[0.06]"
              style={{ background: c }}
            />
          ))}
        </div>
      )}
      <div className="block text-[15px] font-semibold text-dark leading-tight">
        {title}
      </div>
      {desc && (
        <div className="block text-[13px] text-text-secondary mt-1 leading-relaxed">
          {desc}
        </div>
      )}
      {children}
    </button>
  );
}

export function OptionGrid({
  cols = 2,
  className = "",
  children,
}: {
  cols?: 2 | 3;
  className?: string;
  children: ReactNode;
}) {
  const c = cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${c} gap-3 ${className}`}>{children}</div>
  );
}

/* ----- Toggle (used for website sections + founding client) ----- */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-dorza flex-shrink-0 ${
        on ? "bg-primary" : "bg-border-strong"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-dorza ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ----- Section divider (used in some steps) ----- */

export function SectionRule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-border ${className}`} />;
}

/* ----- Helper for step copy: short numbered eyebrow ----- */

export function stepEyebrow(n: number, label: string) {
  return `${String(n).padStart(2, "0")} — ${label}`;
}

/* ----- Tooltip (info bubble on hover/focus) ----- */

export function Tooltip({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="text-text-muted hover:text-text-secondary transition-colors duration-200 ease-dorza"
      >
        <Info size={13} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-max max-w-[220px] rounded-[8px] bg-dark px-3 py-2 text-[12px] leading-snug text-white shadow-medium pointer-events-none"
        >
          {label}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark" />
        </span>
      )}
    </span>
  );
}

/* ----- Generic mono badge ----- */

export function MonoBadge({
  children,
  className = "",
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted ${className}`}
    >
      {children}
    </span>
  );
}
