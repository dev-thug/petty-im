import { describe, expect, it } from "vitest";
import { landingGraph } from "./structured-data";

describe("site identity for search engines", () => {
  it("identifies one domain-level website across all landing languages", () => {
    for (const locale of ["ko", "en", "ja"] as const) {
      const websites = landingGraph(locale)["@graph"].filter(
        (node) => node["@type"] === "WebSite",
      );
      expect(websites).toHaveLength(1);
      expect(websites[0]).toMatchObject({
        "@id": "https://petty.im/#website",
        name: "페티",
        alternateName: ["Petty"],
        url: "https://petty.im",
      });
    }
  });
});
