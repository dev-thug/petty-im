import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getSql", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws a clear error when DATABASE_URL is not set", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const { getSql } = await import("./db");

    expect(() => getSql()).toThrow("DATABASE_URL");
  });
});
