const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string, now: number = Date.now()): boolean {
  const timestamps = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return true;
}
