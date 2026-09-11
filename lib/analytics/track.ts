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
  // Beacon so the hit survives the navigation most tracked clicks trigger.
  window.gtag("event", name, { ...params, transport_type: "beacon" });
}

export function track<E extends AnalyticsEventName>(
  name: E,
  params: AnalyticsEvents[E],
): void {
  sendEvent(name, params);
}
