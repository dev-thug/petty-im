import { BusinessInformation } from "./BusinessInformation";
import { PETTY_APP_URL } from "@/content/app-links";
import Link from "next/link";
import { Wordmark } from "@/components/ui/wordmark";
import {
  BUSINESS,
  LEGAL_UPDATED_AT,
  type LegalDocument,
} from "@/content/legal/business";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <div className="legal-page" lang="ko">
      <a className="legal-skip" href="#legal-content">
        본문으로 건너뛰기
      </a>
      <header className="legal-header">
        <Link href="/" aria-label="Petty 홈으로">
          <Wordmark size="display" />
        </Link>
        <div className="legal-header-links">
          <Link href="/">홈으로</Link>
          <a href={PETTY_APP_URL}>페티 앱 열기</a>
        </div>
      </header>
      <main id="legal-content" className="legal-main">
        <div className="legal-intro">
          <p className="legal-eyebrow">PETTY · 서비스 안내</p>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <p className="legal-date">
            최종 수정일{" "}
            <time dateTime={LEGAL_UPDATED_AT}>{LEGAL_UPDATED_AT}</time> · 한국어
          </p>
        </div>
        <BusinessInformation />
        <nav className="legal-toc" aria-label={`${document.title} 목차`}>
          <h2>목차</h2>
          <ol>
            {document.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="legal-article">
          {document.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
            >
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
        <aside className="legal-contact" aria-labelledby="legal-help-title">
          <h2 id="legal-help-title">도움이 필요하신가요?</h2>
          <p>페티 서비스 이용, 계정 및 개인정보 관련 문의를 보내 주세요.</p>
          <a href={`mailto:${BUSINESS.supportEmail}`}>
            {BUSINESS.supportEmail}
          </a>
        </aside>
      </main>
      <footer className="legal-footer">
        <nav aria-label="서비스 정책">
          <Link
            href="/terms"
            aria-current={document.title === "이용약관" ? "page" : undefined}
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            aria-current={
              document.title === "개인정보처리방침" ? "page" : undefined
            }
          >
            개인정보처리방침
          </Link>
          <a href={`mailto:${BUSINESS.supportEmail}`}>고객 문의</a>
        </nav>
        <BusinessInformation />
      </footer>
    </div>
  );
}
