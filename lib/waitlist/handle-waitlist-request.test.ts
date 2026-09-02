import { describe, expect, it, vi } from "vitest";

import { createWaitlistHandler } from "./handle-waitlist-request";
import { DuplicateEmailError } from "./save-waitlist-entry";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("createWaitlistHandler", () => {
  it("saves a valid email and returns ok", async () => {
    const saveWaitlistEntry = vi.fn().mockResolvedValue(undefined);
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "new@example.com", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(saveWaitlistEntry).toHaveBeenCalledWith("new@example.com");
  });

  it("rejects an invalid email without calling saveWaitlistEntry", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "not-an-email", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid-request" });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("rejects a request missing consent", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "new@example.com", consent: false, honeypot: "" }),
    );

    expect(response.status).toBe(400);
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("returns 409 when saveWaitlistEntry reports a duplicate email", async () => {
    const saveWaitlistEntry = vi
      .fn()
      .mockRejectedValue(new DuplicateEmailError());
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "dup@example.com", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "duplicate-email" });
  });

  it("silently succeeds without saving when the honeypot field is filled", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({
        email: "bot@example.com",
        consent: true,
        honeypot: "i-am-a-bot",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => false,
    });

    const response = await handler(
      makeRequest({ email: "new@example.com", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(429);
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("derives the rate-limit key from the trusted trailing x-forwarded-for segment, not the client-controlled leading one", async () => {
    const saveWaitlistEntry = vi.fn().mockResolvedValue(undefined);
    const checkRateLimit = vi.fn().mockReturnValue(true);
    const handler = createWaitlistHandler({ saveWaitlistEntry, checkRateLimit });

    await handler(
      makeRequest(
        { email: "a@example.com", consent: true, honeypot: "" },
        { "x-forwarded-for": "1.2.3.4, 10.0.0.1" },
      ),
    );
    await handler(
      makeRequest(
        { email: "b@example.com", consent: true, honeypot: "" },
        { "x-forwarded-for": "9.9.9.9, 10.0.0.1" },
      ),
    );

    expect(checkRateLimit).toHaveBeenCalledTimes(2);
    const [firstKey] = checkRateLimit.mock.calls[0];
    const [secondKey] = checkRateLimit.mock.calls[1];
    expect(firstKey).toBe("10.0.0.1");
    expect(secondKey).toBe("10.0.0.1");
    expect(firstKey).toBe(secondKey);
  });

  it("prefers x-real-ip over x-forwarded-for when both are present", async () => {
    const saveWaitlistEntry = vi.fn().mockResolvedValue(undefined);
    const checkRateLimit = vi.fn().mockReturnValue(true);
    const handler = createWaitlistHandler({ saveWaitlistEntry, checkRateLimit });

    await handler(
      makeRequest(
        { email: "a@example.com", consent: true, honeypot: "" },
        { "x-real-ip": "203.0.113.5", "x-forwarded-for": "1.2.3.4, 10.0.0.1" },
      ),
    );

    expect(checkRateLimit).toHaveBeenCalledWith("203.0.113.5");
  });

  it("rethrows unexpected storage errors instead of swallowing them", async () => {
    const saveWaitlistEntry = vi.fn().mockRejectedValue(new Error("db down"));
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    await expect(
      handler(
        makeRequest({ email: "new@example.com", consent: true, honeypot: "" }),
      ),
    ).rejects.toThrow("db down");
  });
});
