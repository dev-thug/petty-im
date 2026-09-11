import { COMPARISONS, COMPARISON_UPDATED_AT } from "@/content/comparisons";
import { RSS_PATH, RSS_TITLE, absoluteUrl } from "@/lib/seo/site";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);
}

/**
 * RSS dates are RFC 822, not ISO 8601. Content dates here are Korean calendar
 * days, so they are published as midnight KST; the weekday is derived from the
 * same calendar day because strict parsers reject a mismatched one.
 */
export function rfc822Date(day: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) throw new Error(`Expected YYYY-MM-DD, got "${day}"`);
  const [year, month, date] = match.slice(1).map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, date)).getUTCDay();
  return `${WEEKDAYS[weekday]}, ${match[3]} ${MONTHS[month - 1]} ${year} 00:00:00 +0900`;
}

/** Feed of the comparison guides — the site's only article-like pages. The
 * landing and legal pages are in the sitemap; a feed is for things people read. */
export function buildRss(): string {
  const updated = rfc822Date(COMPARISON_UPDATED_AT);
  const items = COMPARISONS.map((comparison) => {
    const url = absoluteUrl(`/alternatives/${comparison.slug}`);
    return `    <item>
      <title>${escapeXml(comparison.heading)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(comparison.description)}</description>
      <pubDate>${updated}</pubDate>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(RSS_TITLE)}</title>
    <link>${absoluteUrl("/alternatives")}</link>
    <description>${escapeXml("국내외 AI 캐릭터 채팅 앱과 Petty를 실제 차이 중심으로 비교한 글입니다.")}</description>
    <language>ko</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${absoluteUrl(RSS_PATH)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
