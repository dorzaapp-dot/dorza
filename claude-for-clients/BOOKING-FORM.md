# Instruction: Add Booking Form to Client Site

## What this does

Adds a date-and-time booking form that posts to Dorza's central edge functions.
Bookings are saved to the `bookings` table, and both the business owner and the customer receive email confirmations.

The form checks real-time availability (greying out taken slots) and handles race conditions (concurrent booking of the same slot).

No dependencies on Dorza's internal packages — copy the file and add three env vars.

---

## Step 1 — Create the component

Create `components/BookingForm.tsx` with this exact content:

```tsx
"use client";

import { useState, useCallback } from "react";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDateLong(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

type Props = {
  clientId: string;
};

type Status = "idle" | "loading" | "submitting" | "success" | "error";

export default function BookingForm({ clientId }: Props) {
  const submitEndpoint = process.env.NEXT_PUBLIC_DORZA_BOOKING_SUBMIT_URL ?? "";
  const availabilityEndpoint = process.env.NEXT_PUBLIC_DORZA_BOOKING_AVAILABILITY_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_DORZA_ANON_KEY ?? "";

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${anonKey}`,
  };

  const fetchAvailability = useCallback(
    async (selectedDate: string) => {
      if (!selectedDate) return;
      setStatus("loading");
      setTime("");
      try {
        const res = await fetch(
          `${availabilityEndpoint}?client_id=${encodeURIComponent(clientId)}&date=${encodeURIComponent(selectedDate)}`,
          { headers: authHeader },
        );
        const data = await res.json();
        setBookedSlots(data.bookedSlots ?? []);
      } catch {
        setBookedSlots([]);
      } finally {
        setStatus("idle");
      }
    },
    [availabilityEndpoint, clientId],
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value;
    setDate(d);
    fetchAvailability(d);
    setErrors((prev) => ({ ...prev, date: "", time: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!date) next.date = "Please select a date";
    if (!time) next.time = "Please select a time";
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch(submitEndpoint, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          clientId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          message: message.trim() || null,
          bookingDate: date,
          bookingTime: time,
          website,
        }),
      });
      const result: { success: boolean; error?: string } = res.ok
        ? await res.json()
        : { success: false };
      if (result.success) {
        setStatus("success");
      } else {
        const msg =
          result.error === "SLOT_UNAVAILABLE"
            ? "This time slot was just taken. Please pick another time."
            : "Something went wrong. Please try again.";
        setErrorMessage(msg);
        if (result.error === "SLOT_UNAVAILABLE") {
          fetchAvailability(date);
        }
        setStatus("error");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";
  const isLoadingSlots = status === "loading";

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Booking confirmed!</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          A confirmation has been sent to <strong>{email}</strong>.<br />
          We&apos;ll see you on {formatDateLong(date)} at {formatTime(time)}.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full h-12 px-4 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors";
  const inputDefault = `${inputClass} border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900`;
  const inputError = `${inputClass} border-red-400`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-0 h-0 overflow-hidden">
        <input
          tabIndex={-1}
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="booking-date" className="block text-sm font-semibold text-gray-900 mb-1.5">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="booking-date"
          type="date"
          min={today}
          value={date}
          onChange={handleDateChange}
          className={errors.date ? inputError : inputDefault}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Time slots */}
      {date && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Time <span className="text-red-500">*</span>
          </label>
          {isLoadingSlots ? (
            <p className="text-sm text-gray-400">Loading available times…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      setTime(slot);
                      setErrors((prev) => ({ ...prev, time: "" }));
                    }}
                    className={`h-9 px-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isBooked
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-900 hover:border-gray-900 hover:text-gray-900"
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          )}
          {errors.time && <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="booking-name" className="block text-sm font-semibold text-gray-900 mb-1.5">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="booking-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="Your full name"
          className={errors.name ? inputError : inputDefault}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="booking-email" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="booking-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder="you@example.com"
            className={errors.email ? inputError : inputDefault}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="booking-phone" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Phone
          </label>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="04xx xxx xxx"
            className={inputDefault}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="booking-message" className="block text-sm font-semibold text-gray-900 mb-1.5">
          Message <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="booking-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Anything we should know before your appointment?"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoadingSlots}
        className="w-full h-12 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isSubmitting ? "Booking…" : "Book appointment"}
      </button>
    </form>
  );
}
```

> Adapt the Tailwind classes to match the client site's colour palette.
> To customise available time slots, edit the `TIME_SLOTS` array.

---

## Step 2 — Add env vars

Add to `.env.local`:

```
NEXT_PUBLIC_DORZA_BOOKING_SUBMIT_URL=https://dehaljveiwfsqklickay.supabase.co/functions/v1/booking-submit
NEXT_PUBLIC_DORZA_BOOKING_AVAILABILITY_URL=https://dehaljveiwfsqklickay.supabase.co/functions/v1/booking-availability
NEXT_PUBLIC_DORZA_ANON_KEY=<dorza-anon-key>
```

Add the same three variables to the client site's Vercel project → Settings → Environment Variables.

The `NEXT_PUBLIC_DORZA_ANON_KEY` is Dorza's Supabase anon key (safe to expose — it's a public key).
Get it from: Supabase Dashboard → Settings → API → Project API keys → `anon public`.

> If the client site already has `NEXT_PUBLIC_DORZA_ANON_KEY` from the contact form, reuse it — it's the same key.

---

## Step 3 — Use it on the page

```tsx
import BookingForm from "@/components/BookingForm";

// clientId is the onboard_submissions.id UUID for this client
<BookingForm clientId="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
```

The `clientId` is the UUID from `onboard_submissions.id` in the Dorza Supabase database.
Find it in: Dorza admin dashboard → Submissions → expand the client row.

---

## How it works

1. User picks a date → the form calls the **availability** endpoint to get already-booked slots for that date.
2. Booked slots appear greyed out and crossed through; user picks from remaining slots.
3. On submit, the **booking-submit** edge function:
   - Checks for honeypot spam
   - Validates all fields
   - Inserts into the `bookings` table (unique constraint prevents double-booking)
   - Emails the **business owner** (looked up from `onboard_submissions.email` via `clientId`)
   - Emails the **customer** a confirmation
4. If a slot is taken between load and submit (race condition), the form shows "This time slot was just taken" and refreshes availability.

---

## Customisation notes

| What | How |
|---|---|
| Available time slots | Edit the `TIME_SLOTS` array at the top of the component |
| Slot duration | Change the array entries (e.g. remove `:30` slots for hourly bookings) |
| Weekend availability | Handled by date picker (no built-in day-of-week filtering) — add a disabled-days check in `handleDateChange` if needed |
| Colours | Replace `gray-900` / `gray-200` etc. with the client's palette tokens |
| Success message | Edit the `status === "success"` return block |

---

## Checklist

- [ ] `components/BookingForm.tsx` created
- [ ] `NEXT_PUBLIC_DORZA_BOOKING_SUBMIT_URL` added to `.env.local` and Vercel
- [ ] `NEXT_PUBLIC_DORZA_BOOKING_AVAILABILITY_URL` added to `.env.local` and Vercel
- [ ] `NEXT_PUBLIC_DORZA_ANON_KEY` added to `.env.local` and Vercel
- [ ] `<BookingForm clientId="..." />` placed on the booking/contact section
- [ ] Test: pick a date, confirm availability loads, submit a booking, verify both emails arrive
- [ ] Test: try booking the same slot twice — should show "time slot was just taken"
