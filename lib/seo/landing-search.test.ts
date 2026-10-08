import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locale";
import { landingSearchContent } from "@/content/landing-search";
import { landingGraph } from "./structured-data";

describe("landing search content", () => {
  it.each(LOCALES)("keeps the machine-readable FAQ equal to visible answers (%s)", (locale) => {
    const content = landingSearchContent[locale];
    const faq = landingGraph(locale)["@graph"].find((node) => node["@type"] === "FAQPage");
    expect(faq).toMatchObject({ mainEntity: content.faqs.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })) });
    expect(content.steps).toHaveLength(3);
  });
  it("uses translated answers instead of Korean fallback", () => {
    for (const locale of ["en", "ja"] as const) {
      expect(JSON.stringify(landingSearchContent[locale])).not.toMatch(/[가-힣]/);
    }
  });
});
