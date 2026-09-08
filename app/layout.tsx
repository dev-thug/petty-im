import { getRequestLocale } from "@/lib/i18n/server";
import { landingLocales } from "@/content/landing-locales";
import { LocaleProvider } from "@/components/landing/LocaleProvider";
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
    metadataBase: new URL("https://petty.im"),
    alternates: {
      canonical: `/?lang=${locale}`,
      languages: {
        "ko-KR": "/?lang=ko",
        "ja-JP": "/?lang=ja",
        "en-US": "/?lang=en",
        "x-default": "/",
      },
    },
    openGraph: {
      title: META.title,
      description: META.description,
      url: `/?lang=${locale}`,
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
  return (
    <html className={pretendard.variable} lang={locale}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
