"use client";

import { Check } from "lucide-react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import { Chip, Field, Input, StepLayout, Toggle } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
  errors: Record<string, string>;
}

const packages = [
  {
    name: "Starter" as const,
    setup: 499,
    monthly: 199,
    tagline: "Website + Google Business",
    accent: "var(--color-accent-dark)",
    features: [
      "Custom website live in 24hrs",
      "Google Business setup",
      "Mobile-optimised + SEO",
      "Basic analytics",
    ],
  },
  {
    name: "Growth" as const,
    setup: 799,
    monthly: 349,
    tagline: "Website + Social + Chatbot",
    accent: "var(--color-primary)",
    badge: "Most popular",
    features: [
      "Everything in Starter",
      "Social media (3 posts/week)",
      "AI customer service chatbot",
      "Review management",
      "Monthly performance report",
    ],
  },
  {
    name: "Pro" as const,
    setup: 1299,
    monthly: 549,
    tagline: "Full service",
    accent: "var(--color-dark)",
    features: [
      "Everything in Growth",
      "Social media (5 posts/week)",
      "Paid ad campaigns",
      "Monthly strategy call",
      "Priority support",
    ],
  },
];

const paymentMethods = ["Card", "Direct debit", "Invoice"] as const;

export default function StepPackage({ state, dispatch, errors }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="09 — Commercials"
      title="Pick your package"
      lead="All include your site live in 24 hours. Cancel anytime."
      maxWidth={840}
    >
      <div className="rounded-[14px] bg-dark text-white px-4 py-3 flex items-center justify-between gap-4">
        <div className="text-[13px] leading-snug">
          <span className="text-primary-light font-semibold">
            Founding client:
          </span>{" "}
          50% off setup, locked-in pricing for 12 months.
        </div>
        <Toggle
          on={state.foundingClient}
          onChange={(v) => update("foundingClient", v)}
          label="Toggle founding client offer"
        />
      </div>

      <Field error={errors.selectedPackage}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {packages.map((pkg) => {
            const selected = state.selectedPackage === pkg.name;
            const setup = state.foundingClient
              ? Math.round(pkg.setup * 0.5)
              : pkg.setup;
            return (
              <button
                key={pkg.name}
                type="button"
                onClick={() =>
                  dispatch({ type: "SELECT_PACKAGE", pkg: pkg.name })
                }
                className={`relative text-left rounded-[16px] border-2 bg-white p-5 transition-colors duration-200 ease-dorza ${
                  selected
                    ? "border-primary"
                    : "border-border hover:border-primary-light"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full">
                    {pkg.badge}
                  </span>
                )}
                <div
                  className="font-display text-[26px] leading-none tracking-[-0.015em] mb-2"
                  style={{ color: pkg.accent }}
                >
                  {pkg.name}
                </div>
                <div className="text-[12px] text-text-muted mb-3">
                  {pkg.tagline}
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[26px] font-bold text-dark tabular-nums">
                    ${pkg.monthly}
                  </span>
                  <span className="text-[12px] text-text-muted">
                    /mo + ${setup} setup
                  </span>
                </div>
                {state.foundingClient && (
                  <div className="text-[11px] text-accent-dark mb-3 font-mono">
                    Setup ${pkg.setup} → ${setup}
                  </div>
                )}
                <ul className="flex flex-col gap-1.5">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-[13px] text-text-secondary leading-snug"
                    >
                      <Check
                        size={14}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Payment method">
        <div className="flex gap-2">
          {paymentMethods.map((m) => (
            <Chip
              key={m}
              selected={state.paymentMethod === m}
              onClick={() => update("paymentMethod", m)}
              size="md"
              className="flex-1"
            >
              {m}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Preferred start date">
        <Input
          type="date"
          value={state.startDate}
          onChange={(e) => update("startDate", e.target.value)}
        />
      </Field>
    </StepLayout>
  );
}
