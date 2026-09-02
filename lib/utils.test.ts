import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("keeps the later Tailwind class when two utilities from the same group conflict", () => {
    expect(cn("text-body", "text-display")).toBe("text-display");
  });

  it("resolves conflicts in the custom rounded scale", () => {
    expect(cn("rounded-field", "rounded-card")).toBe("rounded-card");
  });

  it("merges unrelated classes without dropping either", () => {
    expect(cn("flex", "gap-2")).toBe("flex gap-2");
  });
});
