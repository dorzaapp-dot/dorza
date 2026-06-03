"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitForm } from "@/lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  clientId: string;
  endpoint: string;
  source?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

export default function ContactForm({ clientId, endpoint, source = "contact-form" }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-border bg-white px-4 text-base text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-dorza";
  const textareaClass =
    "w-full rounded-2xl border border-border bg-white px-4 py-3 text-base text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-dorza resize-none";

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please provide your name and email.");
      return;
    }

    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const result = await submitForm(endpoint, {
      clientId,
      source,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      message: form.message.trim() || undefined,
      website: form.website,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
      return;
    }

    setError("Something went wrong. Please try again or contact us directly.");
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-xl font-semibold text-dark">Thanks for getting in touch.</p>
        <p className="mt-3 text-text-secondary">We’ve received your message and will reply as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-dark mb-2">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          placeholder="you@business.com.au"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-2">Phone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          placeholder="Optional"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-2">Message</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Tell us what you need help with"
          className={textareaClass}
        />
      </div>

      <div aria-hidden className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
