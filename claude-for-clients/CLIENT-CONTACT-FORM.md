# Instruction: Add Contact Form to Client Site

## What this does

Adds a self-contained contact form that posts to Dorza's central edge function.
Submissions are saved to the `contact_messages` table and emailed to the client.

The form has no dependencies on Dorza's internal packages — copy the file and add two env vars.

---

## Step 1 — Create the component

Create `components/ContactForm.tsx` with this exact content:

```tsx
"use client";

import { FormEvent, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  clientId: string;
  source?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

export default function ContactForm({ clientId, source = "contact-form" }: Props) {
  const endpoint = process.env.NEXT_PUBLIC_DORZA_CONTACT_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_DORZA_ANON_KEY ?? "";

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

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    let result: { success: boolean } = { success: false };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          clientId,
          source,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim() || undefined,
          website: form.website,
        }),
      });
      result = res.ok ? await res.json() : { success: false };
    } catch {
      result = { success: false };
    }

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
      return;
    }

    setError("Something went wrong. Please try again.");
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-lg font-semibold text-gray-900">Thanks for getting in touch.</p>
        <p className="mt-2 text-gray-500">We'll be in touch as soon as possible.</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1.5">
          Phone <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="04xx xxx xxx"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Message</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="How can we help?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot — hidden from real users, catches bots */}
      <div aria-hidden className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
```

> Adapt the Tailwind classes to match the client site's colour palette.

---

## Step 2 — Add env vars

Add to `.env.local`:

```
NEXT_PUBLIC_DORZA_CONTACT_URL=https://dehaljveiwfsqklickay.supabase.co/functions/v1/contact-submit
NEXT_PUBLIC_DORZA_ANON_KEY=<dorza-anon-key>
```

Add the same two variables to the client site's Vercel project → Settings → Environment Variables.

The `NEXT_PUBLIC_DORZA_ANON_KEY` is Dorza's Supabase anon key (safe to expose — it's a public key).
Get it from: Supabase Dashboard → Settings → API → Project API keys → `anon public`.

---

## Step 3 — Use it on the page

```tsx
import ContactForm from "@/components/ContactForm";

// clientId is the onboard_submissions.id UUID for this client
<ContactForm clientId="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
```

The `clientId` is the UUID from `onboard_submissions.id` in the Dorza Supabase database.
Find it in: Dorza admin dashboard → Submissions → expand the client row.

---

## Checklist

- [ ] `components/ContactForm.tsx` created
- [ ] `NEXT_PUBLIC_DORZA_CONTACT_URL` added to `.env.local` and Vercel
- [ ] `NEXT_PUBLIC_DORZA_ANON_KEY` added to `.env.local` and Vercel
- [ ] `<ContactForm clientId="..." />` placed on the contact section/page
- [ ] Test: submit the form and confirm the client receives the email
