import { landingSearchContent } from "@/content/landing-search";
import { PETTY_APP_URL } from "@/content/app-links";
import type { Locale } from "@/lib/i18n/locale";
import { PanelTop, UserRound, MessagesSquare } from "lucide-react";

const stepIcons = [PanelTop, UserRound, MessagesSquare];

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
        {content.steps.map((step, index) => {
          const Icon = stepIcons[index];
          return (
            <li key={step.title}>
              <span className="search-step-icon" aria-hidden="true">
                <Icon size={28} strokeWidth={1.5} />
              </span>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </li>
          );
        })}
      </ol>
      <div className="search-start-action">
        <a className="landing-button" href={PETTY_APP_URL}>{content.startLabel}</a>
      </div>
      <div className="search-faq-section" role="group" aria-labelledby="petty-faq-title">
        <h3 id="petty-faq-title">{content.faqTitle}</h3>
        <dl className="search-faq">
          {content.faqs.map((faq) => (
            <div key={faq.question}>
              <dt>{faq.question}</dt>
              <dd>
                {faq.answer}
                {faq.actionLabel && (
                  <a className="landing-button secondary search-faq-action" href={PETTY_APP_URL}>
                    {faq.actionLabel}<span aria-hidden="true">↗</span>
                  </a>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
