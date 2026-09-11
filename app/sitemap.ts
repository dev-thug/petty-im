import type { MetadataRoute } from "next";
import { COMPARISONS, COMPARISON_UPDATED_AT } from "@/content/comparisons";
import { LANDING_UPDATED_AT } from "@/content/landing-locales";
import { documentUpdatedAt } from "@/content/legal/business";
import { privacy } from "@/content/legal/privacy";
import { terms } from "@/content/legal/terms";
import { LOCALES, type Locale } from "@/lib/i18n/locale";
import { absoluteUrl, localeRoute } from "@/lib/seo/site";

type SitemapRoute = {
  route: string;
  locales: readonly Locale[];
  /** Last real content change, never the build time: a lastmod that moves on
   * every deploy tells crawlers nothing and gets ignored. Comparison and legal
   * pages print this same date. */
  lastModified: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const KOREAN_ONLY = ["ko"] as const;

const ROUTES: readonly SitemapRoute[] = [
  {
    route: "/",
    locales: LOCALES,
    lastModified: LANDING_UPDATED_AT,
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    route: "/alternatives",
    locales: KOREAN_ONLY,
    lastModified: COMPARISON_UPDATED_AT,
    priority: 0.8,
    changeFrequency: "monthly",
  },
  ...COMPARISONS.map((comparison) => ({
    route: `/alternatives/${comparison.slug}`,
    locales: KOREAN_ONLY,
    lastModified: COMPARISON_UPDATED_AT,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  {
    route: "/terms",
    locales: KOREAN_ONLY,
    lastModified: documentUpdatedAt(terms),
    priority: 0.2,
    changeFrequency: "yearly",
  },
  {
    route: "/privacy",
    locales: KOREAN_ONLY,
    lastModified: documentUpdatedAt(privacy),
    priority: 0.2,
    changeFrequency: "yearly",
  },
];

/** hreflang is declared once, in each page's <head> (see alternatesFor). Repeating
 * it here as xhtml:link only duplicated that set, and the XHTML namespace made
 * browsers render the sitemap as run-together text. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(
    ({ route, locales, lastModified, priority, changeFrequency }) =>
      locales.map((locale) => ({
        url: absoluteUrl(localeRoute(locale, route)),
        lastModified,
        changeFrequency,
        priority,
      })),
  );
}
