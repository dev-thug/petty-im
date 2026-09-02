import { describe, expect, it } from "vitest";

import { toWaitlistErrorCode } from "./error-code";

describe("toWaitlistErrorCode", () => {
  it("returns known server error codes as-is", () => {
    expect(toWaitlistErrorCode("duplicate-email")).toBe("duplicate-email");
    expect(toWaitlistErrorCode("invalid-request")).toBe("invalid-request");
    expect(toWaitlistErrorCode("rate-limited")).toBe("rate-limited");
  });

  it("falls back to unknown for unrecognized or missing codes", () => {
    expect(toWaitlistErrorCode("something-else")).toBe("unknown");
    expect(toWaitlistErrorCode(undefined)).toBe("unknown");
  });
});
