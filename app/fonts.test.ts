import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("self-hosted font delivery", () => {
  it("uses bounded Unicode subsets covering ASCII and every modern Hangul syllable", () => {
    const globalCss = readFileSync(resolve("app/globals.css"), "utf8");
    const fontImport = globalCss.match(/@import "(pretendard\/[^\"]+dynamic-subset\.css)"/);
    expect(fontImport, "global styles must load Unicode-range font subsets").not.toBeNull();
    const cssPath = resolve("node_modules", fontImport![1]);
    const css = readFileSync(cssPath, "utf8");
    const faces = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)];
    expect(faces.length).toBeGreaterThan(1);
    const covered = new Set<number>();
    for (const [, face] of faces) {
      expect(face).toMatch(/font-display:\s*swap/);
      expect(face).toMatch(/font-weight:\s*45 920/);
      const file = face.match(/url\(([^)]+)\)/)![1];
      expect(file).not.toMatch(/^https?:/);
      expect(statSync(resolve(dirname(cssPath), file)).size).toBeLessThan(100_000);
      const ranges = face.match(/unicode-range:\s*([^;]+)/)![1];
      for (const range of ranges.split(",")) {
        const [start, end = start] = range.trim().replace(/^U\+/i, "").split("-");
        for (let point = parseInt(start, 16); point <= parseInt(end, 16); point++) covered.add(point);
      }
    }
    for (let point = 0x20; point <= 0x7e; point++) expect(covered.has(point)).toBe(true);
    for (let point = 0xac00; point <= 0xd7a3; point++) expect(covered.has(point)).toBe(true);
  });
});
