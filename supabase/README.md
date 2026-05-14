# Supabase Setup

## First-time deployment

### 1. Create a Supabase project
- [supabase.com](https://supabase.com) → New project
- Note your **project ref** from Settings → General

### 2. Run the DB migration
- Dashboard → SQL Editor → paste `migrations/20260514000000_onboard_submissions.sql` → Run

### 3. Deploy the Edge Function
- Dashboard → Edge Functions → New function → name: `onboard-submit`
- Paste `functions/onboard-submit/index.ts` → Deploy

### 4. Set Edge Function secrets
Dashboard → Edge Functions → `onboard-submit` → Secrets tab:

| Secret | Value |
|--------|-------|
| `GMAIL_USER` | your-gmail@gmail.com |
| `GMAIL_APP_PASSWORD` | Gmail App Password (see below) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do not add them manually.

### 5. Set Vercel environment variable
Vercel → project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_ONBOARD_SUBMIT_URL` | `https://<project-ref>.supabase.co/functions/v1/onboard-submit` |

Add the same to `.env.local` for local testing.

### 6. Redeploy on Vercel
Vercel picks up new env vars on the next deploy.

---

## Gmail App Password
Required for SMTP sending. One-time setup:
1. Gmail → Google Account → Security
2. Enable 2-Step Verification (required)
3. Security → App passwords → create one → name it "Dorza"
4. Use the generated 16-character password as `GMAIL_APP_PASSWORD`

---

## Provisioning a client user

Once a submission is in `onboard_submissions`, create their auth account:

```js
const { data } = await supabase.auth.admin.inviteUserByEmail(row.email);
// Then link the submission to the new user:
await supabase
  .from("onboard_submissions")
  .update({ user_id: data.user.id, status: "provisioned" })
  .eq("id", row.id);
```

This sends the client a magic-link invite email and links their intake form to their account.

---

## Table: onboard_submissions

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, auto-generated |
| `created_at` | timestamptz | auto |
| `email` | text | from onboard form |
| `business_name` | text | |
| `owner_name` | text | |
| `markdown_content` | text | output of `generateMarkdown()` |
| `state_json` | jsonb | full `OnboardState` |
| `user_id` | uuid FK → auth.users | null until provisioned |
| `status` | text | `pending` \| `provisioned` |
