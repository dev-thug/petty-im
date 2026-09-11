import { describe, expect, it } from "vitest";
import { COMPARISONS } from "@/content/comparisons";
import { buildRss, escapeXml, rfc822Date } from "./rss";

describe("rfc822Date", () => {
  it("formats a Korean calendar day as midnight KST with the right weekday", () => {
    expect(rfc822Date("2026-09-08")).toBe("Tue, 08 Sep 2026 00:00:00 +0900");
    expect(rfc822Date("2026-01-01")).toBe("Thu, 01 Jan 2026 00:00:00 +0900");
    expect(rfc822Date("2024-02-29")).toBe("Thu, 29 Feb 2024 00:00:00 +0900");
  });

  it("rejects anything that is not a plain date", () => {
    expect(() => rfc822Date("2026-09-08T00:00:00Z")).toThrow();
    expect(() => rfc822Date("")).toThrow();
  });
});

describe("escapeXml", () => {
  it("escapes the characters that would break the feed", () => {
    expect(escapeXml(`A & B <c> "d" 'e'`)).toBe(
      "A &amp; B &lt;c&gt; &quot;d&quot; &apos;e&apos;",
    );
  });
});

describe("buildRss", () => {
  const feed = buildRss();

  it("lists every comparison guide with an absolute permalink", () => {
    expect(feed.match(/<item>/g)).toHaveLength(COMPARISONS.length);
    for (const { slug } of COMPARISONS) {
      const url = `https://petty.im/alternatives/${slug}`;
      expect(feed).toContain(`<link>${url}</link>`);
      expect(feed).toContain(`<guid isPermaLink="true">${url}</guid>`);
    }
  });

  it("declares the atom namespace it uses for the self link", () => {
    expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(feed).toContain(
      '<atom:link href="https://petty.im/rss.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("never contains a bare ampersand", () => {
    expect(feed).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });
});
