# petty-im

페티 앱([app.petty.im](https://app.petty.im))의 공식 랜딩페이지. Next.js 16 + Vercel, `petty.im` 도메인.

## 실행 및 검증

```sh
npm install
npm run dev
npm run verify
```

Node.js 22.x / npm 10.x. 이 랜딩페이지를 실행하는 데 데이터베이스는 필요하지 않습니다.

## 운영 정보

- 앱 연결: `content/app-links.ts`의 `PETTY_APP_URL`.
- App Store / Google Play 링크: 실제 URL이 있을 때만 `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_GOOGLE_PLAY_URL`로 설정합니다. 미설정 시 스토어 배지는 표시하지 않습니다.
- 사업자 정보: `content/legal/business.ts`. 푸터와 정책 페이지가 같은 정보를 사용합니다.
- 약관 및 개인정보처리방침: `/terms`, `/privacy` (한국어 원문).
- 다국어: 한국어·일본어·영어. 국가·브라우저 언어 자동 선택 및 수동 선택 저장은 `docs/design/localization.md` 참고.

기존 이메일 신청 서비스는 종료했습니다. `/api/waitlist`는 `410 Gone`을 반환하며 요청 본문을 읽거나 DB에 연결하지 않습니다. 이전 데이터·테이블을 자동 삭제하지 않으며, 기존 보유 정보의 정리는 운영자가 확인해 별도로 진행합니다. `lib/waitlist`의 과거 처리 모듈은 운영 경로에서 사용하지 않습니다.

## 배포

Vercel에 이 저장소를 연결하고 `petty.im`을 설정합니다. 실제 앱인 `app.petty.im`과는 별도 프로젝트입니다. 사업자 정보·앱 연결 주소는 배포 전에 실제 운영값과 일치하는지 확인합니다.
