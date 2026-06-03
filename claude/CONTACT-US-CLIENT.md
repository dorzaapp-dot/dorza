# Contact Us — Client integration (Dorza central contact API)

This document describes a recommended, reusable implementation for a "Contact Us" form that any client site generated from Dorza can use. It assumes a central Supabase project for Dorza (the master hub) and a single Edge Function that receives submissions and writes canonical rows to a `contact_messages` table.

## Goals
- Provide a single, secure API that all client sites can post to.
- Keep canonical data in the main Supabase `contact_messages` table (one place to query and notify).
- Send a notification email to the client's target address and optionally a confirmation to the submitter.
- Ship a reusable frontend component and a Claude-code prompt so new sites are scaffolded quickly.

## High-level architecture

- Frontend (client site): reusable contact form component that posts to Dorza Edge Function (public endpoint). Payload includes `client_id` or `client_slug` identifying the tenant.
- Edge Function (central Supabase): validates payload, spam checks, inserts to `contact_messages` table using service role, and sends email notifications.
- Database: `contact_messages` table holding all submissions with `client_id` column.

## API design (Edge Function)

- Endpoint: `POST /contact-submit` (HTTPS; public but with origin & client validation).
- Payload: JSON { client_id, source, name, email, phone, message, metadata?: {}, website?: '' (honeypot) }
- Server steps:
  1. Validate required fields and JSON schema.
  2. Honeypot and basic rate-limit checks; reject spam silently.
  3. Lookup `client_id` in `clients` table (or allowed-origins mapping). If unknown -> 400.
  4. Insert row into `contact_messages` table with `client_id` and metadata.
  5. Send notification email to admin and a confirmation email to the client.

## Data model (suggested)

- Table: `contact_messages`
  - `id` UUID PK
  - `created_at` timestamptz default now()
  - `client_id` text (FK to `clients.slug`)
  - `source` text (e.g., "site:contact", "modal", "inline")
  - `name` text
  - `email` text
  - `phone` text
  - `message` text
  - `metadata` jsonb (referrer, page, utm, user_agent)
  - `raw_payload` jsonb (optional)

Indexes: (`client_id`, `created_at`)

## Email delivery strategy

- The Edge Function should send:
  - a notification email to the client's business email address looked up from `onboard_submissions.email` using `client_id`, and
  - optionally a confirmation email to the submitter's email address.
- Use `denomailer` in Deno:
  - `import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";`
  - `const gmailUser = Deno.env.get("GMAIL_USER")!;`
  - `const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD")!;`
- Send both emails from `Dorza <dorza.app@gmail.com>`.

## Security and permissions

- Edge Function runs with Supabase service role key (server-side privileges) but must validate `client_id` and origin.
- Use CORS origin checks and a `clients` table that stores allowed origins for each client.
- Implement rate limiting (IP-based) and honeypot field `website` to reduce spam. Optionally integrate Cloudflare Turnstile if needed.
- RLS: keep `contact_messages` readable by admin only; client-scoped reads can be implemented if you create per-client tokens or expose a server-side endpoint.

## Notifications

- On insert, Edge Function should:
  - Send a notification email to the client's business email address (from `onboard_submissions.email`)
  - Optionally send a confirmation email to the submitter's email address
  - Use `SMTPClient` from `https://deno.land/x/denomailer/mod.ts`
  - Authenticate with `GMAIL_USER` and `GMAIL_APP_PASSWORD`
  - Send emails from `Dorza <dorza.app@gmail.com>`

## Frontend integration (reusable component)

- Build a small React component `ContactForm` that:
  - Renders fields: name, email, phone (optional), message, hidden `website` honeypot
  - Validates client-side
  - Calls `submitForm(endpoint, data)` from `lib/api.ts` and includes `client_id`
  - Shows success and error states
- Reuse existing patterns: see `components/forms/EnquiryFormFields.tsx` and `lib/api.ts` for examples.

Usage snippet (client site):

```jsx
<ContactForm clientId="acme-co" endpoint="https://<EDGE_URL>/contact-submit" />
```

## Claude-code template / prompt (for scaffolded sites)

Purpose: generate a client-specific contact form component and usage snippet that posts to Dorza's central Edge Function.

Minimal prompt to give Claude-code generator:

"Generate a React contact form component for client `{{client_slug}}` with fields: name, email, phone, message. Use the existing `submitForm(endpoint, data)` helper from `lib/api.ts` to POST to `https://<EDGE_URL>/contact-submit`. Include `client_id: '{{client_slug}}'` in the payload. Add a hidden honeypot field named `website`. Client-side validation: required `name` and `email` (basic email regex). On success show a thank-you state; on error show message. Keep CSS classNames using Dorza tokens and reference `components/forms/EnquiryFormFields.tsx` for field primitives. Output a single file `ContactForm.tsx` and a short usage example for a page." 

Notes for Claude prompt:
- Provide `EDGE_URL` (environment value) and the target `client_slug`.
- If the client requests Turnstile, add instructions to include its site key.

## Admin & operational UX

- Add a `/admin/contact-messages` tab that lists submissions and filters by `client_id`.
- Provide an admin view for notification status and a manual export option later if needed.

## Tradeoffs and recommendations

- Central Edge Function (recommended): easy to maintain, consistent behavior, single place for spam rules and notification wiring.
- Per-client functions: greater isolation, more operational overhead — not recommended unless clients require strict data separation.
- Keep CSV/export as a future enhancement; start with DB storage and email notifications only.

## Implementation checklist

1. Add `contact_messages` table migration to `supabase/migrations/`.
2. Implement `contact-submit` Edge Function in `supabase/functions/contact-submit/`.
3. Add server secrets `GMAIL_USER` and `GMAIL_APP_PASSWORD` to Supabase secrets.
4. Build `ContactForm` component in `components/forms/` and example usage on a page template.
5. Add admin UI for listing contact messages and reviewing submissions.
6. Add Claude-code prompt template to `claude/` (this file can be used as part of that prompt).

---

If you'd like, I can now implement the migration and the Edge Function skeleton, or generate the Claude prompt file that Claude-code will use to scaffold per-client forms. Which should I do next?
