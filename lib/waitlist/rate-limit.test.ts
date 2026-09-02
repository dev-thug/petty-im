import { describe, expect, it } from "vitest";

import {
  __getTrackedKeyCountForTesting,
  __resetRateLimitForTesting,
  __setMaxTrackedKeysForTesting,
  checkRateLimit,
} from "./rate-limit";

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

  it("evicts keys whose timestamps have all expired once the tracked-key threshold is exceeded", () => {
    __resetRateLimitForTesting();
    __setMaxTrackedKeysForTesting(5);

    try {
      const now = 10_000_000;

      // Fill the tracker up to the (lowered) threshold with keys that will
      // have fully expired by the time we look again.
      for (let i = 0; i < 5; i += 1) {
        checkRateLimit(`expiring-key-${i}`, now);
      }
      expect(__getTrackedKeyCountForTesting()).toBe(5);

      const later = now + 61_000; // past the rate-limit window

      // Size is still at (not above) the threshold, so this call does not
      // yet trigger a sweep — it just pushes size past the threshold.
      checkRateLimit("fresh-key-1", later);
      expect(__getTrackedKeyCountForTesting()).toBe(6);

      // Size (6) now exceeds the threshold (5), so this call sweeps first.
      // All 5 "expiring-key-*" entries are fully outside the window and get
      // dropped; "fresh-key-1" is still live and survives; this call's own
      // key is then added.
      checkRateLimit("fresh-key-2", later + 1);

      expect(__getTrackedKeyCountForTesting()).toBe(2);
    } finally {
      __resetRateLimitForTesting();
    }
  });
});
