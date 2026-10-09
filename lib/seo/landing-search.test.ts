import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locale";
import { landingSearchContent } from "@/content/landing-search";
import { landingLocales } from "@/content/landing-locales";
import { HREFLANG } from "@/lib/seo/site";
import { landingGraph } from "./structured-data";

describe("landing search content", () => {
  it.each(LOCALES)(
    "keeps page identity and FAQs aligned with the localized content (%s)",
    (locale) => {
      const content = landingSearchContent[locale];
      const graph = landingGraph(locale)["@graph"];
      const page = graph.find((node) => node["@type"] === "WebPage");
      const faq = graph.find((node) => node["@type"] === "FAQPage");

      expect(page).toMatchObject({
        name: landingLocales[locale].META.title,
        description: landingLocales[locale].META.description,
        inLanguage: HREFLANG[locale],
        mainEntity: { "@id": "https://petty.im/#app" },
      });
      expect(faq).toMatchObject({
        mainEntity: content.faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      });
      expect(content.steps).toHaveLength(3);
    },
  );

  it("uses translated answers instead of Korean fallback", () => {
    for (const locale of ["en", "ja"] as const) {
      expect(JSON.stringify(landingSearchContent[locale])).not.toMatch(/[가-힣]/);
    }
  });
});
