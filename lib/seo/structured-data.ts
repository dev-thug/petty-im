import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  PETTY_APP_URL,
} from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";
import { landingLocales } from "@/content/landing-locales";
import { HREFLANG, SITE_URL, absoluteUrl, localeRoute } from "@/lib/seo/site";
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
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Petty",
        legalName: BUSINESS.name,
        url: SITE_URL,
        email: BUSINESS.supportEmail,
        logo: absoluteUrl("/assets/wordmark.png"),
        sameAs: [PETTY_APP_URL, ...stores],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Petty",
        url: absoluteUrl(localeRoute(locale, "/")),
        inLanguage: HREFLANG[locale],
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        // Petty runs on the web and as iOS and Android apps, so the cross-platform
        // SoftwareApplication type fits better than either Web- or MobileApplication.
        "@type": "SoftwareApplication",
        "@id": APP_ID,
        name: "Petty",
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

/** FAQ blocks power the "People also ask" style result on comparison pages. */
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
