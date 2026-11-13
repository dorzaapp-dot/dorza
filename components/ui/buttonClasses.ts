import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "inverse";
export type ButtonSize = "sm" | "default" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-body font-semibold transition-[transform,background-color,border-color,color] duration-fast ease-dorza hover:-translate-y-px active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  default: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-pine text-chalk hover:bg-forest focus-visible:outline-claret",
  secondary: "border border-rule-soft bg-paper text-ink hover:bg-stone focus-visible:outline-claret",
  ghost: "bg-transparent text-ink hover:bg-stone focus-visible:outline-claret",
  accent: "bg-claret text-chalk hover:bg-[#67242F] focus-visible:outline-claret",
  inverse: "bg-chalk text-forest hover:bg-haze focus-visible:outline-ochre",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
  className?: string
): string {
  return cn(base, sizes[size], variants[variant], className);
}
