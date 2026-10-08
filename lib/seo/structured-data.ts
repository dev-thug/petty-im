import { landingSearchContent } from "@/content/landing-search";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  PETTY_APP_URL,
} from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";
import { landingLocales } from "@/content/landing-locales";
import { HREFLANG, SITE_URL, SITE_NAME, SITE_ALTERNATE_NAMES, absoluteUrl } from "@/lib/seo/site";
import type { Locale } from "@/lib/i18n/locale";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const APP_ID = `${SITE_URL}/#app`;

/**
 * One graph per landing page: who publishes Petty, the site itself, and the app.
 * Ratings, prices and install links are omitted until we have real values — a
 * fabricated `aggregateRating` is a structured-data violation, not a shortcut.
 */
export function landingGraph(locale: Locale) {
  const { META } = landingLocales[locale];
  const stores = [APP_STORE_URL, GOOGLE_PLAY_URL].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...faqGraph(landingSearchContent[locale].faqs),
        "@id": `${absoluteUrl(locale === "ko" ? "/" : `/${locale}`)}#faq`,
        inLanguage: HREFLANG[locale],
      },
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        legalName: BUSINESS.name,
        url: SITE_URL,
        email: BUSINESS.supportEmail,
        logo: absoluteUrl("/assets/app-icon-512.png"),
        sameAs: [PETTY_APP_URL, ...stores],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        // A WebSite represents the domain, not a translated subdirectory.
        url: SITE_URL,
        inLanguage: HREFLANG[locale],
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        // Petty runs on the web and as iOS and Android apps, so the cross-platform
        // SoftwareApplication type fits better than either Web- or MobileApplication.
        "@type": "SoftwareApplication",
        "@id": APP_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        applicationCategory: "EntertainmentApplication",
        operatingSystem: "Web, iOS, Android",
        url: PETTY_APP_URL,
        description: META.description,
        inLanguage: HREFLANG[locale],
        publisher: { "@id": ORGANIZATION_ID },
        // installUrl needs a real listing; it stays out until one is configured.
        ...(stores.length > 0 ? { installUrl: stores } : {}),
      },
    ],
  };
}

/** Describe visible FAQs; Google limits FAQ rich results to eligible health/government sites. */
export function faqGraph(
  faqs: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
