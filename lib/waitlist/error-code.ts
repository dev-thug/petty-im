export type WaitlistErrorCode =
  | "invalid-request"
  | "duplicate-email"
  | "rate-limited"
  | "network"
  | "unknown";

const KNOWN_SERVER_ERROR_CODES: readonly WaitlistErrorCode[] = [
  "invalid-request",
  "duplicate-email",
  "rate-limited",
];

export function toWaitlistErrorCode(
  value: string | undefined,
): WaitlistErrorCode {
  if (KNOWN_SERVER_ERROR_CODES.includes(value as WaitlistErrorCode)) {
    return value as WaitlistErrorCode;
  }
  return "unknown";
}
