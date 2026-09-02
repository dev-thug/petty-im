import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

let cached: Sql | undefined;

export function getSql(): Sql {
  if (!cached) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }
    cached = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      prepare: false,
    });
  }
  return cached;
}
