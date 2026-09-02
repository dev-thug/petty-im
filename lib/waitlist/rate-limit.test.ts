import { describe, expect, it } from "vitest";

import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit within the window", () => {
    const key = `test-key-${Math.random()}`;
    const now = 1_000_000;

    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit(key, now + i)).toBe(true);
    }
  });

  it("blocks the 6th request within the same window", () => {
    const key = `test-key-${Math.random()}`;
    const now = 2_000_000;

    for (let i = 0; i < 5; i += 1) {
      checkRateLimit(key, now + i);
    }

    expect(checkRateLimit(key, now + 5)).toBe(false);
  });

  it("allows requests again once the window has passed", () => {
    const key = `test-key-${Math.random()}`;
    const now = 3_000_000;

    for (let i = 0; i < 5; i += 1) {
      checkRateLimit(key, now + i);
    }
    expect(checkRateLimit(key, now + 5)).toBe(false);

    expect(checkRateLimit(key, now + 61_000)).toBe(true);
  });
});
