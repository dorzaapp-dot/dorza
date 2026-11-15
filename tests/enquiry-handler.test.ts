import { describe, expect, it, vi } from "vitest";
import { handleEnquiry, type EnquiryDeps } from "../supabase/functions/enquiry-submit/handler";

const valid = { name: "Sam Lee", email: "Sam@Example.com", businessType: "Cafe", suburb: "Parramatta", source: "modal" };

function post(body: unknown): Request {
  return new Request("https://x/enquiry-submit", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function makeDeps(over: Partial<EnquiryDeps> = {}): EnquiryDeps {
  return {
    insertEnquiry: vi.fn().mockResolvedValue({ id: "id-1" }),
    sendEmail: vi.fn().mockResolvedValue(undefined),
    runInBackground: vi.fn(),
    adminEmail: "admin@dorza.test",
    log: { log: vi.fn(), error: vi.fn() },
    ...over,
  };
}

describe("handleEnquiry", () => {
  it("responds before the emails finish", async () => {
    const deps = makeDeps({ sendEmail: vi.fn(() => new Promise<void>(() => {})) });

    const res = await handleEnquiry(post(valid), deps);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, enquiryId: "id-1" });
    expect(deps.runInBackground).toHaveBeenCalledTimes(1);
  });

  it("waits for the emails when the runtime hands the task back instead of running it in the background", async () => {
    let finished = false;
    const deps = makeDeps({
      sendEmail: vi.fn(() => new Promise<void>((r) => setTimeout(() => { finished = true; r(); }, 20))),
      runInBackground: (task) => task.then(() => undefined),
    });

    await handleEnquiry(post(valid), deps);

    expect(finished).toBe(true);
  });

  it("sends the admin email and the confirmation without waiting for one another", async () => {
    const deps = makeDeps({ sendEmail: vi.fn(() => new Promise<void>(() => {})) });

    await handleEnquiry(post(valid), deps);

    const sent = (deps.sendEmail as ReturnType<typeof vi.fn>).mock.calls.map(([m]) => m);
    expect(sent).toHaveLength(2);
    expect(sent.map((m) => m.to)).toEqual(["admin@dorza.test", "sam@example.com"]);
    expect(sent[1].subject).toBe("You're on the list — Dorza");
  });

  it("a failing email leaves the response alone and logs the enquiry id", async () => {
    const deps = makeDeps({ sendEmail: vi.fn().mockRejectedValue(new Error("smtp down")) });

    const res = await handleEnquiry(post(valid), deps);
    await (deps.runInBackground as ReturnType<typeof vi.fn>).mock.calls[0][0];

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, enquiryId: "id-1" });
    const logged = (deps.log.error as ReturnType<typeof vi.fn>).mock.calls.flat().map(String).join(" ");
    expect(logged).toContain("id-1");
  });

  it("a filled honeypot returns success without saving or emailing", async () => {
    const deps = makeDeps();

    const res = await handleEnquiry(post({ ...valid, website: "bot" }), deps);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(deps.insertEnquiry).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["no name", { ...valid, name: "  " }],
    ["no email", { ...valid, email: "" }],
    ["an invalid email", { ...valid, email: "not-an-email" }],
  ])("%s returns 400 and saves nothing", async (_label, payload) => {
    const deps = makeDeps();

    const res = await handleEnquiry(post(payload), deps);

    expect(res.status).toBe(400);
    expect((await res.json()).success).toBe(false);
    expect(deps.insertEnquiry).not.toHaveBeenCalled();
  });

  it("a failed save returns 500 and sends no email", async () => {
    const deps = makeDeps({ insertEnquiry: vi.fn().mockRejectedValue(new Error("db down")) });

    const res = await handleEnquiry(post(valid), deps);

    expect(res.status).toBe(500);
    expect((await res.json()).success).toBe(false);
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(deps.runInBackground).not.toHaveBeenCalled();
  });

  it("escapes HTML from the visitor in the admin email", async () => {
    const deps = makeDeps();

    await handleEnquiry(post({ ...valid, name: "<script>x</script>", message: "<b>hi</b>" }), deps);

    const admin = (deps.sendEmail as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(admin.html).toContain("&lt;script&gt;");
    expect(admin.html).toContain("&lt;b&gt;hi&lt;/b&gt;");
    expect(admin.html).not.toContain("<script>");
  });

  it("OPTIONS answers 200 with CORS headers", async () => {
    const res = await handleEnquiry(new Request("https://x/enquiry-submit", { method: "OPTIONS" }), makeDeps());

    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("stores the visitor's details, with the source and services cleaned up", async () => {
    const deps = makeDeps();

    await handleEnquiry(
      post({ ...valid, source: "modal", message: "  Need a site  ", servicesInterested: ["Web design", "", 5] }),
      deps,
    );

    expect(deps.insertEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Sam Lee",
        email: "sam@example.com",
        business_type: "Cafe",
        suburb: "Parramatta",
        message: "Need a site",
        source: "modal",
        services_interested: ["Web design"],
      }),
    );
  });

  it('an unknown source is stored as "inline" and non-array services become []', async () => {
    const deps = makeDeps();

    await handleEnquiry(post({ ...valid, source: "hacker", servicesInterested: "Web design" }), deps);

    expect(deps.insertEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ source: "inline", services_interested: [] }),
    );
  });

  it("a malformed JSON body returns 400", async () => {
    const res = await handleEnquiry(post("{not json"), makeDeps());

    expect(res.status).toBe(400);
    expect((await res.json()).success).toBe(false);
  });
});
