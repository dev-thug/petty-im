# petty-im

petty 앱(app.petty.im)의 공식 랜딩페이지. Next.js 16 + Vercel, `petty.im` 도메인.

## 요구사항

- Node.js **22.23.1** · npm **10.9.8** (`.node-version`, `package.json`의 `engines`)
- Postgres 데이터베이스 하나 (Vercel Storage 탭, Neon, Supabase 등 어디든 가능)

## 설치

```sh
npm install
```

## 환경변수

`.env.example`을 `.env.local`로 복사하고 `DATABASE_URL`을 실제 Postgres connection
string으로 채운다. 처음 한 번은 `lib/waitlist/schema.sql`을 그 데이터베이스에
수동으로 실행해 `waitlist_entries` 테이블을 만든다.

## 실행

```sh
npm run dev
```

## 검증

```sh
npm run verify
```

vitest 스위트 · 타입체크 · ESLint · 프로덕션 빌드를 순서대로 돌린다.

## 배포

Vercel에 이 저장소를 연결하고 `DATABASE_URL` 환경변수를 프로젝트 설정에 등록한
뒤 `petty.im` 도메인을 연결한다. `app.petty.im`(petty 앱)과는 별도 프로젝트다.

## 설계 문서

- [docs/superpowers/specs/2026-09-02-landing-page-design.md](docs/superpowers/specs/2026-09-02-landing-page-design.md)
- [docs/superpowers/plans/2026-09-02-landing-page.md](docs/superpowers/plans/2026-09-02-landing-page.md)
