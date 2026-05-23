# 20260523 — Add generate-brand-guidelines edge function

## What this enables

From the client workspace (`/admin/workspace?id=<id>`), the **Generate Brand Guidelines**
button calls this edge function. It reads the client's `tone`, `brandColours`, and
`brandKeywords` from `onboard_submissions.state_json`, sends them to Claude, and returns
a structured markdown brand guidelines document covering voice, colour palette, typography,
key messaging, and do's/don'ts.

## Deploy the edge function

Supabase Dashboard → Edge Functions → New function → name: `generate-brand-guidelines`
→ paste `functions/generate-brand-guidelines/index.ts` → Deploy

## Secrets to add

Dashboard → Edge Functions → `generate-brand-guidelines` → Secrets tab:

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | API key from console.anthropic.com |
| `ADMIN_EMAIL` | `dorza.app@gmail.com` (used to verify the caller is admin) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do not add manually.

## How to get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Settings → API Keys → Create Key
3. Copy and paste as `ANTHROPIC_API_KEY`

## Vercel / local env var to add

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_GENERATE_BRAND_GUIDELINES_URL` | `https://<project-ref>.supabase.co/functions/v1/generate-brand-guidelines` |

Add the same to `.env.local` for local dev (the function runs on Supabase's servers regardless).

## Model used

`claude-sonnet-4-6` with `max_tokens: 1500`. Adjust in the edge function if you want
longer output or a different model.
