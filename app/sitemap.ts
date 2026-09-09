import type { MetadataRoute } from "next";
import { COMPARISONS } from "@/content/comparisons";
import { LOCALES, type Locale } from "@/lib/i18n/locale";
import { HREFLANG, absoluteUrl, localeRoute } from "@/lib/seo/site";

type SitemapRoute = {
  route: string;
  locales: readonly Locale[];
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const KOREAN_ONLY = ["ko"] as const;

const ROUTES: readonly SitemapRoute[] = [
  { route: "/", locales: LOCALES, priority: 1, changeFrequency: "weekly" },
  {
    route: "/alternatives",
    locales: KOREAN_ONLY,
    priority: 0.8,
    changeFrequency: "monthly",
  },
  ...COMPARISONS.map((comparison) => ({
    route: `/alternatives/${comparison.slug}`,
    locales: KOREAN_ONLY,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  {
    route: "/terms",
    locales: KOREAN_ONLY,
    priority: 0.2,
    changeFrequency: "yearly",
  },
  {
    route: "/privacy",
    locales: KOREAN_ONLY,
    priority: 0.2,
    changeFrequency: "yearly",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.flatMap(({ route, locales, priority, changeFrequency }) => {
    // Next does not add the self-referencing alternate, and a set missing it is
    // discarded wholesale, so every locale of the route is listed on every entry.
    const languages = Object.fromEntries([
      ...locales.map((locale) => [
        HREFLANG[locale],
        absoluteUrl(localeRoute(locale, route)),
      ]),
      ["x-default", absoluteUrl(localeRoute("ko", route))],
    ]);
    return locales.map((locale) => ({
      url: absoluteUrl(localeRoute(locale, route)),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
