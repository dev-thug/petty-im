export const LOCALES = ["ko", "ja", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "petty-locale";
export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && LOCALES.some((locale) => locale === value)
  );
}
export function resolveLocale({
  requested,
  saved,
  country,
  acceptLanguage,
}: {
  requested?: string | null;
  saved?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(requested)) return requested;
  if (isLocale(saved)) return saved;
  const countries: Record<string, Locale> = { KR: "ko", JP: "ja", US: "en" };
  const countryLocale = countries[country?.trim().toUpperCase() ?? ""];
  if (countryLocale) return countryLocale;
  const preferences = (acceptLanguage ?? "")
    .split(",")
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().split(";");
      const quality = parameters.find((parameter) =>
        parameter.trim().startsWith("q="),
      );
      const weight = quality ? Number(quality.trim().slice(2)) : 1;
      return { locale: tag.toLowerCase().split("-")[0], weight, index };
    })
    .filter(
      (item) =>
        Number.isFinite(item.weight) && item.weight > 0 && item.weight <= 1,
    )
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  return (
    (preferences.find((item) => isLocale(item.locale))?.locale as
      Locale | undefined) ?? "ko"
  );
}

/**
 * Path prefix that serves each locale. Korean lives at the site root so the most
 * linked-to URL never redirects, and each language keeps one crawlable address.
 */
export const LOCALE_PREFIX: Record<Locale, string> = {
  ko: "",
  ja: "/ja",
  en: "/en",
};

/** Locale a URL path serves. The path is the only signal, so crawlers and
 * visitors always see the same content at the same address. */
export function localeFromPathname(pathname: string): Locale {
  const match = LOCALES.find((locale) => {
    const prefix = LOCALE_PREFIX[locale];
    return (
      prefix !== "" &&
      (pathname === prefix || pathname.startsWith(`${prefix}/`))
    );
  });
  return match ?? "ko";
}

/** Same page in another language. */
export function localePath(pathname: string, locale: Locale): string {
  const current = LOCALE_PREFIX[localeFromPathname(pathname)];
  // A trailing slash would make "/ja/" a second URL for the same page.
  const rest = (
    current === "" ? pathname : pathname.slice(current.length)
  ).replace(/\/$/, "");
  return `${LOCALE_PREFIX[locale]}${rest}` || "/";
}
