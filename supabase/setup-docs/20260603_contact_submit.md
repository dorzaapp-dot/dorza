# 20260603 — Contact form (contact-submit edge function)

## What this enables

Client websites post to this central edge function. It looks up the client's email from
`onboard_submissions`, saves the message to `contact_messages`, and emails the client.

---

## Setup checklist

### 1. Run the migration

Supabase Dashboard → SQL Editor → paste and run:

```
supabase/migrations/20260602000000_contact_messages.sql
```

Creates the `contact_messages` table with RLS (admin-read only).

---

### 2. Deploy the edge function

Supabase Dashboard → Edge Functions → Deploy new function → name: `contact-submit`
→ paste `supabase/functions/contact-submit/index.ts` → Deploy

---

### 3. Add Supabase secrets

Dashboard → Edge Functions → `contact-submit` → Secrets:

| Secret | Value |
|--------|-------|
| `GMAIL_USER` | `dorza.app@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail app password (not account password) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do not add manually.

> To get a Gmail app password: myaccount.google.com → Security → 2-Step Verification → App passwords

---

### 4. Add env var to Vercel

Vercel dashboard → dorza.com.au project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CONTACT_SUBMIT_URL` | `https://<project-ref>.supabase.co/functions/v1/contact-submit` |

Redeploy after adding.

---

### 5. Add env var to .env.local

```
NEXT_PUBLIC_CONTACT_SUBMIT_URL=https://<project-ref>.supabase.co/functions/v1/contact-submit
```

Find `<project-ref>` in Supabase Dashboard → Settings → General.

---

## Test it

```
/demo/contactus?clientId=<onboard_submissions_uuid>
```

Fill the form and check:
- [ ] Row appears in Supabase → Table Editor → `contact_messages`
- [ ] Client receives notification email
