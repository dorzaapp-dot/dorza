import type { EnquiryFormData } from "@/lib/types";

export const SUBMIT_TIMEOUT_MS = 15000;

const TIMEOUT_MESSAGE =
  "This is taking longer than usual. We may already have your details, so check your inbox before trying again.";

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitEnquiry(
  data: EnquiryFormData,
  deps: {
    endpoint: string | undefined;
    send: (endpoint: string, data: Record<string, unknown>) => Promise<{ success: boolean }>;
    timeoutMs?: number;
  },
): Promise<SubmitResult> {
  if (!deps.endpoint) return { ok: false, error: "Submission endpoint not configured." };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timer = setTimeout(() => resolve("timeout"), deps.timeoutMs ?? SUBMIT_TIMEOUT_MS);
  });

  try {
    const outcome = await Promise.race([deps.send(deps.endpoint, data as unknown as Record<string, unknown>), timeout]);
    if (outcome === "timeout") return { ok: false, error: TIMEOUT_MESSAGE };
    return outcome.success ? { ok: true } : { ok: false, error: "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  } finally {
    clearTimeout(timer);
  }
}
