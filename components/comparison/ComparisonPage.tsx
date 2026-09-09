import Link from "next/link";
import { PETTY_APP_URL } from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";
import {
  COMPARISONS,
  COMPARISON_UPDATED_AT,
  type Comparison,
} from "@/content/comparisons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Wordmark } from "@/components/ui/wordmark";
import { faqGraph } from "@/lib/seo/structured-data";

export function ComparisonPage({ comparison }: { comparison: Comparison }) {
  const others = COMPARISONS.filter((entry) => entry.slug !== comparison.slug);
  const toc = [
    comparison.whySwitch,
    { id: "at-a-glance", title: "한눈에 비교" },
    ...comparison.sections,
    { id: "who", title: "어느 쪽이 맞을까요" },
    { id: "faq", title: "자주 묻는 질문" },
  ];
  return (
    <div className="legal-page compare-page" lang="ko">
      <JsonLd data={faqGraph(comparison.faqs)} />
      <a className="legal-skip" href="#compare-content">
        본문으로 건너뛰기
      </a>
      <header className="legal-header">
        <Link href="/" aria-label="Petty 홈으로">
          <Wordmark size="display" />
        </Link>
        <div className="legal-header-links">
          <Link href="/alternatives">비교 전체보기</Link>
          <a href={PETTY_APP_URL}>페티 시작하기</a>
        </div>
      </header>

      <main id="compare-content" className="legal-main">
        <div className="legal-intro">
          <p className="legal-eyebrow">PETTY · 비교</p>
          <h1>{comparison.heading}</h1>
          {comparison.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="legal-date">
            최종 수정일{" "}
            <time dateTime={COMPARISON_UPDATED_AT}>
              {COMPARISON_UPDATED_AT}
            </time>{" "}
            · {comparison.competitorName} 관련 정보는 아래 출처를 확인해 주세요.
          </p>
        </div>

        <nav className="legal-toc" aria-label="비교 목차">
          <h2>목차</h2>
          <ol>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="legal-article">
          <section
            id={comparison.whySwitch.id}
            aria-labelledby={`${comparison.whySwitch.id}-title`}
          >
            <h2 id={`${comparison.whySwitch.id}-title`}>
              {comparison.whySwitch.title}
            </h2>
            {comparison.whySwitch.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section id="at-a-glance" aria-labelledby="at-a-glance-title">
            <h2 id="at-a-glance-title">한눈에 비교</h2>
            <div className="compare-table-scroll">
              <table className="compare-table">
                <caption>{comparison.tableCaption}</caption>
                <thead>
                  <tr>
                    <th scope="col">항목</th>
                    <th scope="col">{comparison.competitorName}</th>
                    <th scope="col">Petty</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.competitor}</td>
                      <td>{row.petty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {comparison.sections.map((section) => (
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

          <section id="who" aria-labelledby="who-title">
            <h2 id="who-title">어느 쪽이 맞을까요</h2>
            <div className="compare-columns">
              <div>
                <h3>{comparison.competitorName}에 남는 편이 나은 경우</h3>
                <ul>
                  {comparison.stayWithCompetitor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Petty가 맞는 경우</h3>
                <ul>
                  {comparison.choosePetty.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" aria-labelledby="faq-title">
            <h2 id="faq-title">자주 묻는 질문</h2>
            {comparison.faqs.map((faq) => (
              <div className="compare-faq" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>
        </article>

        <aside className="legal-contact" aria-labelledby="compare-cta-title">
          <h2 id="compare-cta-title">직접 비교해 보는 게 가장 빠릅니다</h2>
          <p>
            Petty는 웹 브라우저(app.petty.im)에서도, iOS와 Android 앱으로도 쓸
            수 있습니다. 캐릭터를 하나 골라 며칠만 대화해 보면 차이를 알 수
            있습니다.
          </p>
          <a href={PETTY_APP_URL}>페티 시작하기</a>
        </aside>

        <section className="compare-sources" aria-labelledby="sources-title">
          <h2 id="sources-title">출처</h2>
          <ul>
            {comparison.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="nofollow noopener" target="_blank">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p>
            {comparison.competitorName}({comparison.competitorOperator})의
            상표와 서비스명은 각 권리자의 자산이며, 이 페이지는 비교 목적의 참고
            자료입니다. 정책과 기능은 바뀔 수 있으니 최신 정보는 각 서비스에서
            확인해 주세요.
          </p>
        </section>

        <nav className="compare-related" aria-label="다른 비교 문서">
          <h2>다른 비교</h2>
          <ul>
            {others.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/alternatives/${entry.slug}`}>
                  {entry.competitorName} 대신 쓸 만한 AI 캐릭터 채팅 앱
                </Link>
              </li>
            ))}
            <li>
              <Link href="/alternatives">AI 캐릭터 채팅 앱 비교 전체보기</Link>
            </li>
          </ul>
        </nav>
      </main>

      <footer className="legal-footer">
        <nav aria-label="서비스 정책">
          <Link href="/">홈</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <a href={`mailto:${BUSINESS.supportEmail}`}>고객 문의</a>
        </nav>
      </footer>
    </div>
  );
}
