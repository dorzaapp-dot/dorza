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
  submitEndpoint: string;
  availabilityEndpoint: string;
};

type Status = "idle" | "loading" | "submitting" | "success" | "error";

export default function BookingForm({ clientId, submitEndpoint, availabilityEndpoint }: Props) {
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
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""}`,
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
          // Re-fetch availability so the taken slot shows as greyed out.
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
        <div className="w-12 h-12 rounded-full bg-[#E8EFE9] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#6B8F71]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-[#1A1A2E] mb-2">Booking confirmed!</h3>
        <p className="text-[#555] text-sm leading-relaxed">
          A confirmation has been sent to <strong>{email}</strong>.<br />
          We&apos;ll see you on {formatDateLong(date)} at {formatTime(time)}.
        </p>
      </div>
    );
  }

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
        <label htmlFor="booking-date" className="block font-body text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Date <span className="text-[#D4845A]">*</span>
        </label>
        <input
          id="booking-date"
          type="date"
          min={today}
          value={date}
          onChange={handleDateChange}
          className={`w-full h-12 px-4 rounded-[8px] border bg-white font-body text-sm text-[#1A1A2E] outline-none transition-colors ${
            errors.date ? "border-red-400" : "border-[#F0EBE4] focus:border-[#D4845A]"
          }`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Time slots */}
      {date && (
        <div>
          <label className="block font-body text-sm font-semibold text-[#1A1A2E] mb-2">
            Time <span className="text-[#D4845A]">*</span>
          </label>
          {isLoadingSlots ? (
            <p className="text-sm text-[#888]">Loading available times…</p>
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
                    className={`h-9 px-3 rounded-full text-xs font-semibold font-body transition-all duration-200 ${
                      isBooked
                        ? "bg-[#F0EBE4] text-[#BBB] cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-[#D4845A] text-white shadow-sm"
                        : "bg-white border border-[#F0EBE4] text-[#1A1A2E] hover:border-[#D4845A] hover:text-[#D4845A]"
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
        <label htmlFor="booking-name" className="block font-body text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Name <span className="text-[#D4845A]">*</span>
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
          className={`w-full h-12 px-4 rounded-[8px] border bg-white font-body text-sm text-[#1A1A2E] placeholder:text-[#888] outline-none transition-colors ${
            errors.name ? "border-red-400" : "border-[#F0EBE4] focus:border-[#D4845A]"
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="booking-email" className="block font-body text-sm font-semibold text-[#1A1A2E] mb-1.5">
            Email <span className="text-[#D4845A]">*</span>
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
            className={`w-full h-12 px-4 rounded-[8px] border bg-white font-body text-sm text-[#1A1A2E] placeholder:text-[#888] outline-none transition-colors ${
              errors.email ? "border-red-400" : "border-[#F0EBE4] focus:border-[#D4845A]"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="booking-phone" className="block font-body text-sm font-semibold text-[#1A1A2E] mb-1.5">
            Phone
          </label>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="04xx xxx xxx"
            className="w-full h-12 px-4 rounded-[8px] border border-[#F0EBE4] bg-white font-body text-sm text-[#1A1A2E] placeholder:text-[#888] outline-none transition-colors focus:border-[#D4845A]"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="booking-message" className="block font-body text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Message <span className="text-[#888] font-normal">(optional)</span>
        </label>
        <textarea
          id="booking-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Anything we should know before your appointment?"
          className="w-full px-4 py-3 rounded-[8px] border border-[#F0EBE4] bg-white font-body text-sm text-[#1A1A2E] placeholder:text-[#888] outline-none transition-colors focus:border-[#D4845A] resize-none"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoadingSlots}
        className="w-full h-12 rounded-full bg-[#D4845A] hover:bg-[#B8673F] text-white font-body font-semibold text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isSubmitting ? "Booking…" : "Book appointment"}
      </button>
    </form>
  );
}
