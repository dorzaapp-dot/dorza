import { afterEach, describe, expect, it, vi } from "vitest";
import { submitEnquiry, SUBMIT_TIMEOUT_MS } from "@/lib/submitEnquiry";
import type { EnquiryFormData } from "@/lib/types";

const data: EnquiryFormData = {
  name: "Sam Lee",
  email: "sam@example.com",
  businessType: "Cafe/Restaurant",
  suburb: "Parramatta",
  servicesInterested: [],
  source: "modal",
  website: "",
};

afterEach(() => vi.useRealTimers());

describe("submitEnquiry", () => {
  it("returns ok when the server says success", async () => {
    const send = vi.fn().mockResolvedValue({ success: true });

    const result = await submitEnquiry(data, { endpoint: "https://x/enquiry-submit", send });

    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith("https://x/enquiry-submit", data);
  });

  it('maps { success: false } to "Something went wrong. Please try again."', async () => {
    const send = vi.fn().mockResolvedValue({ success: false });

    const result = await submitEnquiry(data, { endpoint: "https://x", send });

    expect(result).toEqual({ ok: false, error: "Something went wrong. Please try again." });
  });

  it('maps a thrown error to "Network error. Please try again."', async () => {
    const send = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    const result = await submitEnquiry(data, { endpoint: "https://x", send });

    expect(result).toEqual({ ok: false, error: "Network error. Please try again." });
  });

  it("gives up after the timeout with the timeout message", async () => {
    vi.useFakeTimers();
    const send = vi.fn(() => new Promise<{ success: boolean }>(() => {}));

    const pending = submitEnquiry(data, { endpoint: "https://x", send });
    await vi.advanceTimersByTimeAsync(SUBMIT_TIMEOUT_MS);

    expect(await pending).toEqual({
      ok: false,
      error: "This is taking longer than usual. We may already have your details, so check your inbox before trying again.",
    });
  });

  it("does not time out a request that answers in time", async () => {
    vi.useFakeTimers();
    const send = vi.fn(() => new Promise<{ success: boolean }>((r) => setTimeout(() => r({ success: true }), 1000)));

    const pending = submitEnquiry(data, { endpoint: "https://x", send });
    await vi.advanceTimersByTimeAsync(SUBMIT_TIMEOUT_MS);

    expect(await pending).toEqual({ ok: true });
  });

  it("reports a late success after the timeout so the visitor is not left with a false failure", async () => {
    vi.useFakeTimers();
    let answer!: (v: { success: boolean }) => void;
    const send = vi.fn(() => new Promise<{ success: boolean }>((r) => { answer = r; }));
    const onLateSuccess = vi.fn();

    const pending = submitEnquiry(data, { endpoint: "https://x", send, onLateSuccess });
    await vi.advanceTimersByTimeAsync(SUBMIT_TIMEOUT_MS);
    expect((await pending).ok).toBe(false);
    expect(onLateSuccess).not.toHaveBeenCalled();

    answer({ success: true });
    await vi.advanceTimersByTimeAsync(0);

    expect(onLateSuccess).toHaveBeenCalledTimes(1);
  });

  it("stays quiet when a request that already timed out later fails, or when it answers in time", async () => {
    vi.useFakeTimers();
    let fail!: (e: Error) => void;
    const slow = vi.fn(() => new Promise<{ success: boolean }>((_, rej) => { fail = rej; }));
    const lateFailure = vi.fn();
    const pending = submitEnquiry(data, { endpoint: "https://x", send: slow, onLateSuccess: lateFailure });
    await vi.advanceTimersByTimeAsync(SUBMIT_TIMEOUT_MS);
    await pending;
    fail(new Error("socket closed"));
    await vi.advanceTimersByTimeAsync(0);
    expect(lateFailure).not.toHaveBeenCalled();

    const inTime = vi.fn();
    const result = await submitEnquiry(data, {
      endpoint: "https://x",
      send: vi.fn().mockResolvedValue({ success: true }),
      onLateSuccess: inTime,
    });
    expect(result).toEqual({ ok: true });
    expect(inTime).not.toHaveBeenCalled();
  });

  it('a missing endpoint returns "Submission endpoint not configured." and never calls send', async () => {
    const send = vi.fn();

    const result = await submitEnquiry(data, { endpoint: undefined, send });

    expect(result).toEqual({ ok: false, error: "Submission endpoint not configured." });
    expect(send).not.toHaveBeenCalled();
  });
});
