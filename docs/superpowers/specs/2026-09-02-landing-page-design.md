# petty-im 랜딩페이지 설계

**작성일**: 2026-09-02
**상태**: 승인됨 — 구현 계획(writing-plans) 단계로 이관 예정

## 배경과 목적

`petty`는 AI 캐릭터와 대화하며 역할극·스토리를 즐기는 모바일 하이브리드 앱(Next.js 16
static export + Capacitor + Amplify Gen2)이다. `app.petty.im` 도메인으로 배포된다.

`petty-im`은 이 앱의 **공식 랜딩페이지**로, `petty.im` 도메인에 별도로 배포한다. 앱은 아직
미출시(개발/내부 테스트 단계)이므로, 랜딩페이지의 1차 목표는 스토어 다운로드 유도가 아니라
**이메일 대기자 명단 수집(출시 사전 알림)**이다.

## 프로젝트 관계

- `petty-im`은 `petty`와 **완전히 독립된 저장소·배포**다. 모노레포로 묶지 않는다.
- `petty`의 CLAUDE.md에 있는 정적 export 제약(동적 라우트 세그먼트 금지, Route
  Handler·middleware·`cookies()`/`headers()` 금지)은 **Capacitor 앱을 정적 파일로 구워
  네이티브 셸에 넣기 위한 제약**이다. `petty-im`은 일반 Vercel 서버리스 배포이므로 이 제약이
  **적용되지 않는다** — Route Handler로 대기자 폼을 처리한다.
- 디자인 시스템(3계층 토큰, Pretendard 폰트, 브랜드 에셋)은 `petty`에서 **복사**해서
  이식한다. 공유 패키지로 묶는 모노레포 구조는 지금 범위를 넘는 결정이라 채택하지 않는다.
  복사이므로 두 저장소의 토큰이 시간이 지나며 어긋날 수 있다(드리프트) — 받아들이는 비용이다.

## 비주얼 방향

petty 앱에는 두 가지 시각 레지스터가 있다.

1. **로그인 화면 레지스터** — 캐릭터 이미지·그라디언트·glow 전면 금지, 절제된 카드 하나.
2. **웰컴 화면 레지스터** — `welcome-background.png`(별이 빛나는 도시 야경을 바라보는
   캐릭터 일러스트) 풀블리드 + `bg-background-deep/50` 스크림 + 헤드라인에 인라인 워드마크.

랜딩페이지 히어로는 **웰컴 화면 레지스터**를 따른다. 마케팅 목적의 첫 화면이므로 앱의
브랜드 일러스트를 전면에 쓰는 쪽이 맞다(사용자 확인 완료).

워드마크 이미지(`wordmark.png`)에는 핑크 하트가 포함되어 있다 — 래스터 이미지 자체에 박혀
있으므로 별도 색상 토큰을 만들 필요가 없다.

## 디자인 시스템 이식

`petty`에서 다음을 `petty-im`으로 복사한다.

| petty 원본 | petty-im 대상 |
| --- | --- |
| `design-system/styles/primitives.css` | 동일 경로, 동일 구조 (1계층 원시 팔레트) |
| `app/globals.css`의 `:root` semantic 매핑 + `@theme inline` | `app/globals.css` (2/3계층) |
| `app/fonts.ts` + `app/fonts/PretendardVariable.woff2` | 동일 경로, 동일 `next/font/local` 계약 |
| `public/licenses/Pretendard-OFL-1.1.txt` | 동일 경로 |
| `public/assets/wordmark.png`, `welcome-background.png` | 동일 경로 |
| `components/ui/wordmark.tsx` | 동일 컴포넌트(필요한 variant만) |

**주의 (petty CLAUDE.md에서 이미 확인된 함정)**:

- `create-next-app`과 `shadcn init`은 **Geist 폰트를 주입**한다. Geist에는 한글 글리프가
  없어 한국어가 OS 폴백 폰트로 렌더된다. `shadcn init`을 실행하지 않고, `shadcn add
  <component>`만 add-only로 쓴 뒤 `app/layout.tsx`·`app/globals.css`의 diff를 확인해
  주입된 폰트/팔레트를 제거한다.
- Next.js 16은 이전 버전과 breaking change가 있다. 구현 착수 전
  `petty/node_modules/next/dist/docs/`(petty 프로젝트에 이미 설치돼 있음)를 먼저 읽는다.

## 페이지 구조 (싱글 페이지)

1. **히어로** — `welcome-background.png` + 스크림, 헤드라인("당신만의 이야기, `Petty`와
   함께"), 서브카피, 대기자 이메일 폼.
2. **기능 하이라이트 3장** — 캐릭터와의 대화(chat) · 나만의 캐릭터 만들기(create) ·
   세계관과 스토리(worldbooks/stories). petty 앱에 **실제로 존재하는 기능**만 다루고,
   장식적 과장 카피를 쓰지 않는다.
3. **푸터** — 저작권, 문의처.

FAQ, 스토어 배지, 사용자 후기는 이 단계에서 제외한다. 채울 실데이터가 없는 상태에서
placeholder 콘텐츠를 만들지 않는다(YAGNI).

콘텐츠 등급: 전체 연령가 콘셉트("이야기·역할극 경험")로 소개한다. 앱 내부에 있는 연령
인증·성인향 콘텐츠는 랜딩페이지에서 언급하지 않는다.

## 카피 초안

petty 앱의 기존 웰컴 화면 톤(`features/welcome/welcome-content.ts`)을 그대로 재사용한다.

| 자리 | 카피 |
| --- | --- |
| 헤드라인 | "당신만의 이야기, `Petty`와 함께" (워드마크 인라인) |
| 서브카피 | "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다. 가장 먼저 만나보세요." |
| 폼 CTA | "가장 먼저 알림받기" |
| 제출 중 | "등록하는 중…" |
| 성공 | "등록되었어요. 출시 소식을 가장 먼저 알려드릴게요." |
| 중복 이메일 | "이미 등록된 이메일이에요." |
| 이메일 형식 오류 | "올바른 이메일 주소를 입력해 주세요." |
| 네트워크 오류 | "네트워크 연결을 확인하고 다시 시도해 주세요." |
| 동의 문구 | "이메일은 출시 알림 발송 목적으로만 사용되며, 알림 발송 후 즉시 파기됩니다." |

CTA는 지금 "대기자 등록"이지만, 출시 후에는 "app.petty.im으로 이동" 또는 스토어 배지로
바뀐다. `content/landing-content.ts` **한 파일**이 CTA 카피·타깃·variant를 소유하게 해서,
전환 시점에 이 파일만 수정하면 되게 한다.

## 파일/컴포넌트 구조

petty 앱의 `features/*/{domain,application,infrastructure,presentation}` 4계층 구조는
화면 20개 이상인 앱에 맞는 구조다. 페이지 하나짜리 랜딩페이지에 그대로 옮기면 과설계이므로
훨씬 얇은 구조를 쓴다.

```text
petty-im/
  app/
    layout.tsx              # Pretendard 마운트, 메타데이터(OG, favicon)
    page.tsx                 # Hero + FeatureHighlights + SiteFooter 조립
    globals.css               # 2/3계층 토큰 (petty에서 이식)
    fonts.ts                  # next/font/local Pretendard
    fonts/PretendardVariable.woff2
    api/waitlist/route.ts     # POST만
  components/
    ui/                       # shadcn add-only: button, input, label (필요한 것만)
    landing/
      Hero.tsx
      FeatureHighlights.tsx
      WaitlistForm.tsx
      SiteFooter.tsx
  content/
    landing-content.ts        # 헤드라인/설명/기능 카드/동의 문구/CTA
  lib/
    waitlist/
      schema.ts                # zod 이메일 검증
      save-waitlist-entry.ts   # 저장소 추상화 함수 하나
  design-system/styles/primitives.css   # 1계층 원시 팔레트 (petty에서 이식)
  public/assets/{wordmark.png, welcome-background.png}
  public/licenses/Pretendard-OFL-1.1.txt
```

## 데이터 흐름 — 대기자 등록

1. `WaitlistForm`이 `POST /api/waitlist`에 `{ email, consent, honeypotField }`를 보낸다.
2. Route Handler: `schema.ts`(zod)로 이메일 형식과 `consent === true`를 검증 → honeypot
   필드가 채워져 있으면 조용히 성공 응답만 반환(스팸 봇에게 실패 신호를 주지 않음, 실제
   저장은 하지 않음) → `saveWaitlistEntry(email)` 호출.
3. `saveWaitlistEntry`: 저장소에 email unique 제약을 건다. 중복이면 도메인 오류를 던지고,
   라우트가 이를 사용자용 문구("이미 등록된 이메일이에요")로 매핑한다 — petty 로그인
   화면의 안전한 에러 매퍼와 같은 패턴으로, SDK/DB 원문 오류를 그대로 노출하지 않는다.
4. 간단한 rate limit(같은 IP 다회 요청 제한)을 Route Handler 레벨에 둔다.
5. 저장소 구현(Vercel Storage 등)은 `save-waitlist-entry.ts` **내부에만** 존재한다. 실제
   프로비저닝은 Vercel 대시보드의 Storage 탭에서 무엇을 쓸 수 있는지 확인한 뒤 결정한다 —
   폼과 라우트는 구현을 모르므로 나중에 바꿔도 그 파일만 수정하면 된다.

상태 표시는 petty 로그인 화면과 같은 패턴을 따른다 — 고정 높이(`min-h-11`)
`aria-live="polite"` 문구 영역을 항상 렌더링해 오류가 나타나도 CTA 위치가 튀지 않게 한다.
제출 중에는 이메일 인풋과 제출 버튼을 native `disabled`로 잠가 중복 제출을 막는다.

## 개인정보 처리

별도 `/privacy` 페이지는 지금 만들지 않는다(사용자 확인 완료). 폼 바로 아래에 수집 항목
(이메일), 목적(출시 알림 발송), 보유기간(발송 후 즉시 파기), 동의 거부 시 불이익 없음을
짧게 명시하고, 제출 전 필수 체크박스로 동의를 받는다.

## 테스트

- `schema.ts`(이메일 검증 + consent 필수) — 유닛 테스트.
- `save-waitlist-entry.ts`(중복 처리, 저장 성공) — 유닛 테스트.
- `app/api/waitlist/route.ts` — 통합 테스트: 정상 등록, 중복 이메일, 잘못된 이메일 형식,
  consent 누락, honeypot 감지.
- `landing-content.ts`의 정적 카피 문자열 자체에 대한 스냅샷 테스트는 만들지 않는다 — 낮은
  가치 대비 유지 비용이 더 크다.
- UI 컴포넌트(Hero/FeatureHighlights/WaitlistForm)는 개발 서버에서 직접 눈으로 확인한다
  (petty 저장소의 검증 규칙과 같은 원칙 — "화면 확인은 개발 서버에서 직접 한다").

## 이 설계에서 제외한 것 (차후 논의)

- 스토어 배지, FAQ, 사용자 후기 — 제품 실체가 아직 없어 지금 만들면 placeholder가 된다.
- 뉴스레터/출시 알림 **발송** 기능 — 이 설계는 수집까지만 다룬다. 발송은 대기자 명단이
  쌓인 뒤 별도로 설계한다.
- `/privacy` 별도 페이지 — 인라인 동의 문구로 충분하다고 판단(사용자 확인 완료). 수집
  항목이 늘어나거나 법적 요구가 생기면 재검토한다.
- Vercel Storage 구체 선택(Postgres/KV/Marketplace 등) — 대시보드 확인 후 구현 단계에서
  결정. `save-waitlist-entry.ts` 뒤에 숨어 있어 나중에 바꿔도 다른 파일에 영향 없음.
