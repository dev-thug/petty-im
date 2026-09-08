"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locale";
import { landingLocales } from "@/content/landing-locales";
const LocaleContext = createContext<Locale>("ko");
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}
export function useLandingContent() {
  return landingLocales[useContext(LocaleContext)];
}
export function LanguageSelector() {
  const locale = useContext(LocaleContext);
  const { UI } = useLandingContent();
  return (
    <select
      className="language-selector"
      aria-label={UI.language}
      value={locale}
      onChange={(event) => {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", event.target.value);
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
  return useContext(LocaleContext);
}
