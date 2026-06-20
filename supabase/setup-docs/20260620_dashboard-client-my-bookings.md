# Client Dashboard — My Bookings

The client dashboard lets Dorza clients (business owners) sign in with email + password to view and manage bookings made through their website.

## What was added

| File | Purpose |
|------|---------|
| `app/dashboard/page.tsx` | Client dashboard page — login, stats, booking list with confirm/cancel |
| `supabase/migrations/20260620000000_client_bookings_rls.sql` | RLS policies so clients can read/update their own bookings |
| `supabase/functions/create-client-user/index.ts` | Updated — now creates users with email + password (was invite/magic link) |
| `app/dashboard/reset-password/page.tsx` | Password reset page — handles both requesting a reset and setting new password |

## How it works

### Auth flow
1. Admin clicks **Create User** on a pending submission in `/admin`
2. `create-client-user` edge function creates a Supabase auth user with a random 12-char password
3. Client receives an email with their credentials and a link to `/dashboard`
4. Client signs in with email + password via `supabase.auth.signInWithPassword()`

### Data flow
- Logged-in client → their `onboard_submissions` row (matched by `user_id = auth.uid()`) → submission `id` is the `client_id` in the `bookings` table
- RLS policies enforce this: clients can only SELECT and UPDATE bookings where `client_id` matches their submission

### Dashboard features
- **Stats cards**: upcoming count, pending count, total bookings
- **Tabs**: Upcoming vs Past & Cancelled
- **Expandable rows**: customer name, date/time, email, phone, message
- **Actions**: Confirm (pending → confirmed), Cancel (any → cancelled)
- **Toast notifications** for status updates

## Setup steps

### 1. Run the migration

```bash
supabase db push
```

Or apply manually in the Supabase SQL editor:

```sql
-- From: supabase/migrations/20260620000000_client_bookings_rls.sql

create policy "client_read_own_bookings" on bookings
  for select using (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  );

create policy "client_update_own_bookings" on bookings
  for update using (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  ) with check (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  );
```

### 2. Deploy the updated edge function

```bash
supabase functions deploy create-client-user
```

The existing secrets (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SITE_URL`) are still used — no new secrets needed.

### 3. Add redirect URL for password reset

In the Supabase dashboard, go to **Authentication → URL Configuration → Redirect URLs** and add:

```
https://your-domain.com/dashboard/reset-password
```

Replace `your-domain.com` with your actual domain (e.g. `dorza.app`). For non-prod, also add your preview/staging URL (e.g. `https://dorza-git-feature-xyz.vercel.app/dashboard/reset-password`).

Without this, the password recovery email link will fail to redirect back to your app.

### 4. Deploy the frontend

Push to Vercel as normal. The `/dashboard` route is statically exported like all other pages.

No new environment variables needed — the dashboard uses the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` already configured.

## Testing

1. Go to `/admin` and click **Create User** on a pending submission
2. Check the client's email — they should receive credentials (email + temporary password)
3. Go to `/dashboard` and sign in with those credentials
4. Verify bookings are visible (if any exist for that client)
5. Test confirm/cancel actions on a booking

## Notes

- Clients who were provisioned **before** this change used magic links and don't have a password. You can re-provision them by resetting their submission status to `pending` and clicking Create User again, or manually set a password via the Supabase dashboard (Authentication → Users → edit user).
- The `/upload` page still uses magic link auth — it's a separate flow. Clients can use both.
- The dashboard does **not** link to `/upload` yet. That can be added later if needed.
