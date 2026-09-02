import type { WaitlistErrorCode } from "./error-code";
import { waitlistRequestSchema } from "./schema";
import { DuplicateEmailError, type SaveWaitlistEntry } from "./save-waitlist-entry";

export type WaitlistHandlerDeps = {
  saveWaitlistEntry: SaveWaitlistEntry;
  checkRateLimit: (key: string) => boolean;
};

function errorResponse(code: WaitlistErrorCode, status: number): Response {
  return Response.json({ error: code }, { status });
}

export function createWaitlistHandler({
  saveWaitlistEntry,
  checkRateLimit,
}: WaitlistHandlerDeps) {
  return async function handleWaitlistRequest(
    request: Request,
  ): Promise<Response> {
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return errorResponse("rate-limited", 429);
    }

    const body = await request.json().catch(() => null);
    const parsed = waitlistRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("invalid-request", 400);
    }

    if (parsed.data.honeypot.length > 0) {
      return Response.json({ ok: true });
    }

    try {
      await saveWaitlistEntry(parsed.data.email);
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        return errorResponse("duplicate-email", 409);
      }
      throw error;
    }

    return Response.json({ ok: true });
  };
}
