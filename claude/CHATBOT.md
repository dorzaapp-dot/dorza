# AI Chatbot — Client integration (Dorza central chat API)

This document describes the AI chatbot widget that any client site generated from Dorza can use. It extends the same central-Supabase hub pattern used by `BOOKING-CLIENT.md` and `CONTACT-US-CLIENT.md`.

## Goals
- Provide a conversational AI assistant on every client site that can answer business questions, check availability, and make bookings.
- Use Claude (Haiku 4.5) with tool use so the bot can query real-time data rather than relying on static FAQ.
- Reuse the existing `bookings` table and `booking-submit` edge function — no data model duplication.
- Ship a self-contained widget component and a Claude-code prompt so new sites are scaffolded quickly.

## High-level architecture

```
Customer ──► ChatWidget (client site)
                │
                │ POST /chat-respond
                │ { clientId, messages[] }
                ▼
        chat-respond Edge Function
                │
                ├─► Supabase: onboard_submissions (load business context)
                │
                ├─► Claude API (Haiku 4.5, with tools)
                │       │
                │       ├─ check_availability → query bookings table
                │       └─ create_booking ────► booking-submit Edge Function
                │
                └─► Response: { reply }
```

- **Frontend (client site):** `ChatWidget` component — floating bottom-right bubble, sends full conversation history to the edge function per message.
- **`chat-respond` Edge Function:** Loads business context from `onboard_submissions.state_json`, builds a system prompt, calls Claude API with tools, runs the tool-use loop server-side (max 5 rounds), returns the final text reply.
- **Tools execute against existing infrastructure:** `check_availability` queries the `bookings` table directly; `create_booking` calls `booking-submit` via internal HTTP to reuse validation + email logic.

## API design

### POST /chat-respond

**Request:**
```json
{
  "clientId": "uuid",
  "messages": [
    { "role": "user", "content": "Do you have any spots tomorrow?" },
    { "role": "assistant", "content": "Let me check..." },
    { "role": "user", "content": "Afternoon preferably" }
  ]
}
```

**Response:**
```json
{
  "reply": "Great news! Tomorrow afternoon we have spots at 1:00 PM, 1:30 PM, 2:00 PM, 2:30 PM, 3:00 PM, 3:30 PM, 4:00 PM, and 4:30 PM. Would you like to book one of these?"
}
```

**Error responses:**
| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "clientId is required." }` | Missing clientId |
| 400 | `{ "error": "messages array is required." }` | Empty/missing messages |
| 404 | `{ "error": "Unknown client." }` | clientId not in onboard_submissions |
| 429 | `{ "error": "Conversation limit reached..." }` | More than 40 messages (20 exchanges) |
| 503 | `{ "error": "Chat service not configured." }` | ANTHROPIC_API_KEY not set |

## Tool definitions

### check_availability
- **Input:** `{ date: "YYYY-MM-DD" }`
- **Executes:** Direct query on `bookings` table (same logic as `booking-availability` edge function)
- **Returns:** `{ date, available_slots: [{ time_24h, display }], fully_booked: bool }`
- **Validates:** Rejects past dates

### create_booking
- **Input:** `{ booking_date, booking_time, customer_name, customer_email, customer_phone?, message? }`
- **Executes:** Internal HTTP call to `booking-submit` edge function (reuses validation, DB insert, email delivery)
- **Returns:** `{ success: true, message }` or `{ success: false, error }` (including `SLOT_UNAVAILABLE`)

## System prompt

Built dynamically from `onboard_submissions.state_json` for each client:
- Business name, type, location (suburb)
- Services offered
- Differentiator
- Phone, email, opening hours
- Today's date (for relative date handling — "tomorrow", "next Monday")
- Available time slot range (9 AM – 5 PM, 30-min increments)

Guidelines instruct Claude to:
- Keep responses to 2–3 sentences
- Use tools for real-time data (never guess availability)
- Collect name + email before creating bookings
- Present times in 12-hour format
- Stay on-topic (only discuss this business)

## Conversation model

- **Stateless:** Full message history is sent with every request. No server-side session storage.
- **Rate limited:** 40 messages max per session (enforced both client-side and server-side).
- **Tool use is transparent:** Tool calls happen server-side within the edge function. The client only sees user/assistant text messages.
- **Cost model:** Each customer message = 1 Claude API call (possibly more if tools are invoked, up to 5 rounds). At Haiku 4.5 pricing ($1/$5 per MTok), typical conversations cost fractions of a cent.

## Frontend component

`components/ChatWidget.tsx` — self-contained, no Dorza internal dependencies.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `clientId` | `string` | *required* | The client's `onboard_submissions` UUID |
| `businessName` | `string` | `"us"` | Shown in header ("Chat with …") |
| `accentColor` | `string` | `"#D4845A"` | Brand colour for button, header, user bubbles |

**Env vars read by widget:**
- `NEXT_PUBLIC_DORZA_CHAT_URL` — chat-respond edge function URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Dorza anon key (auth header)

**Usage in a client site layout:**
```tsx
import ChatWidget from "@/components/ChatWidget";

<ChatWidget
  clientId="<onboard_submission_id>"
  businessName="Acme Barber"
  accentColor="#E8742A"
/>
```

## Test page

A demo page at `/demo/chatbot` lets you test the chatbot for any client without building a dedicated page.

**URL format:**
```
https://dorza.app/demo/chatbot?clientId=<uuid>&businessName=Acme%20Barber&accentColor=%23E8742A
```

- `clientId` must match a row in `onboard_submissions` — the edge function loads business context from `state_json`.
- `businessName` and `accentColor` are optional (defaults: "Demo Business", `#D4845A`).
- Shows suggested test prompts on the page.

**Source:** `app/demo/chatbot/page.tsx`

## Claude-code prompt (for scaffolded sites)

```
Add the AI chatbot widget for client `{{client_slug}}` (onboard_submissions id: `{{client_id}}`).
1. Copy `components/ChatWidget.tsx` from the Dorza project into the client site.
2. Import ChatWidget in `app/layout.tsx` and render it before the closing </body>:
    <ChatWidget
      clientId="{{client_id}}"
      businessName="{{business_name}}"
      accentColor="{{accent_color}}"
    />
3. Add to .env.local:
    NEXT_PUBLIC_DORZA_CHAT_URL=https://<ref>.supabase.co/functions/v1/chat-respond
    NEXT_PUBLIC_DORZA_ANON_KEY=<dorza-anon-key>
4. Match accentColor to the client's primary brand colour from intake.md.
```

## Environment variables

### Client site (.env.local + Vercel)
```
NEXT_PUBLIC_DORZA_CHAT_URL=https://<ref>.supabase.co/functions/v1/chat-respond
NEXT_PUBLIC_DORZA_ANON_KEY=<dorza-supabase-anon-key>
```

### Dorza project (.env.local + Vercel)
```
NEXT_PUBLIC_DORZA_CHAT_URL=https://<ref>.supabase.co/functions/v1/chat-respond
```
(Anon key is already set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Supabase secrets (edge function)
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```
This is the only new secret. `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` are already set from existing functions.

## Security

- **ANTHROPIC_API_KEY** is server-side only — stored as a Supabase secret, never exposed to the client.
- **Anon key** in the Authorization header gates access through Supabase's edge function gateway (same pattern as all other client-facing functions).
- **Rate limiting:** 40-message cap per session prevents abuse. Anthropic's own API rate limits provide a second layer.
- **No persistent storage:** Conversations are not stored. No PII beyond what's collected during booking (which goes through the existing booking-submit flow).
- **Tool execution:** `create_booking` calls `booking-submit` internally, inheriting all its validation (honeypot, email format, date/time format, slot uniqueness).

## Deployment checklist

1. **Set Anthropic API key** (one-time):
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```

2. **Deploy the edge function:**
   ```bash
   supabase functions deploy chat-respond
   ```

3. **Add env var to Dorza's Vercel project:**
   ```
   NEXT_PUBLIC_DORZA_CHAT_URL=https://<ref>.supabase.co/functions/v1/chat-respond
   ```
   Then redeploy (or it will pick up on the next push).

4. **Add to `.env.local`** for local dev:
   ```
   NEXT_PUBLIC_DORZA_CHAT_URL=https://<ref>.supabase.co/functions/v1/chat-respond
   ```

5. **Test with demo page:**
   ```
   http://localhost:3000/demo/chatbot?clientId=<a-real-client-uuid>
   ```
   Verify:
   - Chat bubble appears at bottom-right
   - "What services do you offer?" returns data from the client's intake
   - "Do you have availability tomorrow?" triggers the check_availability tool
   - Full booking flow works end-to-end (emails received)

6. **Deploy to Vercel** (push to trigger):
   ```bash
   git push
   ```

7. **For each client site**, follow the Claude-code prompt above or use `claude-for-clients/CHATBOT.md`.

## Future improvements

- **Streaming responses:** Proxy Claude's SSE stream through the edge function for real-time typing feel instead of waiting for the full response.
- **Conversation logging:** Store conversations in a `chat_sessions` table for analytics (popular questions, drop-off points, booking conversion rate).
- **Custom business hours per client:** Read operating hours from `state_json` to dynamically set available time slots instead of the hardcoded 9–5 range.
- **Cloudflare Turnstile:** Add CAPTCHA verification if chat abuse becomes a problem.
- **Model upgrade path:** Switch from Haiku to Sonnet/Opus for clients who need more nuanced conversation (configurable per client).
