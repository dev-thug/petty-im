import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "./manifest";

/** Width and height from a PNG's IHDR chunk, which always sits at byte 16. */
function pngSize(publicPath: string): string {
  const bytes = readFileSync(join(process.cwd(), "public", publicPath));
  return `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`;
}

describe("manifest", () => {
  const { icons = [] } = manifest();

  it("offers the sizes Android home screens and splash screens ask for", () => {
    const regular = icons.filter((icon) => icon.purpose !== "maskable");
    expect(regular.map((icon) => icon.sizes)).toEqual(
      expect.arrayContaining(["192x192", "512x512"]),
    );
    expect(icons.some((icon) => icon.purpose === "maskable")).toBe(true);
  });

  it("declares each icon at the size of the file it points to", () => {
    for (const icon of icons) {
      expect(icon.type).toBe("image/png");
      expect(pngSize(icon.src)).toBe(icon.sizes);
    }
  });
});
