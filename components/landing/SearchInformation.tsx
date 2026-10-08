import { COMPARISONS } from "@/content/comparisons";
import Link from "next/link";
import { landingSearchContent } from "@/content/landing-search";
import { PETTY_APP_URL } from "@/content/app-links";
import type { Locale } from "@/lib/i18n/locale";

export function SearchInformation({ locale }: { locale: Locale }) {
  const content = landingSearchContent[locale];
  return (
    <section className="landing-container landing-search" aria-labelledby="about-petty">
      <div className="section-heading">
        <h2 id="about-petty">{content.title}</h2>
        <p>{content.introduction}</p>
      </div>
      <h3>{content.stepsTitle}</h3>
      <ol className="search-steps">
        {content.steps.map((step) => (
          <li key={step.title}><h4>{step.title}</h4><p>{step.description}</p></li>
        ))}
      </ol>
      <a className="landing-button" href={PETTY_APP_URL}>{content.startLabel}</a>
      <h3>{content.faqTitle}</h3>
      <dl className="search-faq">
        {content.faqs.map((faq) => (
          <div key={faq.question}><dt>{faq.question}</dt><dd>{faq.answer}</dd></div>
        ))}
      </dl>
      {locale === "ko" && (
        <ul className="search-guides">
          {COMPARISONS.map((comparison) => (
            <li key={comparison.slug}>
              <Link href={`/alternatives/${comparison.slug}`}>{comparison.title}</Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/alternatives" hrefLang="ko" lang="ko">AI 캐릭터 채팅 앱 비교 가이드 (한국어)</Link>
    </section>
  );
}
