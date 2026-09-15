import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locale";
import { SITE_URL } from "@/lib/seo/site";
import { landingGraph } from "@/lib/seo/structured-data";

describe("landingGraph", () => {
  it.each(LOCALES)("publishes a square logo Google can show (%s)", (locale) => {
    const organization = landingGraph(locale)["@graph"].find(
      (node) => node["@type"] === "Organization",
    ) as { logo: string };
    const bytes = readFileSync(
      join(process.cwd(), "public", organization.logo.replace(SITE_URL, "")),
    );
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    // Google needs at least 112px; the old white-on-clear wordmark vanished there.
    expect(width).toBe(height);
    expect(width).toBeGreaterThanOrEqual(112);
  });
});
