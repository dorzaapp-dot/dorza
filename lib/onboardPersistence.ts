import type { OnboardState } from "./types";

const KEY = "dorza:onboard:draft:v1";

export type OnboardPhase = "welcome" | "wizard" | "submitted";

export interface OnboardDraft {
  state: OnboardState;
  step: number;
  phase: OnboardPhase;
  savedAt: string; // ISO timestamp
}

export function loadDraft(): OnboardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardDraft;
    if (!parsed || typeof parsed !== "object" || !parsed.state) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(draft: OnboardDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage full or disabled — fail silently */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
