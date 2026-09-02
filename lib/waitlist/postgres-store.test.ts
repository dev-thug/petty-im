import { describe, expect, it } from "vitest";

import type { Sql } from "./db";
import { createPostgresWaitlistStore } from "./postgres-store";
import { DuplicateEmailError } from "./save-waitlist-entry";

function createFakeSql(
  behavior: "success" | "duplicate" | "connection-error",
): Sql {
  const fn = async (
    _strings: TemplateStringsArray,
    ..._values: unknown[]
  ) => {
    if (behavior === "duplicate") {
      const error = new Error(
        'duplicate key value violates unique constraint "waitlist_entries_pkey"',
      );
      (error as { code?: string }).code = "23505";
      throw error;
    }

    if (behavior === "connection-error") {
      throw new Error("connection refused");
    }

    return [];
  };

  return fn as unknown as Sql;
}

describe("createPostgresWaitlistStore", () => {
  it("inserts the email without throwing on success", async () => {
    const store = createPostgresWaitlistStore(createFakeSql("success"));

    await expect(store.insert("new@example.com")).resolves.toBeUndefined();
  });

  it("throws DuplicateEmailError on a unique constraint violation", async () => {
    const store = createPostgresWaitlistStore(createFakeSql("duplicate"));

    await expect(store.insert("dup@example.com")).rejects.toBeInstanceOf(
      DuplicateEmailError,
    );
  });

  it("rethrows unrelated database errors as-is", async () => {
    const store = createPostgresWaitlistStore(
      createFakeSql("connection-error"),
    );

    await expect(store.insert("x@example.com")).rejects.toThrow(
      "connection refused",
    );
  });
});
