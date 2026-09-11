# petty.im 분석 추적 계획 (GA4, 2026-09-11)

검색엔진 등록 현황은 [seo.md](./seo.md) 참고.

## 한눈에

| 항목 | 값 |
| --- | --- |
| GA4 계정 / 속성 | Hyunjoong(314466432) / `petty.im`(553726057) |
| 웹 스트림 | `https://petty.im`, 스트림 ID 15758124319 |
| 측정 ID | `G-CE60K0C3XY` — Vercel `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Production 전용) |
| 시간대 · 통화 | 대한민국(GMT+09:00) · KRW |
| 데이터 보관 | 이벤트 · 사용자 데이터 모두 14개월 |
| Google 신호 | 사용 안 함 (속성 데이터 수집 설정에서 꺼져 있고, `gtag('config')`에서도 `allow_google_signals: false`) |
| 광고 개인 최적화 | `gtag('config')`에서 `allow_ad_personalization_signals: false`. Google Ads 연결 없음 |
| Search Console 연결 | `sc-domain:petty.im` ↔ 웹 스트림 `petty.im` |

측정 ID는 Production 환경변수에만 있습니다. 로컬 개발과 Preview 배포에서는 Google 스크립트가 아예 출력되지 않으므로 운영 데이터가 오염되지 않습니다.

## 설계 원칙

- **전환은 하나로 모읍니다.** `app.petty.im`으로 가는 모든 링크는 `open_app_click` 하나로 보내고, 어디서 눌렀는지는 `cta_location`으로 나눕니다. 주요 이벤트 하나로 퍼널을 보고, 위치별로 쪼개 봅니다.
- **클릭은 속성으로, 코드로는 최소한만.** 클릭 추적은 요소에 `data-ga-*` 속성을 붙이면 루트 레이아웃의 `AnalyticsListener`가 문서 전체 클릭을 위임 수신해 보냅니다. 서버 컴포넌트(비교 · 약관 페이지)도 클라이언트로 바꾸지 않고 추적됩니다. 속성은 `trackingAttributes(event, params)`로만 만들며, 이벤트 이름과 파라미터는 `lib/analytics/events.ts`의 타입이 강제합니다.
- **페이지뷰는 GA4 향상된 측정에 맡깁니다.** `next/link` 클라이언트 이동도 "브라우저 방문 기록 기반 페이지 변경"으로 잡히므로 코드에서 `page_view`를 따로 보내지 않습니다(중복 집계 방지).
- **개인정보는 보내지 않습니다.** 이메일(`mailto:`) 링크는 `contact_click` 이벤트만 보내고 주소는 파라미터에 넣지 않습니다.

## 이벤트

| 이벤트 | 파라미터 | 발생 위치 |
| --- | --- | --- |
| `open_app_click` ★ | `cta_location`, `character_id`(대화창만) | `header` 헤더 CTA · `hero` 히어로 · `character_dialog` 캐릭터 대화창 · `character_more` 캐릭터 더보기 · `download` 다운로드 버튼 · `download_qr` QR · `comparison_header` / `comparison_cta` 비교 페이지 · `hub_header` / `hub_cta` 비교 허브 · `legal_header` 약관 · 방침 |
| `store_badge_click` ★ | `store`(`app_store` / `google_play`), `cta_location`(`hero` / `download`) | App Store · Google Play 배지. 스토어 URL 환경변수가 설정돼야 배지가 보이므로 **지금은 발생하지 않습니다.** |
| `select_content` | `content_type`=`character`, `content_id` | 캐릭터 카드를 눌러 소개 대화창을 열 때 (GA4 권장 이벤트) |
| `navigation_click` | `nav_location`(`header` / `footer` / `hero` / `toc` / `related`), `nav_item` | 헤더 · 푸터 링크, 히어로 보조 CTA, 약관 · 비교 목차, 다른 비교 링크 |
| `contact_click` | `cta_location`(`footer` / `legal_contact` / `legal_footer` / `comparison_footer` / `hub_footer` / `business_info`) | 고객 문의 메일 링크. `business_info`는 약관 · 방침의 사업자 정보 블록 |
| `language_change` | `from_locale`, `to_locale` | 언어 선택기. 페이지 이동 전에 beacon으로 전송 |
| `menu_toggle` | `menu_state`(`open` / `close`) | 모바일 메뉴 버튼 |
| `section_view` | `section_id` | 섹션이 화면 가운데 띠를 처음 지날 때 페이지당 1회. 랜딩 `features` · `characters` · `download`, 비교 `at-a-glance` · `who` · `faq` · `cta`, 허브 `list` · `criteria` · `faq` · `cta` |

★ = 주요 이벤트(전환). 기본 값 없음, 이벤트당 1회 집계.

### GA4가 자동으로 수집하는 것 (향상된 측정)

`page_view`(SPA 이동 포함), `scroll`(90%), `click`(외부 링크 — 비교 페이지의 경쟁사 출처 링크 등), `view_search_results`, `form_start` / `form_submit`, `video_*`, `file_download`, `first_visit`, `session_start`, `user_engagement`.

`app.petty.im`은 같은 루트 도메인(`.petty.im`)이라 GA 쿠키가 공유되고, 외부 링크 클릭(`click`)으로는 잡히지 않을 수 있습니다. 앱 이동은 `open_app_click`으로 봅니다.

## 맞춤 측정기준 (이벤트 범위)

등록하지 않은 파라미터는 수집은 되지만 보고서에 나오지 않습니다. 새 파라미터를 추가하면 여기에도 등록하세요 (관리 → 데이터 표시 → 맞춤 정의).

| 측정기준 | 파라미터 |
| --- | --- |
| CTA 위치 | `cta_location` |
| 캐릭터 ID | `character_id` |
| 스토어 | `store` |
| 탐색 위치 | `nav_location` |
| 탐색 항목 | `nav_item` |
| 변경 전 언어 | `from_locale` |
| 변경 후 언어 | `to_locale` |
| 메뉴 상태 | `menu_state` |
| 섹션 | `section_id` |
| 선택한 콘텐츠 ID | `content_id` |

## 이 데이터로 답하려는 질문

- 방문자가 앱으로 넘어가는 비율과, 어느 버튼이 그 이동을 만드는지 (`open_app_click` × `cta_location`)
- 어떤 캐릭터가 관심을 끌고, 그중 무엇이 실제 이동으로 이어지는지 (`select_content` → `open_app_click`의 `character_id`)
- 랜딩을 어디까지 읽는지 (`section_view` features → characters → download)
- 비교 페이지가 검색 유입을 받아 앱 이동으로 이어지는지 (방문 페이지 `/alternatives/*` × `comparison_cta`)
- 일본어 · 영어 방문자가 언어를 바꾸는지, 어느 방향인지 (`language_change`)

## 이벤트 추가하는 법

1. `lib/analytics/events.ts`의 `AnalyticsEvents`에 이벤트와 파라미터 타입을 추가합니다. `EVENT_NAMES`에도 넣어야 컴파일됩니다.
2. 클릭이면 요소에 `{...trackingAttributes("이벤트", { ... })}`를 붙입니다. 클릭이 아닌 동작(선택 변경 등)이면 클라이언트 컴포넌트에서 `track()`을 호출합니다.
3. 새 파라미터는 GA4 맞춤 측정기준으로 등록하고 위 표를 갱신합니다.
4. 전환이면 GA4 관리 → 이벤트 → 이벤트 만들기 → "코드로 만들기"로 이름을 등록하고 주요 이벤트로 표시합니다.

## 검증하는 법

- 운영: GA4 → 보고서 → 실시간에서 이벤트 이름과 파라미터를 확인합니다. 브라우저 개발자 도구 네트워크 탭에서 `google-analytics.com/g/collect` 요청의 `en=`(이벤트 이름), `ep.`(파라미터)로도 볼 수 있습니다.
- 로컬: `.env.development.local`에 임시 측정 ID를 넣고 `npm run dev` 후 콘솔에서 `window.dataLayer`를 확인합니다. 확인 후 파일을 지우세요. 운영 ID를 넣으면 개발 트래픽이 운영 데이터에 섞입니다.
