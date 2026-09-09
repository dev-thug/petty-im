import type { Metadata } from "next";
import Link from "next/link";
import { PETTY_APP_URL } from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";
import { COMPARISONS, COMPARISON_UPDATED_AT } from "@/content/comparisons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Wordmark } from "@/components/ui/wordmark";
import { faqGraph } from "@/lib/seo/structured-data";
import { alternatesFor } from "@/lib/seo/site";

const TITLE =
  "AI 캐릭터 채팅 앱 비교 — 제타 · 크랙 · Character.AI · 버블챗 | Petty";
const DESCRIPTION =
  "국내외 AI 캐릭터 채팅 앱을 실제 차이 중심으로 비교했습니다. 어떤 서비스가 어떤 사람에게 맞는지 솔직하게 정리했습니다.";

const FAQS = [
  {
    question: "국내 AI 캐릭터 채팅 앱은 어떤 게 있나요?",
    answer:
      "제타(스캐터랩), 크랙(뤼튼테크놀로지스), 버블챗(버블탭), Petty(스페시파이) 등이 있습니다. 해외 서비스로는 Character.AI, Talkie, PolyBuzz 등이 국내에서도 쓰입니다.",
  },
  {
    question: "AI 캐릭터 채팅 앱을 고를 때 무엇을 봐야 하나요?",
    answer:
      "캐릭터 수, 대화가 기억되고 이어지는지, 지나간 대화를 다시 볼 수 있는지, 한국어 말투가 자연스러운지, 창작자 수익 정책이 있는지를 보면 대부분 갈립니다. 무엇을 우선하느냐에 따라 답이 달라집니다.",
  },
  {
    question: "AI 캐릭터 채팅을 PC에서도 할 수 있나요?",
    answer:
      "대부분 가능합니다. 제타(zeta-ai.io), 크랙(crack.wrtn.ai), Character.AI는 웹을 지원하고, Petty도 웹(app.petty.im)과 iOS · Android 앱을 모두 지원합니다. PC로 길게 쓰다가 이동 중에 휴대폰으로 이어가는 방식이 가능합니다.",
  },
  {
    question: "여러 앱을 같이 써도 되나요?",
    answer:
      "됩니다. 새 이야기를 즉석에서 열고 싶을 때와 같은 캐릭터와 오래 이어가고 싶을 때는 잘 맞는 앱이 다릅니다. 목적에 따라 나눠 쓰는 이용자가 많습니다.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternatesFor("ko", "/alternatives", ["ko"]),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/alternatives",
    siteName: "Petty",
    locale: "ko_KR",
    type: "website",
  },
};

export default function AlternativesHubPage() {
  return (
    <div className="legal-page compare-page" lang="ko">
      <JsonLd data={faqGraph(FAQS)} />
      <a className="legal-skip" href="#hub-content">
        본문으로 건너뛰기
      </a>
      <header className="legal-header">
        <Link href="/" aria-label="Petty 홈으로">
          <Wordmark size="display" />
        </Link>
        <div className="legal-header-links">
          <Link href="/">홈으로</Link>
          <a href={PETTY_APP_URL}>페티 시작하기</a>
        </div>
      </header>

      <main id="hub-content" className="legal-main">
        <div className="legal-intro">
          <p className="legal-eyebrow">PETTY · 비교</p>
          <h1>AI 캐릭터 채팅 앱 비교</h1>
          <p>
            AI 캐릭터와 대화하는 앱은 많지만, 서로 다른 것을 잘합니다. 캐릭터가
            많은 앱, 이야기를 즉석에서 만들어주는 앱, 창작자에게 수익을 주는 앱,
            그리고 같은 캐릭터와 오래 이어가는 앱이 각각 다릅니다.
          </p>
          <p>
            아래는 각 서비스가 무엇을 잘하는지, 어떤 사람에게 맞는지 정리한
            문서입니다. Petty가 모든 면에서 낫다고 쓰지 않았습니다. 그렇게 쓰면
            직접 써보는 순간 들통나기 때문입니다.
          </p>
          <p className="legal-date">
            최종 수정일{" "}
            <time dateTime={COMPARISON_UPDATED_AT}>
              {COMPARISON_UPDATED_AT}
            </time>
          </p>
        </div>

        <article className="legal-article">
          <section id="list" aria-labelledby="list-title">
            <h2 id="list-title">서비스별 비교 문서</h2>
            <ul className="compare-index">
              {COMPARISONS.map((comparison) => (
                <li key={comparison.slug}>
                  <Link href={`/alternatives/${comparison.slug}`}>
                    <strong>{comparison.heading}</strong>
                  </Link>
                  <p>{comparison.description}</p>
                  <p className="compare-index-meta">
                    운영사 {comparison.competitorOperator}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="criteria" aria-labelledby="criteria-title">
            <h2 id="criteria-title">비교할 때 실제로 갈리는 지점</h2>
            <p>
              <strong>캐릭터 규모.</strong> 제타는 400만 개가 넘는 캐릭터를
              내세웁니다. 아주 구체적인 취향이 있다면 규모가 곧 만족도입니다.
              반대로 무엇을 고를지 정하지 못하면 선택 자체가 피로가 됩니다.
            </p>
            <p>
              <strong>대화의 연속성.</strong> 오늘 나눈 대화가 다음 주에
              이어지는지 여부입니다. 요즘은 대부분의 서비스가 대화 기억을
              지원하므로 &ldquo;기억하느냐&rdquo;보다 &ldquo;무엇을 중심에
              두느냐&rdquo;로 갈립니다. 새 이야기를 여는 데 무게를 둔 서비스와
              같은 상대와 쌓아가는 데 무게를 둔 서비스는 실제 사용감이 다릅니다.
            </p>
            <p>
              <strong>기록.</strong> 지나간 대화를 다시 찾아 읽을 수
              있는지입니다. 대부분의 앱에서 지난 대화는 목록 아래로 밀려납니다.
            </p>
            <p>
              <strong>한국어의 결.</strong> 존댓말과 반말의 거리, 선후배
              호칭처럼 한국어를 전제로 설계해야 자연스럽게 나오는 요소가
              있습니다. 해외 서비스에서는 프롬프트로 계속 교정해야 하는
              부분입니다.
            </p>
            <p>
              <strong>창작자 수익.</strong> 캐릭터를 만들어 수익을 얻고 싶다면
              버블챗처럼 수익 배분 정책이 있는 서비스를 봐야 합니다.
            </p>
            <p>
              <strong>이용 환경.</strong> PC에서도 쓸지, 휴대폰만 쓸지에 따라
              갈립니다. 제타 · 크랙 · Character.AI · Petty는 웹과 앱을 모두
              지원하지만, 앱으로만 제공되는 서비스도 있습니다.
            </p>
          </section>

          <section id="faq" aria-labelledby="hub-faq-title">
            <h2 id="hub-faq-title">자주 묻는 질문</h2>
            {FAQS.map((faq) => (
              <div className="compare-faq" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>
        </article>

        <aside className="legal-contact" aria-labelledby="hub-cta-title">
          <h2 id="hub-cta-title">Petty는 어떤 쪽인가요</h2>
          <p>
            같은 캐릭터와 이어가는 쪽입니다. 대화를 기억하고, 지나간 순간을
            기록으로 남깁니다. 한국어 · 일본어 · 영어를 지원하고, 웹
            브라우저에서도 iOS · Android 앱으로도 쓸 수 있습니다.
          </p>
          <a href={PETTY_APP_URL}>페티 시작하기</a>
        </aside>
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
