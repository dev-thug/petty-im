import { afterEach, describe, expect, it, vi } from "vitest";
import {
  eventFromDataset,
  gaMeasurementId,
  sectionAttributes,
  trackingAttributes,
} from "./events";

/** What the browser exposes as `element.dataset` for the given attributes. */
function toDataset(attributes: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(attributes).map(([name, value]) => [
      name
        .slice("data-".length)
        .replace(/-([a-z])/g, (_, char: string) => char.toUpperCase()),
      value,
    ]),
  );
}

describe("gaMeasurementId", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a well-formed GA4 id and trims surrounding whitespace", () => {
    expect(gaMeasurementId("G-ABC123XYZ")).toBe("G-ABC123XYZ");
    expect(gaMeasurementId("  G-ABC123XYZ\n")).toBe("G-ABC123XYZ");
  });

  it("reads NEXT_PUBLIC_GA_MEASUREMENT_ID when no value is passed", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-ENV12345");
    expect(gaMeasurementId()).toBe("G-ENV12345");
  });

  it("treats a missing or empty id as unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", undefined);
    expect(gaMeasurementId()).toBeNull();
    expect(gaMeasurementId(undefined)).toBeNull();
    expect(gaMeasurementId("")).toBeNull();
    expect(gaMeasurementId("   ")).toBeNull();
  });

  it("rejects anything that is not a GA4 id, since it lands in an inline script", () => {
    expect(gaMeasurementId("UA-123")).toBeNull();
    expect(gaMeasurementId("G-abc123")).toBeNull();
    expect(gaMeasurementId("G-ABC")).toBeNull();
    expect(gaMeasurementId("G-X'); alert(1)//")).toBeNull();
    expect(gaMeasurementId('G-ABC123"</script>')).toBeNull();
  });
});

describe("trackingAttributes", () => {
  it("turns parameter names into kebab-case data attributes", () => {
    expect(trackingAttributes("open_app_click", { cta_location: "hero" })).toEqual(
      {
        "data-ga-event": "open_app_click",
        "data-ga-cta-location": "hero",
      },
    );
    expect(
      trackingAttributes("open_app_click", {
        cta_location: "character_dialog",
        character_id: "seoha",
      }),
    ).toEqual({
      "data-ga-event": "open_app_click",
      "data-ga-cta-location": "character_dialog",
      "data-ga-character-id": "seoha",
    });
  });

  it("omits parameters that are undefined", () => {
    expect(
      trackingAttributes("open_app_click", {
        cta_location: "header",
        character_id: undefined,
      }),
    ).toEqual({
      "data-ga-event": "open_app_click",
      "data-ga-cta-location": "header",
    });
  });

  it("marks sections with a single data attribute", () => {
    expect(sectionAttributes("features")).toEqual({
      "data-ga-section": "features",
    });
  });
});

describe("eventFromDataset", () => {
  it("round-trips what trackingAttributes put on the element", () => {
    expect(
      eventFromDataset(
        toDataset(
          trackingAttributes("open_app_click", {
            cta_location: "character_dialog",
            character_id: "seoha",
          }),
        ),
      ),
    ).toEqual({
      name: "open_app_click",
      params: { cta_location: "character_dialog", character_id: "seoha" },
    });
    expect(
      eventFromDataset(
        toDataset(
          trackingAttributes("select_content", {
            content_type: "character",
            content_id: "ian",
          }),
        ),
      ),
    ).toEqual({
      name: "select_content",
      params: { content_type: "character", content_id: "ian" },
    });
  });

  it("returns null for unknown or missing event names", () => {
    expect(
      eventFromDataset({ gaEvent: "purchase", gaCtaLocation: "hero" }),
    ).toBeNull();
    expect(eventFromDataset({ gaCtaLocation: "hero" })).toBeNull();
    expect(eventFromDataset({})).toBeNull();
  });

  it("ignores dataset keys that are not ga parameters, like Radix's data-state", () => {
    expect(
      eventFromDataset({
        ...toDataset(
          trackingAttributes("select_content", {
            content_type: "character",
            content_id: "yuri",
          }),
        ),
        state: "closed",
        gallery: "main",
        ga: "bare",
      }),
    ).toEqual({
      name: "select_content",
      params: { content_type: "character", content_id: "yuri" },
    });
  });
});
