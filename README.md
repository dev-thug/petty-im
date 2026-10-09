# petty-im

페티 앱([app.petty.im](https://app.petty.im))의 공식 랜딩페이지. Next.js 16 + Vercel, `petty.im` 도메인.

## 실행 및 검증

```sh
npm install
npm run dev
npm run verify
```

서버 실행 후 검색엔진이 받는 HTML은 Python 3 표준 라이브러리만으로 검사할 수 있습니다. 사이트맵의 모든 페이지에서 HTTP 응답, 제목·설명, H1, canonical, hreflang, 색인·스니펫 차단 여부와 JSON-LD 구문을 확인합니다.

```sh
python3 scripts/check_seo.py --base-url http://localhost:3002
python3 scripts/check_seo.py --base-url https://petty.im
```

이 검사는 기술적 회귀 검사이며 실제 색인 여부·검색 순위·Core Web Vitals 측정을 대신하지 않습니다.

Node.js 22.x / npm 10.x. 이 랜딩페이지를 실행하는 데 데이터베이스는 필요하지 않습니다.

폰트는 `app/globals.css`에서 설치된 Pretendard 1.3.9의 가변 다이나믹 서브셋 CSS를 가져옵니다. 빌드가 WOFF2 파일을 같은 사이트의 정적 자산으로 내보내고, 브라우저는 `unicode-range`에 따라 필요한 파일만 받습니다. 전체 2MB 폰트를 다시 추가하거나 모든 서브셋을 preload하지 마세요. 한글 전체 음절·ASCII 범위와 서브셋 파일 무결성은 `app/fonts.test.ts`에서 검증합니다. OFL 고지는 `public/licenses/Pretendard-OFL-1.1.txt`에 유지합니다.

## 운영 정보

- 앱 연결: `content/app-links.ts`의 `PETTY_APP_URL`.
- App Store / Google Play 링크: 실제 URL이 있을 때만 `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_GOOGLE_PLAY_URL`로 설정합니다. 미설정 시 스토어 배지는 표시하지 않습니다.
- 사업자 정보: `content/legal/business.ts`. 푸터와 정책 페이지가 같은 정보를 사용합니다.
- 약관 및 개인정보처리방침: `/terms`, `/privacy` (한국어 원문).
- 다국어: 한국어 `/`, 일본어 `/ja`, 영어 `/en`. 경로가 언어를 결정하며 자동 선택은 `/`의 브라우저 진입에만 적용됩니다. `docs/design/localization.md` 참고.
- 경쟁사 비교 페이지: `/alternatives`, `/alternatives/[slug]`. 내용은 `content/comparisons/`.
- 검색엔진 소유확인: `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 등 설정 시에만 메타태그가 출력됩니다. Google은 Route 53 DNS TXT로 확인했습니다. 현황은 `docs/marketing/seo.md` 참고.
- 사이트맵 · RSS: `/sitemap.xml`, `/rss.xml`(비교 글). 사이트맵 `lastmod`는 콘텐츠 날짜 상수에서 나오므로, 랜딩 · 비교 · 약관 내용을 고치면 `LANDING_UPDATED_AT` / `COMPARISON_UPDATED_AT` / 문서 `updatedAt`도 함께 올립니다.
- 분석(GA4): `NEXT_PUBLIC_GA_MEASUREMENT_ID`가 설정된 배포에서만 gtag가 로드됩니다(Vercel Production 전용). 클릭 추적은 `trackingAttributes()`로 붙이는 `data-ga-*` 속성으로 합니다. 이벤트 목록과 추가 방법은 `docs/marketing/analytics.md` 참고.

기존 이메일 신청 서비스는 종료했습니다. `/api/waitlist`는 이전 클라이언트를 위해 `410 Gone`만 반환하며 요청 본문을 읽거나 DB에 연결하지 않습니다. 과거 처리 모듈(`lib/waitlist`)과 `postgres` 의존성은 제거했고, 구현 이력은 `docs/superpowers/plans/2026-09-02-landing-page.md`에 남아 있습니다. 이전 데이터·테이블을 자동 삭제하지 않으며, 기존 보유 정보의 정리는 운영자가 확인해 별도로 진행합니다.

## 배포

Vercel 프로젝트 `petty-im`의 Production 브랜치는 `develop`입니다. 대표 도메인은 `petty.im`이며 `www.petty.im`은 `petty.im`으로 308 리다이렉트합니다(canonical · sitemap이 apex 기준이므로 뒤집지 마세요). 실제 앱인 `app.petty.im`과는 별도 프로젝트입니다. 사업자 정보·앱 연결 주소는 배포 전에 실제 운영값과 일치하는지 확인합니다.
