import { getSql } from "@/lib/waitlist/db";
import { createWaitlistHandler } from "@/lib/waitlist/handle-waitlist-request";
import { createPostgresWaitlistStore } from "@/lib/waitlist/postgres-store";
import { checkRateLimit } from "@/lib/waitlist/rate-limit";
import { createSaveWaitlistEntry } from "@/lib/waitlist/save-waitlist-entry";

export async function POST(request: Request): Promise<Response> {
  const store = createPostgresWaitlistStore(getSql());
  const handler = createWaitlistHandler({
    saveWaitlistEntry: createSaveWaitlistEntry(store),
    checkRateLimit,
  });

  return handler(request);
}
