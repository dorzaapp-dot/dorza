# Supabase Setup

## First-time deployment

### 1. Create a Supabase project
- [supabase.com](https://supabase.com) → New project
- Note your **Project URL** and **anon key** from Settings → API

### 2. Run the DB migrations
Dashboard → SQL Editor → run each file in order:

1. `migrations/20260514000000_onboard_submissions.sql`
2. `migrations/20260516000000_admin_and_storage.sql`

### 3. Allow auth redirect URLs
Dashboard → Authentication → URL Configuration → add to **Redirect URLs**:

```
https://dorza.app/admin
https://dorza.app/upload
http://localhost:3000/admin
http://localhost:3000/upload
```

### 4. Create your admin account
Dashboard → Authentication → Users → **Add user** → enter your email (`dorza.app@gmail.com`) and a password.

This is your login for `/admin`. Client accounts are created from the admin panel — you don't need to create them manually.

### 5. Deploy the Edge Functions
Dashboard → Edge Functions → New function, deploy both:

| Function name | Source file |
|---------------|-------------|
| `onboard-submit` | `functions/onboard-submit/index.ts` |
| `create-client-user` | `functions/create-client-user/index.ts` |

### 6. Set Edge Function secrets
Dashboard → Edge Functions → select each function → Secrets tab.

Set these on **both** functions:

| Secret | Value |
|--------|-------|
| `GMAIL_USER` | your-gmail@gmail.com |
| `GMAIL_APP_PASSWORD` | Gmail App Password (see below) |
| `SITE_URL` | `https://dorza.app` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do not add them manually.

### 7. Set Vercel environment variables
Vercel → project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key (Settings → API) |
| `NEXT_PUBLIC_ONBOARD_SUBMIT_URL` | `https://<project-ref>.supabase.co/functions/v1/onboard-submit` |
| `NEXT_PUBLIC_CREATE_CLIENT_USER_URL` | `https://<project-ref>.supabase.co/functions/v1/create-client-user` |

Copy the same four into `.env.local` for local dev.

### 8. Redeploy on Vercel
Vercel picks up new env vars on the next deploy.

---

## Gmail App Password
Required for SMTP sending. One-time setup:
1. Gmail → Google Account → Security
2. Enable 2-Step Verification (required)
3. Security → App passwords → create one → name it "Dorza"
4. Use the generated 16-character password as `GMAIL_APP_PASSWORD`

---

## Provisioning a client (ongoing)

1. Go to `/admin` and sign in with your email + password
2. Find the submission in the table
3. Click **Create User** — this creates their Supabase Auth account, updates the submission to `provisioned`, and emails them an invite link to `/upload`
4. Client clicks the link → sets up their account → uploads logo and photos

---

## Schema reference

### `onboard_submissions`

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

### `admin_users`

| Column | Type | Notes |
|--------|------|-------|
| `email` | text | PK — add a row here to grant admin read access |

### Storage: `assets` bucket (private)

Files are stored at `{user_id}/logo/{file}` and `{user_id}/photos/{file}`.
RLS ensures clients can only access their own folder; admin can read all.
