import { waitlistRequestSchema } from "./schema";
import { DuplicateEmailError, type SaveWaitlistEntry } from "./save-waitlist-entry";

export type WaitlistHandlerDeps = {
  saveWaitlistEntry: SaveWaitlistEntry;
  checkRateLimit: (key: string) => boolean;
};

export function createWaitlistHandler({
  saveWaitlistEntry,
  checkRateLimit,
}: WaitlistHandlerDeps) {
  return async function handleWaitlistRequest(
    request: Request,
  ): Promise<Response> {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    if (!checkRateLimit(ip)) {
      return Response.json({ error: "rate-limited" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = waitlistRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "invalid-request" }, { status: 400 });
    }

    if (parsed.data.honeypot.length > 0) {
      return Response.json({ ok: true });
    }

    try {
      await saveWaitlistEntry(parsed.data.email);
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        return Response.json({ error: "duplicate-email" }, { status: 409 });
      }
      throw error;
    }

    return Response.json({ ok: true });
  };
}
