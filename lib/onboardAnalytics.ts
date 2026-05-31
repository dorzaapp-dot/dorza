import { track } from "@vercel/analytics";

export type OnboardEvent =
  | "onboard_start"
  | "onboard_resume"
  | "onboard_step_view"
  | "onboard_step_next"
  | "onboard_step_back"
  | "onboard_submit_attempt"
  | "onboard_submit_success"
  | "onboard_submit_error"
  | "onboard_abandon";

export function trackOnboard(
  event: OnboardEvent,
  props?: Record<string, string | number | boolean>,
): void {
  try {
    track(event, props);
  } catch {
    /* analytics not active (e.g. dev) — no-op */
  }
}
