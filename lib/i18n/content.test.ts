import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { landingLocales } from "@/content/landing-locales";
import { LOCALES } from "./locale";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}
describe("localized landing content", () => {
  for (const locale of LOCALES) {
    it(`${locale} retains every character, preview and feature`, () => {
      const copy = landingLocales[locale];
      expect(existsSync(join(process.cwd(), "public", copy.PHONE_IMAGE))).toBe(
        true,
      );
      expect(copy.CHARACTERS.map((c) => c.id)).toEqual(
        landingLocales.ko.CHARACTERS.map((c) => c.id),
      );
      expect(copy.FEATURE_HIGHLIGHTS.map((f) => f.id)).toEqual(
        landingLocales.ko.FEATURE_HIGHLIGHTS.map((f) => f.id),
      );
      for (const character of copy.CHARACTERS)
        expect(copy.INTRODUCTIONS[character.id]).toBeTruthy();

      expect(
        strings(copy).filter((value) => /출시|launch|リリース/.test(value)),
      ).toEqual([]);
      expect(copy.UI.openApp.length > 0).toBe(true);
    });
  }
  it("does not leak Korean fallback copy into English or Japanese", () => {
    for (const locale of ["en", "ja"] as const) {
      expect(
        strings(landingLocales[locale]).filter((value) =>
          /[가-힣]/.test(value),
        ),
      ).toEqual([]);
    }
  });
});
