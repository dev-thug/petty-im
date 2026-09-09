import { describe, expect, it } from "vitest";
import { localeFromPathname, localePath, resolveLocale } from "./locale";

describe("landing locale negotiation", () => {
  it("prioritizes explicit selection over saved choice and country", () => {
    expect(
      resolveLocale({
        requested: "ja",
        saved: "ko",
        country: "US",
        acceptLanguage: "en-US",
      }),
    ).toBe("ja");
    expect(resolveLocale({ saved: "en", country: "JP" })).toBe("en");
  });
  it("maps target countries before browser language", () => {
    expect(resolveLocale({ country: "JP", acceptLanguage: "en-US" })).toBe(
      "ja",
    );
    expect(resolveLocale({ country: "US", acceptLanguage: "ko-KR" })).toBe(
      "en",
    );
    expect(resolveLocale({ country: "KR", acceptLanguage: "en-US" })).toBe(
      "ko",
    );
  });
  it("negotiates browser quality weights and regional variants", () => {
    expect(
      resolveLocale({ acceptLanguage: "fr-FR, en-US;q=0.8, ja;q=0.9" }),
    ).toBe("ja");
    expect(resolveLocale({ acceptLanguage: "en-GB,en;q=0.9" })).toBe("en");
    expect(resolveLocale({ acceptLanguage: "ja-JP,ko;q=0.4" })).toBe("ja");
  });
  it("ignores invalid choices and excluded languages and falls back to Korean", () => {
    expect(
      resolveLocale({
        requested: "xxx",
        saved: "fr",
        country: "DE",
        acceptLanguage: "en;q=0,ja;q=invalid,ko;q=0.7",
      }),
    ).toBe("ko");
    expect(resolveLocale({ acceptLanguage: "fr,de" })).toBe("ko");
    expect(resolveLocale({})).toBe("ko");
  });
});

describe("locale paths", () => {
  it("maps paths to locales with Korean at the root", () => {
    expect(localeFromPathname("/")).toBe("ko");
    expect(localeFromPathname("/terms")).toBe("ko");
    expect(localeFromPathname("/ja")).toBe("ja");
    expect(localeFromPathname("/ja/terms")).toBe("ja");
    expect(localeFromPathname("/en")).toBe("en");
    // A path that merely starts with the letters is not that locale.
    expect(localeFromPathname("/japanese-guide")).toBe("ko");
  });

  it("translates a path into another language", () => {
    expect(localePath("/", "ja")).toBe("/ja");
    expect(localePath("/ja", "ko")).toBe("/");
    expect(localePath("/ja/terms", "en")).toBe("/en/terms");
    expect(localePath("/en", "en")).toBe("/en");
  });
});
