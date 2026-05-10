"use client";

import { Plus, Trash2 } from "lucide-react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import { Field, Input, StepLayout, Textarea } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
  errors: Record<string, string>;
}

export default function StepServices({ state, dispatch, errors }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="03 — What you offer"
      title="The services or products you sell"
      lead="List 4–8 of your main offerings. We'll use these to write your services page."
    >
      <Field
        label="Your services"
        error={errors.services}
        helper="Add as many as you need."
      >
        <div className="flex flex-col gap-2">
          {state.services.map((svc, i) => (
            <div key={i} className="relative flex gap-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[11px] text-text-muted tabular-nums pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                value={svc}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_SERVICE",
                    index: i,
                    value: e.target.value,
                  })
                }
                placeholder={
                  i < 4
                    ? `Service ${i + 1}`
                    : `Service ${i + 1} (optional)`
                }
                className="w-full h-12 pl-11 pr-4 border border-border bg-white text-[15px] text-dark placeholder:text-text-muted rounded-[12px] transition-colors duration-200 ease-dorza focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(212,132,90,0.12)]"
              />
              {state.services.length > 1 && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "REMOVE_SERVICE", index: i })}
                  aria-label={`Remove service ${i + 1}`}
                  className="h-12 w-12 flex items-center justify-center border border-border rounded-[12px] text-text-muted hover:text-red-500 hover:border-red-200 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        {state.services.length < 10 && (
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_SERVICE" })}
            className="mt-3 inline-flex items-center gap-1.5 h-10 px-4 border border-dashed border-border-strong text-text-secondary hover:text-dark hover:border-primary text-[13px] font-semibold rounded-[12px] transition-colors"
          >
            <Plus size={14} /> Add another
          </button>
        )}
      </Field>

      <Field
        label="What makes you different from competitors?"
        helper="One or two sentences. What do customers always compliment?"
      >
        <Textarea
          rows={3}
          value={state.differentiator}
          onChange={(e) => update("differentiator", e.target.value)}
        />
      </Field>

      <Field label="Starting-from price" optional>
        <Input
          placeholder="e.g. $39 per class · $299/month unlimited"
          value={state.priceRange}
          onChange={(e) => update("priceRange", e.target.value)}
        />
      </Field>
    </StepLayout>
  );
}
