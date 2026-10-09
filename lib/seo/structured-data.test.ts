import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BUSINESS } from "@/content/legal/business";
import { LOCALES } from "@/lib/i18n/locale";
import { SITE_URL } from "@/lib/seo/site";
import { landingGraph } from "@/lib/seo/structured-data";

describe("site identity for search engines", () => {
  it("identifies one domain-level website across all landing languages", () => {
    for (const locale of LOCALES) {
      const websites = landingGraph(locale)["@graph"].filter(
        (node) => node["@type"] === "WebSite",
      );
      expect(websites).toHaveLength(1);
      expect(websites[0]).toMatchObject({
        "@id": "https://petty.im/#website",
        name: "페티",
        alternateName: ["Petty"],
        url: "https://petty.im",
        inLanguage: ["ko-KR", "ja-JP", "en-US"],
      });
    }
  });
});

describe("landingGraph", () => {
  it.each(LOCALES)("publishes a square brand logo (%s)", (locale) => {
    const brand = landingGraph(locale)["@graph"].find(
      (node) => node["@type"] === "Brand",
    ) as { logo: string };
    const bytes = readFileSync(
      join(process.cwd(), "public", brand.logo.replace(SITE_URL, "")),
    );
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    // Google needs at least 112px; the old white-on-clear wordmark vanished there.
    expect(width).toBe(height);
    expect(width).toBeGreaterThanOrEqual(112);
  });

  it.each(LOCALES)("links the publisher, brand, and app as distinct entities (%s)", (locale) => {
    const graph = landingGraph(locale)["@graph"];
    const organization = graph.find((node) => node["@type"] === "Organization");
    const brand = graph.find((node) => node["@type"] === "Brand");
    const app = graph.find((node) => node["@type"] === "SoftwareApplication");
    const website = graph.find((node) => node["@type"] === "WebSite");

    expect(organization).toMatchObject({
      "@id": "https://petty.im/#organization",
      name: BUSINESS.name,
      legalName: BUSINESS.name,
      url: SITE_URL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BUSINESS.supportEmail,
      },
      brand: { "@id": "https://petty.im/#brand" },
    });
    expect(organization).not.toHaveProperty("sameAs");
    expect(brand).toMatchObject({
      "@id": "https://petty.im/#brand",
      name: "페티",
      alternateName: ["Petty"],
    });
    expect(app).toMatchObject({
      "@id": "https://petty.im/#app",
      name: "페티",
      url: "https://app.petty.im",
      publisher: { "@id": "https://petty.im/#organization" },
      brand: { "@id": "https://petty.im/#brand" },
    });
    expect(website).toMatchObject({
      publisher: { "@id": "https://petty.im/#organization" },
      about: { "@id": "https://petty.im/#app" },
    });

    // No public price, user reviews, or ratings are present to support these.
    expect(app).not.toHaveProperty("offers");
    expect(app).not.toHaveProperty("aggregateRating");
    expect(app).not.toHaveProperty("review");
  });

  it.each(LOCALES)("describes the localized canonical page and links its FAQ (%s)", (locale) => {
    const graph = landingGraph(locale)["@graph"];
    const page = graph.find((node) => node["@type"] === "WebPage");
    const faq = graph.find((node) => node["@type"] === "FAQPage");

    expect(page).toMatchObject({
      "@id": expect.stringMatching(/^https:\/\/petty\.im(?:\/en|\/ja)?#webpage$/),
      isPartOf: { "@id": "https://petty.im/#website" },
      mainEntity: { "@id": "https://petty.im/#app" },
      publisher: { "@id": "https://petty.im/#organization" },
    });
    expect(faq).toMatchObject({
      "@id": expect.stringMatching(/^https:\/\/petty\.im(?:\/en|\/ja)?#faq$/),
      isPartOf: { "@id": page?.["@id"] },
      inLanguage: expect.any(String),
    });
    expect(graph.every((node) => !Object.hasOwn(node, "@context"))).toBe(true);
  });
});
