import type { Locale } from "@/lib/i18n/locale";

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,20}$/;

/** GA4 measurement id, or null when unset. The id is interpolated into an inline
 * script, so anything that is not a well-formed id is treated as unset. */
export function gaMeasurementId(
  value: string | undefined = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
): string | null {
  const id = value?.trim();
  return id && MEASUREMENT_ID.test(id) ? id : null;
}

export type CtaLocation =
  | "header"
  | "hero"
  | "character_dialog"
  | "character_more"
  | "download"
  | "download_qr"
  | "comparison_header"
  | "comparison_cta"
  | "hub_header"
  | "hub_cta"
  | "legal_header";

/** Every event the site sends, with its parameters. */
export type AnalyticsEvents = {
  /** Key conversion: any link to app.petty.im. */
  open_app_click: { cta_location: CtaLocation; character_id?: string };
  store_badge_click: {
    store: "app_store" | "google_play";
    cta_location: "hero" | "download";
  };
  /** GA4 recommended event: a character card was opened. */
  select_content: { content_type: "character"; content_id: string };
  navigation_click: {
    nav_location: "header" | "footer" | "hero" | "toc" | "related";
    nav_item: string;
  };
  contact_click: {
    cta_location:
      | "footer"
      | "legal_contact"
      | "legal_footer"
      | "comparison_footer"
      | "hub_footer";
  };
  language_change: { from_locale: Locale; to_locale: Locale };
  menu_toggle: { menu_state: "open" | "close" };
  section_view: { section_id: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

// A record rather than a bare list so the compiler rejects both a missing and
// an unknown name whenever the catalogue changes.
const EVENT_NAMES: Record<AnalyticsEventName, true> = {
  open_app_click: true,
  store_badge_click: true,
  select_content: true,
  navigation_click: true,
  contact_click: true,
  language_change: true,
  menu_toggle: true,
  section_view: true,
};

export const ANALYTICS_EVENT_NAMES = Object.keys(
  EVENT_NAMES,
) as AnalyticsEventName[];

function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return (
    typeof value === "string" &&
    ANALYTICS_EVENT_NAMES.some((name) => name === value)
  );
}

// Keyed by a pattern so spreading onto an element never collides with its
// typed props such as href or onClick.
export type TrackingAttributes = Record<`data-ga-${string}`, string>;

/** Data attributes that make an element report `event` when clicked. Plain
 * attributes, so server components get tracking without becoming client code. */
export function trackingAttributes<E extends AnalyticsEventName>(
  event: E,
  params: AnalyticsEvents[E],
): TrackingAttributes {
  const attributes: TrackingAttributes = { "data-ga-event": event };
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    attributes[`data-ga-${key.replaceAll("_", "-")}`] = String(value);
  }
  return attributes;
}

/** Reverses `trackingAttributes` from an element's dataset. Only catalogue
 * events pass, and only `data-ga-*` keys become parameters. */
export function eventFromDataset(
  dataset: Readonly<Record<string, string | undefined>>,
): { name: AnalyticsEventName; params: Record<string, string> } | null {
  const name = dataset.gaEvent;
  if (!isAnalyticsEventName(name)) return null;
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(dataset)) {
    if (key === "gaEvent" || value === undefined || !/^ga[A-Z]/.test(key)) {
      continue;
    }
    const param = key
      .slice(2)
      .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
      .slice(1);
    params[param] = value;
  }
  return { name, params };
}

export const SECTION_ATTRIBUTE = "data-ga-section";

/** Marks a section for a one-time `section_view` when it reaches mid-screen. */
export function sectionAttributes(id: string) {
  return { [SECTION_ATTRIBUTE]: id };
}
