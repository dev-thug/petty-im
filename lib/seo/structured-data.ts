import { landingSearchContent } from "@/content/landing-search";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  PETTY_APP_URL,
} from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";
import { landingLocales } from "@/content/landing-locales";
import {
  HREFLANG,
  SITE_URL,
  SITE_NAME,
  SITE_ALTERNATE_NAMES,
  absoluteUrl,
  localeRoute,
} from "@/lib/seo/site";
import type { Locale } from "@/lib/i18n/locale";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const BRAND_ID = `${SITE_URL}/#brand`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#app`;
const SCHEMA_CONTEXT = "https://schema.org";

function faqNode(
  faqs: readonly { question: string; answer: string }[],
  id?: string,
  inLanguage?: string,
) {
  return {
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    ...(inLanguage ? { inLanguage } : {}),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** One graph per landing page: the operator, Petty brand, website, and app. */
export function landingGraph(locale: Locale) {
  const { META } = landingLocales[locale];
  const landingUrl = absoluteUrl(localeRoute(locale, "/"));
  const pageId = `${landingUrl}#webpage`;
  const faqId = `${landingUrl}#faq`;
  const stores = [APP_STORE_URL, GOOGLE_PLAY_URL].filter(Boolean);
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
        url: landingUrl,
        name: META.title,
        description: META.description,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": APP_ID },
        about: { "@id": APP_ID },
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: HREFLANG[locale],
      },
      {
        ...faqNode(landingSearchContent[locale].faqs, faqId, HREFLANG[locale]),
        isPartOf: { "@id": pageId },
      },
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        // Petty is the product brand. Keep its legal publisher as a distinct entity.
        name: BUSINESS.name,
        legalName: BUSINESS.name,
        url: SITE_URL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: BUSINESS.supportEmail,
        },
        brand: { "@id": BRAND_ID },
      },
      {
        "@type": "Brand",
        "@id": BRAND_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: SITE_URL,
        logo: absoluteUrl("/assets/app-icon-512.png"),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        // A WebSite represents the domain, not a translated subdirectory.
        url: SITE_URL,
        inLanguage: Object.values(HREFLANG),
        publisher: { "@id": ORGANIZATION_ID },
        about: { "@id": APP_ID },
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
        inLanguage: Object.values(HREFLANG),
        publisher: { "@id": ORGANIZATION_ID },
        brand: { "@id": BRAND_ID },
        // Store URLs appear only when real listings are configured.
        ...(stores.length > 0 ? { installUrl: stores } : {}),
      },
    ],
  };
}

/** Keep the machine-readable Q&A aligned with visible answers. Google removed FAQ rich results in May 2026. */
export function faqGraph(
  faqs: readonly { question: string; answer: string }[],
) {
  return {
    "@context": SCHEMA_CONTEXT,
    ...faqNode(faqs),
  };
}
