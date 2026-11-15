# Enquiry Form Speed and Loading States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A visitor who submits the enquiry form sees a spinner, then a success screen within about 2 seconds, and a slow or failing email send can no longer turn a saved enquiry into an error.

**Architecture:** Move the edge function's request logic into a dependency-injected `handleEnquiry(req, deps)` so it can be tested in Vitest without Deno, and keep `index.ts` as thin wiring. Move the client's submit logic into a pure `submitEnquiry(data, deps)` with a timeout so it can be tested without React. Spinner and confirmation timing already exist in the working tree and keep their render test.

**Tech Stack:** Next.js 14 static export, React 18, Vitest (node environment, no jsdom), Playwright (already a dependency), Supabase Edge Functions (Deno), pnpm.

**Spec:** No separate spec. The requirements come from the 2026-11-15 production log timeline in this session: boot 33ms, DB insert 1.35s, admin email 7.66s, confirmation email 7.64s, platform shutdown at 16.3s, browser got 503 at 15.9s, while the enquiry row was saved. Requirements are restated under Global Constraints and in each task.

## Global Constraints

- Do not change `submitForm(endpoint, data)` in `lib/api.ts` (CLAUDE.md: many components call it).
- App is a static export: no Next.js API routes. Server logic lives only in `supabase/functions/`.
- Edge function conventions: `Deno.serve`, inline CORS const, `OPTIONS` short-circuit, service-role client, bracketed `[enquiry-submit]` log tags, `{ success: boolean }` JSON bodies.
- `enquiry-submit` is public: deploy with `--no-verify-jwt` or every enquiry gets a 401 (live function has `verify_jwt: false`).
- Production project is Dorza, ref `dehaljveiwfsqklickay`. Never edit an applied migration. No new migrations are needed by this plan.
- Existing user-facing strings stay exactly: `"Submission endpoint not configured."`, `"Something went wrong. Please try again."`, `"Network error. Please try again."`, `"Sending…"`.
- Client submit timeout: `15000` ms. Server-side duplicate window (Task 5 only): `60` seconds.
- Tests: `tests/*.test.ts`, Vitest node environment, no new dependencies. Run `pnpm test`; run `pnpm test:export` only against a build made without `NEXT_PUBLIC_SHOW_DRAFTS`.
- Conventional commits, one commit per task. Nothing is pushed or deployed without the user's explicit yes at Task 6.

## Review Focus

1. Email fails after the response is sent: the admin is never notified and the `enquiries` row is the only trace. Expect an error log carrying the enquiry id and an unchanged `200` response (Task 1 test 3).
2. A name or message containing HTML such as `<script>`: it must be escaped in the admin email, now that this code is being moved (Task 1 test 7).
3. Malformed or empty JSON body: expect `400 { success: false }`, not a `500` (Task 1 test 8).
4. Client timeout fires, then the slow request still succeeds: the visitor was told it failed and may resubmit, creating a duplicate. Mitigated by the timeout copy (Task 3 test 4) and, if approved, the duplicate guard (Task 5).
5. Enter pressed or the button double-clicked while sending: exactly one POST should reach the network (Task 4 browser check).

---

## Already in the working tree (uncommitted, not part of the TDD cycle below)

Written before this plan and covered only by `tests/submit-button.test.ts` (4 tests, passing) and the Playwright loop:

- `components/forms/SubmitButton.tsx`, `components/ui/Spinner.tsx`, wired into `WaitlistCTA.tsx` and `EnquiryModal.tsx`
- Confirmation transition shortened (form exit 0.12s, confirmation 0.2s), `role="status"` on both confirmations
- `vitest.config.ts`: `oxc: { jsx: { runtime: "automatic" } }`
- `supabase/functions/enquiry-submit/index.ts`: respond-then-background-emails and SMTP timing logs, **written without tests, never run**. Task 1 and 2 replace this with a tested version.

## Seams under test (confirm before any test is written)

| Seam | Public interface | Catches | Misses |
|---|---|---|---|
| S1 | `handleEnquiry(req: Request, deps: EnquiryDeps): Promise<Response>` in `supabase/functions/enquiry-submit/handler.ts` | reply before emails, email failure isolation, validation, honeypot, escaping, insert failure | real Gmail/SMTP timing, real DB, `EdgeRuntime.waitUntil` behaviour (checked by logs in Task 6) |
| S2 | `submitEnquiry(data, deps): Promise<SubmitResult>` in `lib/submitEnquiry.ts` | spinner-forever (timeout), error mapping, missing endpoint | React state wiring and rendering |
| S3 | `SubmitButton` rendered markup (exists) | spinner, disabled, aria-busy, reduced motion | real browser behaviour |
| S4 | Playwright script `scripts/check-enquiry-ui.mjs` against built `out/` | spinner visible mid-flight, confirmation lag, one POST on double submit | server behaviour |

---

### Task 1: Tested request handler (S1)

**Files:**
- Create: `supabase/functions/enquiry-submit/handler.ts`
- Test: `tests/enquiry-handler.test.ts`

**Interfaces:**
- Produces:
  - `type EnquiryRow = { name: string; email: string; business_type: string | null; suburb: string | null; services_interested: string[]; message: string | null; source: "inline" | "modal"; state_json: unknown }`
  - `type EnquiryDeps = { insertEnquiry(row: EnquiryRow): Promise<{ id: string }>; sendEmail(msg: { to: string; subject: string; html: string }): Promise<void>; runInBackground(task: Promise<unknown>): void | Promise<void>; adminEmail: string; log: Pick<Console, "log" | "error"> }`
  - `handleEnquiry(req: Request, deps: EnquiryDeps): Promise<Response>`
- The module imports nothing from Deno or URLs. CORS headers and `escapeHtml` move here unchanged.

Work in vertical slices: one test, watch it fail, minimal code, watch it pass, next test. Each test builds the request with `new Request("https://x/enquiry-submit", { method: "POST", body: JSON.stringify(payload) })` and fake deps from `vi.fn()`.

- [ ] **Step 1: Test 1 `responds before the emails finish`.** `sendEmail` returns a promise that never resolves; `runInBackground` is `vi.fn()`. Assert `res.status === 200`, body `{ success: true, enquiryId: "id-1" }`, and `runInBackground` was called once. Run `pnpm vitest run tests/enquiry-handler.test.ts`; expect FAIL (module missing). Implement the minimal `handleEnquiry` (validate, insert, build both emails, call `deps.runInBackground`, respond). Expect PASS.
- [ ] **Step 2: Test 2 `sends the admin email and the confirmation without waiting for one another`.** Both `sendEmail` calls are made before either resolves; recipients are `deps.adminEmail` and the lowercased visitor email; confirmation subject is `"You're on the list — Dorza"`. Fail, implement (`Promise.allSettled([...])` passed to `runInBackground`), pass.
- [ ] **Step 3: Test 3 `a failing email leaves the response alone and logs the enquiry id`.** `sendEmail` rejects; capture the task given to `runInBackground` and await it; response was `200`; `log.error` was called with a message containing `id-1`. Fail, implement, pass.
- [ ] **Step 4: Test 4 `a filled honeypot returns success without saving or emailing`.** `website: "bot"`; `insertEnquiry` and `sendEmail` not called; `200 { success: true }`. Fail, implement, pass.
- [ ] **Step 5: Test 5 `missing name or email, or an invalid email, returns 400 and saves nothing`.** Three payloads; each `400` with `success: false`. Fail, implement, pass.
- [ ] **Step 6: Test 6 `a failed save returns 500 and sends no email`.** `insertEnquiry` rejects; `500 { success: false }`; `sendEmail` not called. Fail, implement, pass.
- [ ] **Step 7: Test 7 `escapes HTML from the visitor in the admin email`.** `name: "<script>x</script>"`; the admin `html` argument contains `&lt;script&gt;` and not `<script>`. Fail, implement, pass.
- [ ] **Step 8: Test 8 `a malformed JSON body returns 400`.** Body `"{not json"`; `400`, not `500`. Fail, implement, pass.
- [ ] **Step 9: Test 9 `OPTIONS answers 200 with CORS headers`, and test 10 `an unknown source is stored as "inline" and non-array servicesInterested becomes []`.** Fail, implement, pass.
- [ ] **Step 10: Run the full suite.** `pnpm test`; expect all green (123 existing plus the new tests).
- [ ] **Step 11: Commit.** `git add supabase/functions/enquiry-submit/handler.ts tests/enquiry-handler.test.ts && git commit -m "feat: tested enquiry handler that replies before emails"`

### Task 2: Thin edge function wiring

**Files:**
- Modify: `supabase/functions/enquiry-submit/index.ts` (replace the current handler body)

**Interfaces:**
- Consumes: `handleEnquiry`, `EnquiryDeps` from Task 1.

- [ ] **Step 1: Rewrite `index.ts`** to build the deps and call `Deno.serve((req) => handleEnquiry(req, deps))`. `insertEnquiry` uses the service-role Supabase client (`.insert(row).select("id").single()`); `sendEmail` keeps the denomailer client and the `smtp timing — send= close= total=` log from the current file; `runInBackground` calls `EdgeRuntime.waitUntil(task)` when `EdgeRuntime` exists and otherwise returns the task so the handler awaits it; `adminEmail` is `ADMIN_NOTIFICATION_EMAIL` with the `dorza.app@gmail.com` fallback.
- [ ] **Step 2: Verify it parses.** Run the TypeScript `transpileModule` syntax check on `index.ts` and `handler.ts`; expect `0` diagnostics. (No Deno here, so runtime behaviour is verified in Task 6.)
- [ ] **Step 3: Commit.** `git commit -am "fix: enquiry-submit replies after save and sends emails in the background"`

### Task 3: Tested client submit with a timeout (S2)

**Files:**
- Create: `lib/submitEnquiry.ts`
- Modify: `lib/useEnquirySubmit.ts` (call `submitEnquiry`, keep its public shape `{ submitting, submitted, error, submit, reset }`)
- Test: `tests/submit-enquiry.test.ts`

**Interfaces:**
- Produces:
  - `export const SUBMIT_TIMEOUT_MS = 15000`
  - `export type SubmitResult = { ok: true } | { ok: false; error: string }`
  - `export function submitEnquiry(data: EnquiryFormData, deps: { endpoint: string | undefined; send: (endpoint: string, data: Record<string, unknown>) => Promise<{ success: boolean }>; timeoutMs?: number }): Promise<SubmitResult>`

- [ ] **Step 1: Test 1 `returns ok when the server says success`.** Fail, implement, pass.
- [ ] **Step 2: Test 2 `maps { success: false } to "Something went wrong. Please try again."` and test 3 `maps a thrown error to "Network error. Please try again."`.** Fail, implement, pass each.
- [ ] **Step 3: Test 4 `gives up after timeoutMs with the timeout message`.** `vi.useFakeTimers()`; `send` never resolves; advance `15000`; expect `{ ok: false, error: TIMEOUT_MESSAGE }` where the message is `"This is taking longer than usual. We may already have your details, so check your inbox before trying again."` Fail, implement with `Promise.race`, pass.
- [ ] **Step 4: Test 5 `a missing endpoint returns "Submission endpoint not configured." and never calls send`.** Fail, implement, pass.
- [ ] **Step 5: Wire the hook.** `useEnquirySubmit.submit` calls `submitEnquiry(data, { endpoint: process.env.NEXT_PUBLIC_ENQUIRY_SUBMIT_URL, send: submitForm })` and maps the result onto its existing state. Run `pnpm test` and `pnpm lint` (no new warnings in touched files).
- [ ] **Step 6: Commit.** `git add lib/submitEnquiry.ts lib/useEnquirySubmit.ts tests/submit-enquiry.test.ts && git commit -m "feat: enquiry submit times out instead of spinning forever"`

### Task 4: Browser check kept in the repo (S4)

**Files:**
- Create: `scripts/check-enquiry-ui.mjs` (promote the scratchpad loop; serves `out/`, stubs the endpoint with a fixed delay)
- Modify: `package.json` (add `"check:enquiry": "node scripts/check-enquiry-ui.mjs"`)

- [ ] **Step 1: Port the loop** so it asserts: button disabled, spinner present, `aria-busy="true"` and a live region mid-flight; confirmation visible within `300` ms of the response; and pressing Enter in a field twice plus clicking the button during sending produces exactly **one** POST. Set the confirmation threshold to 300 ms (measured floor is about 250 ms with the 120 ms exit and 200 ms entrance).
- [ ] **Step 2: Run it** after `pnpm build` (without `NEXT_PUBLIC_SHOW_DRAFTS`): `pnpm check:enquiry`; expect all lines `PASS`, exit code 0. If the double-submit check fails, add an in-flight guard to `useEnquirySubmit.submit` and re-run.
- [ ] **Step 3: Commit.** `git add scripts/check-enquiry-ui.mjs package.json && git commit -m "chore: keep the enquiry form browser check in the repo"`

### Task 5 (optional, needs the user's yes): duplicate guard

**Files:**
- Modify: `supabase/functions/enquiry-submit/handler.ts`, `supabase/functions/enquiry-submit/index.ts`, `tests/enquiry-handler.test.ts`

**Interfaces:**
- Consumes: `EnquiryDeps` from Task 1. Adds `findRecentEnquiry(email: string, sinceIso: string): Promise<{ id: string } | null>` to `EnquiryDeps`.

- [ ] **Step 1: Test `a repeat enquiry from the same email within 60 seconds returns the first id without saving or emailing again`.** `findRecentEnquiry` resolves `{ id: "id-0" }`; expect `200 { success: true, enquiryId: "id-0" }`, `insertEnquiry` and `sendEmail` not called. Fail, implement, pass.
- [ ] **Step 2: Wire `findRecentEnquiry` in `index.ts`** with a `created_at >= since` query on `enquiries` by `email`. Syntax check, `pnpm test`.
- [ ] **Step 3: Commit.** `git commit -am "feat: ignore duplicate enquiries within 60 seconds"`

### Task 6: Release (user confirms each action)

- [ ] **Step 1: Deploy the function** (needs the user's explicit yes): `supabase functions deploy enquiry-submit --project-ref dehaljveiwfsqklickay --no-verify-jwt --yes`. Verify with `supabase functions list --project-ref dehaljveiwfsqklickay`: version 7, `verify_jwt: false`. Send one honeypot POST; expect `200` in under a second.
- [ ] **Step 2: One real submission** made by the user from the live site. Read `supabase logs --remote=dehaljveiwfsqklickay --service functions --since 1h`. Expect the POST to return `200` with `exec_ms` under `2000`, an `smtp timing` line per email after the response, and `emails settled`. Record where the 7.6 s goes (send or close).
- [ ] **Step 3: Push the frontend** (needs the user's yes): `pnpm test`, `pnpm build`, `pnpm test:export`, then `git push origin master` and `git push origin master:main`. Vercel deploys after the function, so the spinner never waits on the old slow function.
- [ ] **Step 4: Rollback if needed.** `git show 11fad9c:supabase/functions/enquiry-submit/index.ts` restores v6 logic for a redeploy.

---

## Self-review

- **Spec coverage:** reply-before-email (Tasks 1, 2), spinner and confirmation (already built, S3 and Task 4), timeout (Task 3), duplicate protection (Task 5), deploy and verification against logs (Task 6). The unexplained 7.6 s per email has a timing log and a check in Task 6; it has no fix yet by design.
- **Type consistency:** `EnquiryDeps`, `EnquiryRow`, `SubmitResult` and `SUBMIT_TIMEOUT_MS` are defined once and referenced by the same names in later tasks.
- **Proportion:** tests are named with their assertions; bodies are left to the implementer.
