import { getRequestLocale } from "@/lib/i18n/server";
import { SITE_URL, siteVerification } from "@/lib/seo/site";
import { landingLocales } from "@/content/landing-locales";
import { LocaleProvider } from "@/components/landing/LocaleProvider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";
import { gaMeasurementId } from "@/lib/analytics/events";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { pretendard } from "@/app/fonts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { META } = landingLocales[locale];
  return {
    title: META.title,
    description: META.description,
    applicationName: "Petty",
    metadataBase: new URL(SITE_URL),
    verification: siteVerification(),
    // Canonical and hreflang belong to each page: only the page knows which
    // languages it exists in, and a wrong canonical here would override them.
    openGraph: {
      siteName: "Petty",
      locale: META.ogLocale,
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getRequestLocale();
  const gaId = gaMeasurementId();
  return (
    <html className={pretendard.variable} lang={locale}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        {gaId && (
          <>
            <GoogleAnalytics measurementId={gaId} />
            <AnalyticsListener />
          </>
        )}
      </body>
    </html>
  );
}
