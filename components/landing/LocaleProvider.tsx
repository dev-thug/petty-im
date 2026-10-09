"use client";
import { createContext, useContext, type ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import type { LandingContent } from "@/content/landing-locales";
import { track } from "@/lib/analytics/track";

const LandingContext = createContext<{
  locale: Locale;
  content: LandingContent;
} | null>(null);

export function LocaleProvider({
  locale,
  content,
  children,
}: {
  locale: Locale;
  content: LandingContent;
  children: ReactNode;
}) {
  return (
    <LandingContext.Provider value={{ locale, content }}>
      {children}
    </LandingContext.Provider>
  );
}

function useLandingContext() {
  const context = useContext(LandingContext);
  if (!context) {
    throw new Error("Landing content hooks must be used within LocaleProvider");
  }
  return context;
}

export function useLandingContent() {
  return useLandingContext().content;
}

export function LanguageSelector() {
  const { locale, content } = useLandingContext();
  const { UI } = content;
  return (
    <select
      className="language-selector"
      aria-label={UI.language}
      value={locale}
      onChange={(event) => {
        const value = event.target.value;
        if (isLocale(value)) {
          track("language_change", { from_locale: locale, to_locale: value });
        }
        const url = new URL(window.location.href);
        url.searchParams.set("lang", value);
        window.location.assign(url.toString());
      }}
    >
      <option value="ko">한국어</option>
      <option value="ja">日本語</option>
      <option value="en">English</option>
    </select>
  );
}

export function useLocale() {
  return useLandingContext().locale;
}
