const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const DEFAULT_MAX_TRACKED_KEYS = 10_000;

const requestLog = new Map<string, number[]>();

// Mutable only so tests can exercise the eviction sweep without inserting
// tens of thousands of keys. Production code always starts at (and, outside
// of tests, stays at) DEFAULT_MAX_TRACKED_KEYS.
let maxTrackedKeys = DEFAULT_MAX_TRACKED_KEYS;

function sweepExpiredKeys(now: number): void {
  for (const [key, timestamps] of requestLog) {
    const hasLiveEntry = timestamps.some(
      (timestamp) => now - timestamp < WINDOW_MS,
    );
    if (!hasLiveEntry) {
      requestLog.delete(key);
    }
  }
}

export function checkRateLimit(key: string, now: number = Date.now()): boolean {
  if (requestLog.size > maxTrackedKeys) {
    sweepExpiredKeys(now);
  }

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

// Testing-only helpers. Not used by any production code path.
export function __getTrackedKeyCountForTesting(): number {
  return requestLog.size;
}

export function __setMaxTrackedKeysForTesting(value: number): void {
  maxTrackedKeys = value;
}

export function __resetRateLimitForTesting(): void {
  requestLog.clear();
  maxTrackedKeys = DEFAULT_MAX_TRACKED_KEYS;
}
