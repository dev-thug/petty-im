import { describe, expect, it } from "vitest";

import { waitlistRequestSchema } from "./schema";

describe("waitlistRequestSchema", () => {
  it("accepts a valid submission and normalizes the email", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "  New.User@Example.com  ",
      consent: true,
      honeypot: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("new.user@example.com");
    }
  });

  it("defaults honeypot to an empty string when omitted", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "user@example.com",
      consent: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.honeypot).toBe("");
    }
  });

  it("rejects a malformed email", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "not-an-email",
      consent: true,
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a submission without explicit consent", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "user@example.com",
      consent: false,
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an email longer than 254 characters", () => {
    const overlongLocalPart = "a".repeat(250);
    const result = waitlistRequestSchema.safeParse({
      email: `${overlongLocalPart}@example.com`,
      consent: true,
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a submission missing consent entirely", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "user@example.com",
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });
});
