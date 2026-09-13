import type { Metadata } from "next";
import { landingLocales } from "@/content/landing-locales";
import { getRequestLocale } from "@/lib/i18n/server";
import { SITE_NAME, alternatesFor, localeRoute } from "@/lib/seo/site";

/** Metadata for the landing page in whichever language the path selected. */
export async function landingMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { META } = landingLocales[locale];
  const url = localeRoute(locale, "/");
  return {
    title: META.title,
    description: META.description,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      title: META.title,
      description: META.description,
      url,
      siteName: SITE_NAME,
      locale: META.ogLocale,
      type: "website",
    },
  };
}
