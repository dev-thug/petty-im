import type { Sql } from "./db";
import { DuplicateEmailError, type WaitlistStore } from "./save-waitlist-entry";

const POSTGRES_UNIQUE_VIOLATION = "23505";

export function createPostgresWaitlistStore(sql: Sql): WaitlistStore {
  return {
    async insert(email: string) {
      try {
        await sql`INSERT INTO waitlist_entries (email) VALUES (${email})`;
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new DuplicateEmailError();
        }
        throw error;
      }
    },
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === POSTGRES_UNIQUE_VIOLATION
  );
}
