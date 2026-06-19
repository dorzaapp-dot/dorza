# Booking Form — Client integration (Dorza central booking API)

This document describes a reusable implementation for a booking/appointment form that any client site generated from Dorza can use. It extends the same central-Supabase hub pattern used by `CONTACT-US-CLIENT.md`.

## Goals
- Provide a single, secure API that all client sites can post appointment bookings to.
- Prevent double-booking: once a slot is taken it is unavailable to all other visitors.
- Store canonical data in the main Supabase `bookings` table.
- Send a notification email to the business owner and a confirmation to the customer.
- Ship a reusable frontend component and a Claude-code prompt so new sites are scaffolded quickly.

## High-level architecture

- Frontend (client site): `BookingForm` component fetches availability and posts a booking to Dorza Edge Functions. Payload includes `clientId` identifying the tenant.
- `booking-availability` Edge Function: GET — returns booked time slots for a given client + date.
- `booking-submit` Edge Function: POST — validates, checks slot availability, inserts with DB-level uniqueness guarantee, sends emails.
- Database: `bookings` table with a partial unique index that blocks concurrent double-bookings.

## API design

### GET /booking-availability
- Query params: `client_id`, `date` (YYYY-MM-DD)
- Response: `{ bookedSlots: string[] }` — array of "HH:MM" strings for slots already taken.
- Used by the frontend to grey out unavailable time chips after the customer picks a date.

### POST /booking-submit
- Payload: `{ clientId, name, email, phone?, message?, bookingDate, bookingTime, website? (honeypot) }`
- Server steps:
  1. Honeypot check — discard silently.
  2. Validate required fields and formats (date YYYY-MM-DD, time HH:MM).
  3. Resolve business owner email from `onboard_submissions.email` using `clientId`.
  4. Insert row — partial unique index on `(client_id, booking_date, booking_time) where status != 'cancelled'` enforces no double-booking at the DB level.
  5. On unique violation (error code `23505`) — return `{ success: false, error: "SLOT_UNAVAILABLE" }` so the frontend can show a specific message and re-fetch availability.
  6. Send notification email to business owner.
  7. Send confirmation email to customer.

## Data model

Table: `bookings` (migration: `supabase/migrations/20260612000000_bookings.sql`)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `created_at` | timestamptz | |
| `client_id` | text | FK → `onboard_submissions.id` |
| `booking_date` | date | |
| `booking_time` | time | |
| `name` | text | |
| `email` | text | |
| `phone` | text | nullable |
| `message` | text | nullable |
| `status` | text | `pending` / `confirmed` / `cancelled` |
| `metadata` | jsonb | `user_agent`, etc. |
| `raw_payload` | jsonb | full request body |

Double-booking prevention:
```sql
create unique index bookings_slot_unique
  on bookings (client_id, booking_date, booking_time)
  where status != 'cancelled';
```
Cancelling a booking (setting `status = 'cancelled'`) frees the slot for re-booking.

## Time slots

Default slots in `BookingForm.tsx`: 9:00 AM – 5:00 PM in 30-minute increments (17 slots). Adjust `TIME_SLOTS` in the component to match the business's operating hours.

## Email delivery

- Both edge functions use `denomailer` SMTP over Gmail (same credentials as `enquiry-submit` and `contact-submit`).
- Business owner email is resolved from `onboard_submissions.email` by `clientId`.
- Customer receives a confirmation with the formatted date and time.
- Secrets required: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (already set if contact-submit is working).

## Security

- Honeypot field `website` silently discards bot submissions.
- DB-level uniqueness prevents concurrent double-bookings even with no app-level locking.
- RLS: `bookings` is admin-read + admin-update only; edge functions use service role.

## Frontend integration

Usage in a client site page:

```tsx
import BookingForm from "@/components/forms/BookingForm";

<BookingForm
  clientId="<onboard_submission_id>"
  submitEndpoint={process.env.NEXT_PUBLIC_BOOKING_SUBMIT_URL!}
  availabilityEndpoint={process.env.NEXT_PUBLIC_BOOKING_AVAILABILITY_URL!}
/>
```

The component manages all state internally: date selection → fetch availability → time chip grid → contact fields → submit → success or slot-conflict error.

## Test page

A demo page at `/demo/booking` lets you test the full booking flow for any client without building a dedicated page first.

**URL format:**
```
https://dorza.app/demo/booking?clientId=<onboard_submission_id>
```

- `clientId` must match a row in `onboard_submissions` — the edge function uses it to look up the business owner's notification email.
- If `clientId` is missing, the page shows a clear error rather than a broken form.
- The page reads `NEXT_PUBLIC_BOOKING_SUBMIT_URL` and `NEXT_PUBLIC_BOOKING_AVAILABILITY_URL` from the environment, so it works in both staging and production after the Vercel env vars are set.
- Mirrors the pattern of `/demo/contactus?clientId=...` — same `Suspense` wrapper for static export compatibility.

**Source:** `app/demo/booking/page.tsx`

## Claude-code prompt (for scaffolded sites)

```
Generate a booking section for client `{{client_slug}}` (onboard_submissions id: `{{client_id}}`).
Import `BookingForm` from `@/components/forms/BookingForm` and render it inside a section with:
- An eyebrow label "Book an appointment"
- A heading (Instrument Serif, 44–60px)
- A short subheading mentioning the business name and location
- The `BookingForm` component wired to:
    submitEndpoint={process.env.NEXT_PUBLIC_BOOKING_SUBMIT_URL!}
    availabilityEndpoint={process.env.NEXT_PUBLIC_BOOKING_AVAILABILITY_URL!}
    clientId="{{client_id}}"
Adjust TIME_SLOTS in BookingForm.tsx to match the business operating hours from intake.md.
Use the Dorza design tokens and Container component. Wrap in Reveal for scroll animation.
```

## Environment variables

Add to `.env.local` and Vercel:
```
NEXT_PUBLIC_BOOKING_SUBMIT_URL=https://<ref>.supabase.co/functions/v1/booking-submit
NEXT_PUBLIC_BOOKING_AVAILABILITY_URL=https://<ref>.supabase.co/functions/v1/booking-availability
```

No new Supabase secrets needed — `GMAIL_USER` and `GMAIL_APP_PASSWORD` are shared with the existing email functions.

## Admin UX (future)

- Add a Bookings tab to `/admin/page.tsx` listing rows from `bookings` filtered by `client_id`.
- Row actions: Confirm → Cancel (status pipeline). Cancelling frees the slot.
- Add calendar view by client to spot busy days at a glance.

## Implementation checklist

1. Run `supabase db push` (or apply `20260612000000_bookings.sql` via Supabase dashboard SQL editor).
2. Deploy edge functions: `supabase functions deploy booking-availability booking-submit`.
3. Add `NEXT_PUBLIC_BOOKING_SUBMIT_URL` and `NEXT_PUBLIC_BOOKING_AVAILABILITY_URL` to Vercel env vars and redeploy.
4. Confirm `GMAIL_USER` and `GMAIL_APP_PASSWORD` secrets are already set (shared with contact-submit).
5. Use `BookingForm` in a client site page or section (see usage snippet above).
6. Adjust `TIME_SLOTS` in `BookingForm.tsx` to the client's operating hours.
7. Add Bookings admin tab when ready.
