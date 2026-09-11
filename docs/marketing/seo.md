# petty.im SEO 현황과 실행 계획 (2026-09-08)

경쟁사 목록과 근거는 [competitors.md](./competitors.md) 참고.

---

## 1. 가장 컸던 문제: 세 언어가 URL 하나를 공유하고 있었다

작업 전 `petty.im`은 `/` 하나에서 쿠키 · IP 국가 · `Accept-Language`로 언어를 골라 렌더링했고, canonical은 `/?lang=ko`를 가리켰습니다.

Googlebot은 **미국 IP에서, 쿠키 없이, `Accept-Language` 없이** 크롤링합니다. 즉 구글이 보는 petty.im은 영어 한 벌뿐이었고, 그 페이지가 자기 자신을 "`?lang=ko`가 원본"이라고 선언하고 있었습니다. 사이트맵과 구조화 데이터를 아무리 붙여도 그 위에서는 의미가 없었기 때문에 이것부터 고쳤습니다.

### 고친 방식

| 언어 | URL |
| --- | --- |
| 한국어 | `/` |
| 일본어 | `/ja` |
| 영어 | `/en` |

- **경로가 언어를 결정합니다.** 같은 URL은 누가 요청하든 같은 언어를 반환합니다.
- 한국어를 루트에 뒀습니다. 링크가 가장 많이 쌓이는 주소가 리다이렉트되지 않게 하기 위해서입니다. 네이버 사이트 소유확인도 루트에서 처리하는 편이 안전합니다.
- 자동 언어 선택은 **`/`에서, 실제 브라우저 내비게이션(`Sec-Fetch-Mode: navigate`)일 때만** 동작합니다. 크롤러는 이 헤더를 보내지 않으므로 `/`는 크롤러에게 항상 한국어입니다. 사용자 경험(일본 사용자가 `/`를 열면 일본어)은 그대로 유지됩니다.
- `?lang=` 링크는 계속 동작하되 해당 언어의 실제 URL로 307 리다이렉트하고 선택을 쿠키에 저장합니다. 중복 인덱싱 대상이 생기지 않습니다.

### 함께 정리한 것

- **canonical**: 각 페이지가 자기 자신을 가리킵니다. (`https://petty.im`, `/ja`, `/en`, `/alternatives/...`)
- **hreflang**: 모든 랜딩 페이지에 `ko-KR` · `ja-JP` · `en-US` · `x-default` 4개가 자기 자신 포함으로 들어갑니다. 자기 참조가 빠지면 세트 전체가 무시됩니다.
- **한국어 전용 페이지**(`/terms`, `/privacy`, `/alternatives/*`)는 `ko-KR` + `x-default`만 선언합니다. 없는 번역을 광고하지 않습니다.
- **`robots.txt`** 생성 (`/api/` 차단, 사이트맵 · host 명시).
- **`sitemap.xml`** 생성. Next는 `<loc>` 자신에 대한 `<xhtml:link>`를 자동으로 넣지 않으므로 직접 넣었습니다.
- **프록시가 걸던 `Cache-Control: private, no-store`를 제거.** 페이지가 요청 시 렌더링되므로 Next가 이미 캐시 불가로 표시하며, 프록시에서 세팅한 헤더는 Next 응답 파이프라인을 통과하지 못합니다(실제 응답 헤더로 확인). 리다이렉트 판단은 캐시가 아니라 매 요청 프록시에서 이뤄집니다.
- **`html[lang]`**이 경로별로 정확히 렌더됩니다.

---

## 2. 구조화 데이터 (JSON-LD)

랜딩 페이지에 `Organization` + `WebSite` + 앱 엔티티 그래프를, 비교 페이지에 `FAQPage`를 넣었습니다.

앱 엔티티는 `SoftwareApplication` + `operatingSystem: "Web, iOS, Android"`입니다. Petty가 웹 · iOS · Android에서 모두 동작하므로, `WebApplication`이나 `MobileApplication` 어느 한쪽보다 상위 타입이 정확합니다.

**지어내지 않은 것:** `aggregateRating`, `offers`, `installUrl`은 넣지 않았습니다. 값이 없는데 채우면 구조화 데이터 정책 위반이고 수동 조치 대상입니다. 스토어 URL(`NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_GOOGLE_PLAY_URL`)을 설정하면 `installUrl`이 자동으로 붙고, 랜딩 페이지의 App Store · Google Play 배지도 함께 노출됩니다. **지금은 두 값이 비어 있어 배지가 숨겨져 있습니다.**

---

## 3. 경쟁사 검색 노출 — 비교 페이지

경쟁사 이름으로 검색했을 때 잡히려면 그 이름을 다루는 **페이지가 실제로 있어야** 합니다. 다음을 만들었습니다.

| URL | 노리는 검색어 |
| --- | --- |
| `/alternatives` | AI 캐릭터 채팅 앱 추천 · 비교 |
| `/alternatives/zeta` | 제타 대신 · 제타 같은 앱 · 제타 대체 |
| `/alternatives/crack` | 크랙 대체 · 크랙 같은 앱 |
| `/alternatives/character-ai` | Character.AI 대체 · 캐릭터 AI 한국어 대안 |
| `/alternatives/bubblechat` | 버블챗 대체 |

작성 원칙:

- **경쟁사가 나은 점을 먼저 씁니다.** 제타 페이지는 "규모는 제타가 앞선다, 캐릭터 수가 중요하면 제타에 남으라"로 시작합니다. 비교 검색을 하는 사람은 이미 둘 다 보고 있어서, 과장은 그 자리에서 들통납니다.
- 각 페이지에 **"어느 쪽이 맞을까요"** 섹션을 두어 경쟁사가 맞는 경우를 명시합니다.
- 경쟁사 주장에는 **출처 링크**를 답니다(`rel="nofollow noopener"`).
- 상표 고지: 경쟁사 서비스명은 각 권리자 자산이며 비교 목적 참고 자료임을 명시.
- 데이터는 `content/comparisons/`에 모아두어 한 곳만 고치면 모든 페이지에 반영됩니다.

**2026-09-08 정정:** 초안의 크랙 비교글은 "크랙은 즉흥 생성형이라 다음 세션이 새 세션"이라는 대비로 쓰여 있었습니다. 사실이 아닙니다 — 크랙은 캐릭터가 지난 대화를 기억하고 먼저 메시지를 보내는 것을 서비스 특징으로 내세웁니다. 해당 페이지를 다시 썼고, 지금은 "기억은 양쪽 다 한다"를 먼저 밝힌 뒤 실제로 갈리는 지점(지원 언어, 기록 공간, 장르 폭, 창작자 커뮤니티)만 비교합니다. 이런 종류의 오류는 비교 검색을 하는 사람이 가장 먼저 확인하는 부분이라 치명적입니다.

**플랫폼은 차별점이 아닙니다.** Petty는 웹 · iOS · Android를 모두 지원하지만, 제타(zeta-ai.io) · 크랙(crack.wrtn.ai) · Character.AI도 마찬가지입니다. 비교표에는 사실대로 적되 우위로 포장하지 않았고, 대신 "AI 캐릭터 채팅 PC" / "PC에서도 되나요" 류의 실재하는 검색 수요를 FAQ로 흡수했습니다.

한국어로만 만들었습니다. 4개 × 3개 언어 = 12페이지를 얕게 찍어내면 "scaled content abuse"에 가까워지고, 얇은 로케일 페이지는 사이트 전체 품질 신호를 끌어내립니다.

`/` 한국어 푸터에서 `/alternatives`로 링크해 고아 페이지가 되지 않게 했습니다.

---

## 4. 아직 안 된 것 — 사람이 해야 하는 작업

### (1) 검색엔진 등록 — 2026-09-11 진행 현황

**먼저 고친 것: 대표 도메인.** Vercel이 `petty.im`을 `www.petty.im`으로 308 리다이렉트하고 있었는데, canonical · hreflang · sitemap · robots `Host`는 모두 `https://petty.im`을 가리켰습니다. 모든 URL의 canonical이 리다이렉트되는 주소였던 셈이라, 등록하면 사이트맵 URL 전부가 "리다이렉트된 페이지"로 처리됐을 겁니다. Vercel 도메인 설정을 뒤집어 **`petty.im`이 Production, `www.petty.im` → `petty.im` 308**(경로 유지)로 맞췄습니다. 코드는 바꾸지 않았습니다.

| 검색엔진 | 상태 |
| --- | --- |
| Google Search Console | **완료.** 도메인 속성 `sc-domain:petty.im`(apex · www · 하위 도메인 전체)을 Route 53 TXT 레코드로 소유확인. `https://petty.im/sitemap.xml` 제출 — 성공, 발견된 페이지 10개. GA4 속성과 연결. |
| 네이버 서치어드바이저 | **소유확인 버튼과 사이트맵 제출만 남음.** HTML 태그 토큰을 Vercel `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`(Production)에 넣었고, `https://petty.im`에 `naver-site-verification` 메타태그가 나가는 것을 확인했습니다. 서치어드바이저에서 소유확인 → 요청 → 사이트맵 제출(`https://petty.im/sitemap.xml`) → RSS 없음. 네이버는 hreflang을 약하게 취급하므로 `html[lang]`이 중요한데, 이건 이미 맞습니다. |
| 다음 검색등록 | 미진행 — [다음 검색등록](https://register.search.daum.net/index.daum) |
| 빙 웹마스터 도구 | 미진행 — [빙 웹마스터 도구](https://www.bing.com/webmasters)에서 "Google Search Console에서 가져오기"를 쓰면 소유확인 없이 바로 등록됩니다. ChatGPT 검색이 Bing 인덱스를 참조합니다. |

Google은 DNS로 확인했기 때문에 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`은 비워 둡니다. Route 53의 `petty.im` TXT 레코드(`google-site-verification=…`)를 지우면 소유권이 풀립니다.

```
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=   # 설정됨 (Production)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=  # 불필요 (DNS 확인)
NEXT_PUBLIC_BING_SITE_VERIFICATION=    # 빙을 메타태그로 확인할 때만
```

GA4 추적 설계는 [analytics.md](./analytics.md) 참고.

### (2) app.petty.im 과의 중복 확인

실제 앱(`app.petty.im`)이 별도 프로젝트로 운영됩니다. 이쪽이 같은 검색어로 색인돼 `petty.im`과 경쟁하고 있지 않은지 확인이 필요합니다. 앱 서비스 화면은 대체로 색인 대상이 아니므로, `app.petty.im`에 `robots.txt`로 `Disallow: /`를 두거나 최소한 `petty.im`을 canonical로 잡는 편이 낫습니다. **이 저장소 밖의 작업입니다.**

### (3) ASO — 스토어 검색은 별개입니다

"경쟁사 앱을 검색했을 때 나오게" 는 두 가지로 읽히는데, 이 저장소가 손댈 수 있는 건 **웹 검색뿐**입니다.

App Store / Google Play 내부 검색은 스토어 리스팅(제목 · 부제 · 키워드 필드 · 설명)이 결정하며, 별도 작업입니다. 그리고 중요한 제약이 있습니다:

> **스토어 메타데이터에 경쟁사 브랜드명을 넣는 것은 Apple · Google 양쪽 정책 위반이며 심사 거절 사유입니다.** 자사 웹사이트의 비교 페이지에 경쟁사명을 쓰는 것은 문제없지만, 스토어 제목 · 부제 · 키워드 필드에 "제타", "크랙" 같은 이름을 넣으면 안 됩니다.

현재 `NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_GOOGLE_PLAY_URL`이 비어 있어 스토어 등록 자체가 없는 상태로 보입니다. **앱이 스토어에 올라가 있는지 확인이 필요하고**, 있다면 ASO는 별도로 진행해야 합니다.

### (4) 콘텐츠와 링크 — 시간이 걸리는 쪽

지금 petty.im은 백링크가 사실상 없고 페이지 수가 적습니다. 기술적 준비가 끝났다고 순위가 오르지는 않습니다.

- 이 카테고리의 실제 추천 경로는 **커뮤니티**입니다(아카라이브 AI 채팅 채널, DC 제타 · AI채팅 갤러리, 나무위키). 검색 상단도 이들이 차지합니다.
- AI 검색(ChatGPT · Perplexity)에서는 **인용**이 먼저 오고 **추천**은 나중입니다. 자사 비교 페이지는 인용은 받아도, 추천으로 바뀌려면 외부의 리뷰 · 커뮤니티 언급이 쌓여야 합니다.
- 현실적인 기대치는 **3~6개월**입니다.

---

## 5. 다음에 하면 좋은 것 (우선순위 순)

1. **네이버 소유확인 · 사이트맵 제출 마무리, 다음 · 빙 등록** — 위 (1). 구글은 완료.
2. **스토어 URL 설정** — 앱이 App Store · Google Play에 올라가 있다면 `NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_GOOGLE_PLAY_URL`을 설정하세요. 스토어 배지가 노출되고 구조화 데이터에 `installUrl`이 붙습니다. 지금은 비어 있어 둘 다 빠져 있습니다.
3. **비교 페이지 내용 검증** — Petty의 요금 정책, 무료 한도, 캐릭터 수를 확인해 표에 채우기. 지금은 확인된 사실만 적혀 있어 비어 보이는 칸이 있습니다.
4. **일본어 랜딩 강화** — 제타가 일본에서 검증한 시장입니다. `/ja`가 이제 색인 가능해졌으니 일본어 콘텐츠를 늘릴 가치가 있습니다.
5. **정적 렌더링 전환** — 현재 랜딩은 요청 시 렌더입니다(루트 레이아웃이 요청 헤더로 언어를 읽음). 라우트 그룹으로 언어별 루트 레이아웃을 두면 정적 생성이 가능해지고 LCP · TTFB가 개선됩니다. 이번 작업 범위 밖으로 뒀습니다.
6. **OG 이미지 언어별 분리** — 현재 `app/opengraph-image.tsx` 하나를 세 언어가 공유합니다.
