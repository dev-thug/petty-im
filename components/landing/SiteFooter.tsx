"use client";
import { useLandingContent } from "@/components/landing/LocaleProvider";
import { Wordmark } from "@/components/ui/wordmark";

export function SiteFooter() {
  const { FOOTER_COPYRIGHT, FOOTER_CONTACT_EMAIL, FOOTER_TAGLINE, UI } =
    useLandingContent();
  return (
    <footer className="landing-footer">
      <div className="footer-inner">
        <a href="#hero" aria-label={UI.top}>
          <Wordmark className="footer-logo" />
        </a>
        <p>
          {FOOTER_TAGLINE.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <nav aria-label={UI.footerNavigation}>
          <a href="#hero">{UI.about}</a>
          <a href="/terms" hrefLang="ko">
            {UI.terms}
          </a>
          <a href="/privacy" hrefLang="ko">
            {UI.privacy}
          </a>
          <a href={`mailto:${FOOTER_CONTACT_EMAIL}`}>{UI.support}</a>
        </nav>
        <small>{FOOTER_COPYRIGHT}</small>
      </div>
    </footer>
  );
}
