import { LOCALE_PREFIX, LOCALES, type Locale } from "@/lib/i18n/locale";

export const SITE_URL = "https://petty.im";

/** Search engines expect a language[-region] tag, not our short locale code. */
export const HREFLANG: Record<Locale, string> = {
  ko: "ko-KR",
  ja: "ja-JP",
  en: "en-US",
};

/** URL a route has in one language. `route` is the path without a locale prefix. */
export function localeRoute(locale: Locale, route: string): string {
  const path = `${LOCALE_PREFIX[locale]}${route === "/" ? "" : route}`;
  return path === "" ? "/" : path;
}

/** Next normalizes the bare origin to "https://petty.im/" in the sitemap while
 * metadata canonicals render without the slash. Both spell the same root URL. */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Canonical plus the full hreflang set for one page.
 *
 * Every page in the set lists itself as well as its siblings — search engines
 * discard the whole cluster when the self-reference or a return link is missing.
 * `locales` names the languages a route actually exists in; pages we only publish
 * in Korean must not advertise translations that would 404.
 */
export function alternatesFor(
  locale: Locale,
  route = "/",
  locales: readonly Locale[] = LOCALES,
) {
  const languages = Object.fromEntries(
    locales.map((entry) => [HREFLANG[entry], localeRoute(entry, route)]),
  );
  return {
    canonical: localeRoute(locale, route),
    languages: { ...languages, "x-default": localeRoute("ko", route) },
  };
}

/**
 * Ownership tokens for search consoles. Naver Search Advisor matters most for a
 * Korean-first product and is not covered by Google's verification field, so it
 * goes through `other`. Each tag only appears once its token is configured.
 */
export function siteVerification() {
  const naver = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  return {
    ...(google ? { google } : {}),
    ...(naver || bing
      ? {
          other: {
            ...(naver ? { "naver-site-verification": naver } : {}),
            ...(bing ? { "msvalidate.01": bing } : {}),
          },
        }
      : {}),
  };
}
