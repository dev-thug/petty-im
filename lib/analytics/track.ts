import type { AnalyticsEventName, AnalyticsEvents } from "./events";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Untyped send for events already validated elsewhere (see `eventFromDataset`). */
export function sendEvent(
  name: string,
  params: Readonly<Record<string, string | undefined>>,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  // No transport_type: GA4 already sends with keepalive and flushes on pagehide,
  // and it forwards that field as a junk `ep.transport_type` parameter.
  window.gtag("event", name, params);
}

export function track<E extends AnalyticsEventName>(
  name: E,
  params: AnalyticsEvents[E],
): void {
  sendEvent(name, params);
}
