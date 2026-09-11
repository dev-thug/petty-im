import { describe, expect, it } from "vitest";
import { COMPARISON_UPDATED_AT } from "@/content/comparisons";
import { LANDING_UPDATED_AT } from "@/content/landing-locales";
import { documentUpdatedAt } from "@/content/legal/business";
import { privacy } from "@/content/legal/privacy";
import { terms } from "@/content/legal/terms";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();
  const lastmod = (url: string) =>
    entries.find((entry) => entry.url === url)?.lastModified;

  it("lists each public page once, at its canonical apex URL", () => {
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain("https://petty.im");
    expect(urls.every((url) => url.startsWith("https://petty.im"))).toBe(true);
  });

  it("dates each page by its content, not by the build", () => {
    expect(lastmod("https://petty.im")).toBe(LANDING_UPDATED_AT);
    expect(lastmod("https://petty.im/ja")).toBe(LANDING_UPDATED_AT);
    expect(lastmod("https://petty.im/alternatives/zeta")).toBe(
      COMPARISON_UPDATED_AT,
    );
    expect(lastmod("https://petty.im/terms")).toBe(documentUpdatedAt(terms));
    expect(lastmod("https://petty.im/privacy")).toBe(
      documentUpdatedAt(privacy),
    );
    for (const entry of entries)
      expect(entry.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("leaves hreflang to the page head", () => {
    expect(entries.every((entry) => entry.alternates === undefined)).toBe(
      true,
    );
  });
});
