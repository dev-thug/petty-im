# petty-im 랜딩페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** petty.im에 배포할 Next.js 16 랜딩페이지를 만든다 — petty 앱(app.petty.im)의 브랜드 톤을 이식한 히어로, 기능 소개, 이메일 대기자 명단 폼으로 구성된 싱글 페이지.

**Architecture:** petty와 완전히 독립된 Next.js 16 App Router 프로젝트. petty의 3계층 디자인 토큰·Pretendard 폰트·브랜드 에셋을 복사해 이식하고, 대기자 등록은 Route Handler(`app/api/waitlist/route.ts`)가 Postgres에 저장한다. 저장 로직은 `saveWaitlistEntry()` 함수 뒤에 완전히 숨겨 스토리지 구현을 나중에 바꿀 수 있게 한다.

**Tech Stack:** Next.js 16.3.0 (App Router) · React 19.2.8 · TypeScript · Tailwind CSS v4 · shadcn(radix-nova) · zod · postgres(porsager) · Vitest

**Spec:** [docs/superpowers/specs/2026-09-02-landing-page-design.md](../specs/2026-09-02-landing-page-design.md)

## Global Constraints

- Node **22.23.1**, npm **10.9.8** — petty와 동일 버전으로 고정한다(`.node-version`, `package.json` `engines`).
- Next.js **16.3.0**, React **19.2.8**, TypeScript **^5.9.3** — petty와 동일 버전.
- **Next.js 16 breaking change 반영** (이미 이 계획에 접목됨, 별도 조사 불필요):
  `next/image`는 `priority`가 아니라 `preload` prop을 쓴다. Route Handler는
  `export async function POST(request: Request)` 시그니처와 `Response.json(...)`을
  쓴다(`NextRequest`/`NextResponse` import 불필요). `next dev`/`next build`는
  Turbopack이 기본이라 `--turbopack` 플래그가 필요 없다.
- **Geist 폰트를 주입하지 않는다.** `create-next-app`/`shadcn init`을 쓰지 않고 이 계획의
  파일을 직접 작성한다. 폰트는 Pretendard만 쓴다.
- **shadcn은 add-only.** `npx shadcn@4.18.0 add <component> --yes`만 쓰고 `shadcn init`은
  절대 실행하지 않는다. `components.json`은 Task 1에서 이미 손으로 만들어 둔다.
- **petty의 `max-w-mobile`(480px) 모바일 셸 제약을 따르지 않는다.** petty-im은 마케팅
  웹사이트이지 하이브리드 앱 화면이 아니다 — 일반 반응형 데스크톱 레이아웃을 쓴다.
- **디자인 토큰(색상·타이포·radius)은 petty의 값을 그대로 재사용**하고 새 원시 색상을
  만들지 않는다.
- **CTA·카피는 `content/landing-content.ts` 한 파일이 소유**한다. 다른 파일은 이 파일의
  export만 참조하고 문자열을 직접 쓰지 않는다.
- **별도 `/privacy` 페이지는 만들지 않는다.** 폼 안의 인라인 동의 문구로 충분하다(사용자
  승인됨, 스펙 참고).
- **대기자 저장소는 `saveWaitlistEntry()` 뒤에 숨긴다.** 이 계획은 Postgres(호스팅 불문,
  connection string 기반의 `postgres` 패키지)를 구체 구현으로 선택했다 — 어떤 Postgres
  공급자를 실제로 쓸지는 배포 시점에 정하면 되고, 코드는 `DATABASE_URL` 환경변수만 본다.

## File Structure Overview

```text
petty-im/
  .node-version
  .gitignore
  .env.example
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  eslint.config.mjs
  vitest.config.ts
  components.json
  README.md
  app/
    layout.tsx                    # Pretendard 마운트, 메타데이터(OG)
    page.tsx                       # Hero + FeatureHighlights + SiteFooter 조립
    icon.tsx                       # 코드로 생성하는 favicon (violet cursor)
    globals.css                    # 2/3계층 토큰 (petty에서 이식)
    fonts.ts                       # next/font/local Pretendard
    fonts/PretendardVariable.woff2
    api/waitlist/route.ts          # POST 전용, 얇은 wiring
  components/
    ui/
      wordmark.tsx                 # petty에서 이식
      button.tsx, input.tsx, label.tsx, checkbox.tsx   # shadcn add-only
    landing/
      Hero.tsx
      FeatureHighlights.tsx
      SiteFooter.tsx
      WaitlistForm.tsx              # "use client"
  content/
    landing-content.ts              # 헤드라인/설명/기능카드/폼카피/에러메시지/CTA
  lib/
    utils.ts                        # cn() — petty와 동일한 tailwind-merge 커스텀 그룹
    waitlist/
      schema.ts                     # zod 요청 검증
      schema.test.ts
      rate-limit.ts                 # IP당 요청 제한
      rate-limit.test.ts
      error-code.ts                 # 서버 에러코드 → WaitlistErrorCode 매핑
      error-code.test.ts
      save-waitlist-entry.ts        # 스토리지 추상화 (WaitlistStore, DuplicateEmailError)
      postgres-store.ts             # Postgres 구현체
      postgres-store.test.ts
      handle-waitlist-request.ts    # 순수 핸들러 (deps 주입, 테스트 대상)
      handle-waitlist-request.test.ts
      db.ts                         # getSql() — DATABASE_URL 지연 평가
      db.test.ts
      schema.sql                    # waitlist_entries 테이블 DDL (수동 실행)
  public/
    assets/
      wordmark.png                  # petty에서 이식
      welcome-background.png        # petty에서 이식
    licenses/
      Pretendard-OFL-1.1.txt        # petty에서 이식
  docs/superpowers/
    specs/2026-09-02-landing-page-design.md
    plans/2026-09-02-landing-page.md
```

---

### Task 1: Next.js 16 프로젝트 스캐폴드

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `.node-version`
- Create: `.gitignore`
- Create: `components.json`
- Create: `app/globals.css` (임시 최소 버전 — Task 2가 전체 교체)
- Create: `app/layout.tsx` (임시 최소 버전 — Task 2/11이 갱신)
- Create: `app/page.tsx` (임시 최소 버전 — Task 9/11이 갱신)

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`,
  `npm test`, `npm run verify` 스크립트. 이후 모든 태스크가 이 스크립트로 검증한다.

`create-next-app`이나 `shadcn init`은 쓰지 않는다 — 둘 다 Geist 폰트를 주입하고, 이미
petty에서 검증된 정확한 설정을 손으로 옮기는 편이 예측 가능하다.

- [ ] **Step 1: `package.json` 작성**

```json
{
  "name": "petty-im",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": "22.x",
    "npm": "10.x"
  },
  "packageManager": "npm@10.9.8",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "verify": "npm test && npm run typecheck && npm run lint && npm run build"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "next": "16.3.0",
    "postgres": "^3.4.5",
    "pretendard": "1.3.9",
    "radix-ui": "^1.6.7",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.0",
    "shadcn": "^4.18.0",
    "tailwindcss": "^4",
    "typescript": "^5.9.3",
    "vitest": "^3.2.7"
  }
}
```

- [ ] **Step 2: `tsconfig.json` 작성**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: `next.config.ts` 작성**

petty의 `output: "export"`(Capacitor 정적 export용)는 여기 적용되지 않는다 — 일반
Vercel 서버리스 배포이므로 빈 설정으로 시작한다.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: `postcss.config.mjs` 작성**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: `eslint.config.mjs` 작성**

petty의 lucide-react 아이콘 레지스트리 규칙은 petty-im에는 없다(아이콘을 직접 쓰는
곳이 shadcn Checkbox 하나뿐이라 레지스트리를 둘 이유가 없다).

```js
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
  },
]);
```

- [ ] **Step 6: `vitest.config.ts` 작성**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 7: `.node-version` 작성**

```
22.23.1
```

- [ ] **Step 8: `.gitignore` 작성**

```
# dependencies
node_modules/

# Next.js
.next/
out/

# test coverage
coverage/
*.tsbuildinfo

# local environment files
.env
.env.*
!.env.example

# operating system files
.DS_Store
Thumbs.db

# editor files
.idea/
.vscode/
*.swp
*.swo
```

- [ ] **Step 9: `components.json` 작성**

petty와 동일한 shadcn 설정(`radix-nova` 스타일)을 쓴다 — Task 3에서 이 설정으로
`shadcn add`를 실행한다.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 10: 임시 `app/globals.css` 작성** (Task 2가 전체 교체)

```css
@import "tailwindcss";

body {
  margin: 0;
}
```

- [ ] **Step 11: 임시 `app/layout.tsx` 작성** (Task 2/11이 갱신)

```tsx
import type { ReactNode } from "react";

import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 12: 임시 `app/page.tsx` 작성** (Task 9/11이 갱신)

```tsx
export default function LandingPage() {
  return <main>petty</main>;
}
```

- [ ] **Step 13: 의존성 설치**

```bash
npm install
```

- [ ] **Step 14: 빌드로 검증**

```bash
npm run build
```

Expected: `Compiled successfully` — 에러 없이 `.next/`가 생성된다.

- [ ] **Step 15: dev 서버로 검증**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -sf http://localhost:3000 > /dev/null && echo "OK: dev server responded"
kill $DEV_PID
```

- [ ] **Step 16: 커밋**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts \
  postcss.config.mjs eslint.config.mjs vitest.config.ts .node-version \
  .gitignore components.json app/globals.css app/layout.tsx app/page.tsx
git commit -m "chore: Next.js 16 프로젝트 스캐폴드"
```

---

### Task 2: 디자인 토큰 · Pretendard 폰트 · 브랜드 에셋 이식

**Files:**
- Create: `design-system/styles/primitives.css`
- Modify: `app/globals.css` (Task 1의 임시 버전을 전체 교체)
- Create: `app/fonts.ts`
- Create: `app/fonts/PretendardVariable.woff2` (petty에서 복사, 바이너리)
- Create: `public/licenses/Pretendard-OFL-1.1.txt` (petty에서 복사)
- Create: `public/assets/wordmark.png` (petty에서 복사, 바이너리)
- Create: `public/assets/welcome-background.png` (petty에서 복사, 바이너리)
- Create: `components/ui/wordmark.tsx`
- Create: `lib/utils.ts`
- Modify: `app/layout.tsx` (Pretendard 폰트 변수 적용)

**Interfaces:**
- Produces: `cn(...)` from `lib/utils.ts` — 이후 모든 컴포넌트가 클래스 병합에 쓴다.
  `Wordmark({ size?: "header" | "signature" | "display"; className?: string })` — Hero가
  쓴다(Task 9).

petty와 완전히 같은 값을 옮긴다. 원본을 수정하지 않고 그대로 복사한다.

- [ ] **Step 1: petty에서 바이너리·에셋 파일 복사**

petty-im 루트에서 실행한다(petty와 petty-im이 형제 디렉토리라고 가정).

```bash
mkdir -p app/fonts public/assets public/licenses design-system/styles components/ui
cp /Users/hyunjoong/petty/app/fonts/PretendardVariable.woff2 app/fonts/PretendardVariable.woff2
cp /Users/hyunjoong/petty/public/licenses/Pretendard-OFL-1.1.txt public/licenses/Pretendard-OFL-1.1.txt
cp /Users/hyunjoong/petty/public/assets/wordmark.png public/assets/wordmark.png
cp /Users/hyunjoong/petty/public/assets/welcome-background.png public/assets/welcome-background.png
```

- [ ] **Step 2: `design-system/styles/primitives.css` 작성** (petty와 동일)

```css
:root {
  /* v2 ink surfaces and text, kept private to the primitive layer. */
  --app-ink-canvas: oklch(0.160291 0.022335 267.05);
  --app-ink-deep: oklch(0.144318 0.019132 261.16);
  --app-ink-surface-1: oklch(0.200634 0.023506 265.44);
  --app-ink-surface-2: oklch(0.227226 0.024629 266.92);
  --app-ink-surface-3: oklch(0.253632 0.027589 269.17);
  --app-ink-border: oklch(0.293978 0.024798 268.42);
  --app-ink-border-strong: oklch(0.357264 0.028997 268.83);
  --app-ink-control-boundary: oklch(0.54 0.035 285);
  --app-ink-foreground: oklch(0.973517 0.005423 274.97);
  --app-ink-foreground-secondary: oklch(0.830331 0.014285 272.66);
  --app-ink-muted: oklch(0.653830 0.021566 270.09);
  --app-ink-disabled: oklch(0.510089 0.023392 267.09);

  /* v2 brand states. Hover is the fixed-lightness correction for white text. */
  --app-violet-primary: oklch(0.572802 0.230744 300.32);
  --app-violet-hover: oklch(0.590 0.218875 303.13);
  --app-violet-active: oklch(0.513559 0.222686 299.28);
  --app-violet-soft: oklch(0.294121 0.081329 303.32);
  --app-violet-mist: oklch(0.714468 0.176645 305.06);

  /* Status colors stay private; roles decide where they can be used. */
  --app-red-destructive: oklch(0.48 0.18 25);
  --app-red-error: oklch(0.664468 0.184442 19.03);
  --app-green-success: oklch(0.788113 0.162233 160.34);
  --app-orange-warning: oklch(0.783529 0.153396 59.67);
  --app-blue-info: oklch(0.699864 0.158296 257.98);
  --app-white: oklch(1 0 0);
}
```

- [ ] **Step 3: `app/globals.css` 전체 교체** (petty와 동일 — `@source not` 줄은 petty-im에
  없는 디렉토리를 가리키므로 제거)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "../design-system/styles/primitives.css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Surface and text roles. */
  --background: var(--app-ink-canvas);
  --background-deep: var(--app-ink-deep);
  --surface-1: var(--app-ink-surface-1);
  --surface-2: var(--app-ink-surface-2);
  --surface-3: var(--app-ink-surface-3);
  --foreground: var(--app-ink-foreground);
  --text-primary: var(--app-ink-foreground);
  --text-secondary: var(--app-ink-foreground-secondary);
  --text-muted: var(--app-ink-muted);
  --text-disabled: var(--app-ink-disabled);

  /* shadcn-compatible aliases routed through v2 surfaces and text roles. */
  --card: var(--surface-1);
  --card-foreground: var(--text-primary);
  --popover: var(--surface-1);
  --popover-foreground: var(--text-primary);
  --secondary: var(--surface-2);
  --secondary-foreground: var(--text-secondary);
  --muted: var(--surface-2);
  --muted-foreground: var(--text-muted);
  --accent: var(--surface-3);
  --accent-foreground: var(--text-primary);
  --surface-raised: var(--surface-2);

  /* Quiet structural edge, emphasized edge, and WCAG 1.4.11 boundary. */
  --border: var(--app-ink-border);
  --border-strong: var(--app-ink-border-strong);
  --input: var(--app-ink-control-boundary);
  --control-boundary: var(--app-ink-control-boundary);

  /* Brand and state roles. */
  --primary: var(--app-violet-primary);
  --primary-hover: var(--app-violet-hover);
  --primary-active: var(--app-violet-active);
  --primary-soft: var(--app-violet-soft);
  --primary-foreground: var(--app-white);
  --highlight: var(--primary);
  --character-accent: var(--primary);
  --ring: var(--app-violet-mist);
  --destructive: var(--app-red-destructive);
  --destructive-foreground: var(--app-white);
  --error: var(--app-red-error);
  --error-foreground: var(--background);
  --success: var(--app-green-success);
  --success-foreground: var(--background);
  --warning: var(--app-orange-warning);
  --warning-foreground: var(--background);
  --info: var(--app-blue-info);
  --info-foreground: var(--background);
  --scrim: color-mix(in oklch, var(--background-deep) 72%, transparent);

  /* Geometry and page rhythm. */
  --radius: 1rem;
  --page-spacing: 1rem;
}

@theme inline {
  --color-background: var(--background);
  --color-background-deep: var(--background-deep);
  --color-surface-1: var(--surface-1);
  --color-surface-2: var(--surface-2);
  --color-surface-3: var(--surface-3);
  --color-surface-raised: var(--surface-raised);
  --color-foreground: var(--foreground);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-disabled: var(--text-disabled);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-input: var(--input);
  --color-control-boundary: var(--control-boundary);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-active: var(--primary-active);
  --color-primary-soft: var(--primary-soft);
  --color-primary-foreground: var(--primary-foreground);
  --color-highlight: var(--highlight);
  --color-character-accent: var(--character-accent);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-error: var(--error);
  --color-error-foreground: var(--error-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-scrim: var(--scrim);

  --radius-card: 1rem;
  --radius-field: 0.75rem;
  --radius-control: 0.75rem;
  --radius-sheet: 1.25rem;
  --radius-pill: 9999px;

  --text-display: 1.75rem;
  --text-display--line-height: 1.35;
  --text-display--font-weight: 700;
  --text-title: 1.125rem;
  --text-title--line-height: 1.45;
  --text-title--font-weight: 700;
  --text-body: 1rem;
  --text-body--line-height: 1.55;
  --text-body--font-weight: 400;
  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.5;
  --text-body-sm--font-weight: 400;
  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.4;
  --text-caption--font-weight: 500;

  --font-sans: var(--font-pretendard, "Pretendard Variable"), Pretendard,
    "Apple SD Gothic Neo", "Noto Sans KR", ui-sans-serif, system-ui,
    -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --spacing-page: var(--page-spacing);

  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 240ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-emphasis: var(--ease-out);
}

@layer base {
  * {
    @apply border-border;
  }

  html {
    min-height: 100%;
    background-color: var(--background);
    color: var(--foreground);
    color-scheme: dark;
  }

  body {
    min-height: 100dvh;
    margin: 0;
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    scroll-behavior: auto;
  }
}
```

petty의 `app-*-safe`, `app-content-with-navigation` 등 모바일 앱 셸 유틸리티는
petty-im에 필요 없어 옮기지 않는다(Global Constraints — 모바일 셸 제약 미적용).
같은 이유로 `--mobile-container`/`--container-mobile`(`max-w-mobile`)도 제외한다.
`--height-cursor`/`--tracking-wordmark`도 로그인 화면 전용 계약이라 제외한다.
`--card-shadow`/`--elevated-shadow`는 이 페이지의 어떤 컴포넌트도 소비하지 않아
함께 제외한다 — 나중에 실제로 그림자가 필요해지면 그때 토큰을 추가한다.

- [ ] **Step 4: `app/fonts.ts` 작성** (petty와 동일)

```ts
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "45 920",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--font-pretendard",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Segoe UI",
    "Malgun Gothic",
    "system-ui",
    "sans-serif",
  ],
  adjustFontFallback: false,
});
```

- [ ] **Step 5: `components/ui/wordmark.tsx` 작성** (petty와 동일)

```tsx
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const WORDMARK_SRC = "/assets/wordmark.png";
const WORDMARK_ALT = "페티";
const WORDMARK_WIDTH = 2172;
const WORDMARK_HEIGHT = 724;

const wordmarkVariants = cva("w-auto", {
  variants: {
    size: {
      header: "h-6",
      signature: "h-7",
      display: "h-9",
    },
  },
  defaultVariants: {
    size: "header",
  },
});

export type WordmarkProps = VariantProps<typeof wordmarkVariants> & {
  className?: string;
};

function Wordmark({ size, className }: WordmarkProps) {
  return (
    <Image
      alt={WORDMARK_ALT}
      className={cn(wordmarkVariants({ size }), className)}
      height={WORDMARK_HEIGHT}
      src={WORDMARK_SRC}
      width={WORDMARK_WIDTH}
    />
  );
}

export { Wordmark, wordmarkVariants };
```

- [ ] **Step 6: `lib/utils.ts` 작성** (petty와 동일 — `text-display` 등 커스텀 스케일을
  `tailwind-merge`에 등록해야 조건부 클래스가 올바르게 병합된다)

```ts
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "title", "body", "body-sm", "caption"] },
      ],
      rounded: [{ rounded: ["card", "field", "control", "sheet", "pill"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: `app/layout.tsx`에 Pretendard 폰트 변수 적용**

```tsx
import type { ReactNode } from "react";

import "@/app/globals.css";

import { pretendard } from "@/app/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={pretendard.variable} lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: `lib/utils.ts` 병합 동작을 단위 테스트로 확인**

`lib/utils.test.ts` 작성:

```ts
import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("keeps the later Tailwind class when two utilities from the same group conflict", () => {
    expect(cn("text-body", "text-display")).toBe("text-display");
  });

  it("resolves conflicts in the custom rounded scale", () => {
    expect(cn("rounded-field", "rounded-card")).toBe("rounded-card");
  });

  it("merges unrelated classes without dropping either", () => {
    expect(cn("flex", "gap-2")).toBe("flex gap-2");
  });
});
```

Run: `npm test -- lib/utils.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 9: 빌드와 dev 서버로 시각 확인**

```bash
npm run build
npm run dev &
DEV_PID=$!
sleep 3
curl -sf http://localhost:3000 > /dev/null && echo "OK"
kill $DEV_PID
```

`app/page.tsx`는 아직 Task 1의 임시 버전(`<main>petty</main>`)이라 브랜드 배경이나
워드마크는 아직 보이지 않는다 — 이 단계의 목표는 토큰·폰트가 빌드를 깨지 않는지
확인하는 것이다. 워드마크의 실제 렌더 확인은 Task 9에서 한다.

- [ ] **Step 10: 커밋**

```bash
git add design-system app/globals.css app/fonts.ts app/fonts/PretendardVariable.woff2 \
  public/licenses public/assets components/ui/wordmark.tsx lib/utils.ts lib/utils.test.ts \
  app/layout.tsx
git commit -m "feat: petty 디자인 토큰·Pretendard 폰트·브랜드 에셋 이식"
```

---

### Task 3: shadcn UI 프리미티브 추가 (button, input, label, checkbox)

**Files:**
- Create: `components/ui/button.tsx` (shadcn CLI 생성)
- Create: `components/ui/input.tsx` (shadcn CLI 생성)
- Create: `components/ui/label.tsx` (shadcn CLI 생성)
- Create: `components/ui/checkbox.tsx` (shadcn CLI 생성)
- Modify: `package.json`, `package-lock.json` (CLI가 `radix-ui`/`lucide-react` 등 의존성 추가)

**Interfaces:**
- Produces: `<Button variant? size? asChild? ...props>`, `<Input ...props>`,
  `<Label htmlFor ...props>`, `<Checkbox checked onCheckedChange ...props>` — Task 10의
  `WaitlistForm`이 이 네 컴포넌트를 쓴다.

- [ ] **Step 1: shadcn CLI로 컴포넌트 추가**

```bash
npx shadcn@4.18.0 add button input label checkbox --yes
```

- [ ] **Step 2: diff 확인 — Geist·팔레트 주입 여부 점검**

```bash
git diff -- app/layout.tsx app/globals.css package.json package-lock.json components/ui
```

`app/globals.css`나 `app/layout.tsx`에 Geist import, 새 `:root` 팔레트, 또는
Task 2에서 이미 정의한 색상 변수의 재정의가 보이면 해당 hunk만 되돌린다(컴포넌트
파일 자체는 유지). petty의 §8.1이 같은 절차를 문서화하고 있다 — 이 CLI 버전에서는
보통 발생하지 않지만, add-only 워크플로의 안전장치로 항상 diff를 본다.

- [ ] **Step 3: 빌드로 검증**

```bash
npm run build
```

- [ ] **Step 4: 커밋**

```bash
git add components/ui/button.tsx components/ui/input.tsx components/ui/label.tsx \
  components/ui/checkbox.tsx package.json package-lock.json
git commit -m "feat: shadcn button/input/label/checkbox 추가"
```

---

### Task 4: 대기자 요청 검증 로직 (schema, rate-limit, error-code)

**Files:**
- Create: `lib/waitlist/schema.ts`
- Test: `lib/waitlist/schema.test.ts`
- Create: `lib/waitlist/rate-limit.ts`
- Test: `lib/waitlist/rate-limit.test.ts`
- Create: `lib/waitlist/error-code.ts`
- Test: `lib/waitlist/error-code.test.ts`

**Interfaces:**
- Produces:
  - `waitlistRequestSchema: ZodObject` / `type WaitlistRequest` — Task 6이 쓴다.
  - `checkRateLimit(key: string, now?: number): boolean` — Task 6·7이 쓴다.
  - `type WaitlistErrorCode = "invalid-request" | "duplicate-email" | "rate-limited" |
    "network" | "unknown"`, `toWaitlistErrorCode(value: string | undefined):
    WaitlistErrorCode` — Task 8(콘텐츠 타입)과 Task 10(`WaitlistForm`)이 쓴다.

세 파일 모두 순수 함수라 외부 의존성(DB·네트워크) 없이 완전히 단위 테스트한다.

- [ ] **Step 1: `schema.test.ts` 작성 (실패하는 테스트 먼저)**

```ts
import { describe, expect, it } from "vitest";

import { waitlistRequestSchema } from "./schema";

describe("waitlistRequestSchema", () => {
  it("accepts a valid submission and normalizes the email", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "  New.User@Example.com  ",
      consent: true,
      honeypot: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("new.user@example.com");
    }
  });

  it("defaults honeypot to an empty string when omitted", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "user@example.com",
      consent: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.honeypot).toBe("");
    }
  });

  it("rejects a malformed email", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "not-an-email",
      consent: true,
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a submission without explicit consent", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "user@example.com",
      consent: false,
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a submission missing consent entirely", () => {
    const result = waitlistRequestSchema.safeParse({
      email: "user@example.com",
      honeypot: "",
    });

    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- lib/waitlist/schema.test.ts`
Expected: FAIL — `./schema`를 찾을 수 없음

- [ ] **Step 3: `schema.ts` 구현**

이메일 형식은 zod의 `.email()`(버전마다 API가 바뀌어 온 부분) 대신 단순하고
안정적인 정규식으로 확인한다 — 완벽한 RFC 5322 검증이 아니라 명백히 잘못된 입력만
거른다(실제 도달 가능성 검증은 출시 알림 발송 시점에 한다).

```ts
import { z } from "zod";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const waitlistRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => EMAIL_PATTERN.test(value), {
      message: "invalid-email",
    }),
  consent: z.literal(true),
  honeypot: z.string().optional().default(""),
});

export type WaitlistRequest = z.infer<typeof waitlistRequestSchema>;
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- lib/waitlist/schema.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: `rate-limit.test.ts` 작성**

```ts
import { describe, expect, it } from "vitest";

import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit within the window", () => {
    const key = `test-key-${Math.random()}`;
    const now = 1_000_000;

    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit(key, now + i)).toBe(true);
    }
  });

  it("blocks the 6th request within the same window", () => {
    const key = `test-key-${Math.random()}`;
    const now = 2_000_000;

    for (let i = 0; i < 5; i += 1) {
      checkRateLimit(key, now + i);
    }

    expect(checkRateLimit(key, now + 5)).toBe(false);
  });

  it("allows requests again once the window has passed", () => {
    const key = `test-key-${Math.random()}`;
    const now = 3_000_000;

    for (let i = 0; i < 5; i += 1) {
      checkRateLimit(key, now + i);
    }
    expect(checkRateLimit(key, now + 5)).toBe(false);

    expect(checkRateLimit(key, now + 61_000)).toBe(true);
  });
});
```

- [ ] **Step 6: 실패 확인**

Run: `npm test -- lib/waitlist/rate-limit.test.ts`
Expected: FAIL — `./rate-limit`를 찾을 수 없음

- [ ] **Step 7: `rate-limit.ts` 구현**

인메모리 구현이라 서버리스 인스턴스가 여러 개로 스케일되면 완벽하지 않다 — 이
정도의 느슨한 방어가 스펙이 요구한 "간단한 rate limit"의 의도다.

```ts
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string, now: number = Date.now()): boolean {
  const timestamps = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return true;
}
```

- [ ] **Step 8: 통과 확인**

Run: `npm test -- lib/waitlist/rate-limit.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 9: `error-code.test.ts` 작성**

```ts
import { describe, expect, it } from "vitest";

import { toWaitlistErrorCode } from "./error-code";

describe("toWaitlistErrorCode", () => {
  it("returns known server error codes as-is", () => {
    expect(toWaitlistErrorCode("duplicate-email")).toBe("duplicate-email");
    expect(toWaitlistErrorCode("invalid-request")).toBe("invalid-request");
    expect(toWaitlistErrorCode("rate-limited")).toBe("rate-limited");
  });

  it("falls back to unknown for unrecognized or missing codes", () => {
    expect(toWaitlistErrorCode("something-else")).toBe("unknown");
    expect(toWaitlistErrorCode(undefined)).toBe("unknown");
  });
});
```

- [ ] **Step 10: 실패 확인**

Run: `npm test -- lib/waitlist/error-code.test.ts`
Expected: FAIL — `./error-code`를 찾을 수 없음

- [ ] **Step 11: `error-code.ts` 구현**

```ts
export type WaitlistErrorCode =
  | "invalid-request"
  | "duplicate-email"
  | "rate-limited"
  | "network"
  | "unknown";

const KNOWN_SERVER_ERROR_CODES: readonly WaitlistErrorCode[] = [
  "invalid-request",
  "duplicate-email",
  "rate-limited",
];

export function toWaitlistErrorCode(
  value: string | undefined,
): WaitlistErrorCode {
  if (KNOWN_SERVER_ERROR_CODES.includes(value as WaitlistErrorCode)) {
    return value as WaitlistErrorCode;
  }
  return "unknown";
}
```

- [ ] **Step 12: 통과 확인**

Run: `npm test -- lib/waitlist/error-code.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 13: 전체 테스트·타입체크 실행**

```bash
npm test
npm run typecheck
```

- [ ] **Step 14: 커밋**

```bash
git add lib/waitlist/schema.ts lib/waitlist/schema.test.ts \
  lib/waitlist/rate-limit.ts lib/waitlist/rate-limit.test.ts \
  lib/waitlist/error-code.ts lib/waitlist/error-code.test.ts
git commit -m "feat: 대기자 요청 검증(schema/rate-limit/error-code) 추가"
```

---

### Task 5: 대기자 저장소 — 추상화 + Postgres 구현체

**Files:**
- Create: `lib/waitlist/save-waitlist-entry.ts`
- Create: `lib/waitlist/db.ts`
- Test: `lib/waitlist/db.test.ts`
- Create: `lib/waitlist/postgres-store.ts`
- Test: `lib/waitlist/postgres-store.test.ts`
- Create: `lib/waitlist/schema.sql`

**Interfaces:**
- Consumes: 없음(이 태스크가 스토리지 계층의 시작점).
- Produces:
  - `type SaveWaitlistEntry = (email: string) => Promise<void>`
  - `class DuplicateEmailError extends Error`
  - `type WaitlistStore = { insert(email: string): Promise<void> }`
  - `createSaveWaitlistEntry(store: WaitlistStore): SaveWaitlistEntry` — Task 6·7이 쓴다.
  - `type Sql = ReturnType<typeof postgres>`, `getSql(): Sql` — Task 7이 쓴다.
  - `createPostgresWaitlistStore(sql: Sql): WaitlistStore` — Task 7이 쓴다.

`getSql()`은 **`DATABASE_URL`을 요청이 실제로 들어왔을 때(첫 호출 시점)에만
읽는다** — 모듈 최상단에서 즉시 읽으면 `DATABASE_URL`이 없는 상태의
`npm run build`가 깨진다. 이 지연 평가가 Task 7의 "환경변수 없이도 빌드는
통과해야 한다" 요구사항을 만든다.

- [ ] **Step 1: `save-waitlist-entry.ts` 작성** (순수 타입/래퍼라 별도 테스트 없이,
  Task 5 Step 6의 `postgres-store.test.ts`와 Task 6의 핸들러 테스트가 이 파일을
  통해 간접적으로 검증한다)

```ts
export type SaveWaitlistEntry = (email: string) => Promise<void>;

export class DuplicateEmailError extends Error {
  constructor() {
    super("duplicate-email");
    this.name = "DuplicateEmailError";
  }
}

export type WaitlistStore = {
  insert(email: string): Promise<void>;
};

export function createSaveWaitlistEntry(store: WaitlistStore): SaveWaitlistEntry {
  return (email) => store.insert(email);
}
```

- [ ] **Step 2: `db.test.ts` 작성 (실패하는 테스트 먼저)**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getSql", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws a clear error when DATABASE_URL is not set", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const { getSql } = await import("./db");

    expect(() => getSql()).toThrow("DATABASE_URL");
  });
});
```

- [ ] **Step 3: 실패 확인**

Run: `npm test -- lib/waitlist/db.test.ts`
Expected: FAIL — `./db`를 찾을 수 없음

- [ ] **Step 4: `db.ts` 구현**

```ts
import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

let cached: Sql | undefined;

export function getSql(): Sql {
  if (!cached) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }
    cached = postgres(connectionString);
  }
  return cached;
}
```

- [ ] **Step 5: 통과 확인**

Run: `npm test -- lib/waitlist/db.test.ts`
Expected: PASS (1 test)

- [ ] **Step 6: `postgres-store.test.ts` 작성 (실패하는 테스트 먼저)**

실제 DB 연결 없이, `sql` 태그드 템플릿 함수를 흉내 낸 fake로 검증한다.

```ts
import { describe, expect, it } from "vitest";

import type { Sql } from "./db";
import { createPostgresWaitlistStore } from "./postgres-store";
import { DuplicateEmailError } from "./save-waitlist-entry";

function createFakeSql(
  behavior: "success" | "duplicate" | "connection-error",
): Sql {
  const fn = async (
    _strings: TemplateStringsArray,
    ..._values: unknown[]
  ) => {
    if (behavior === "duplicate") {
      const error = new Error(
        'duplicate key value violates unique constraint "waitlist_entries_pkey"',
      );
      (error as { code?: string }).code = "23505";
      throw error;
    }

    if (behavior === "connection-error") {
      throw new Error("connection refused");
    }

    return [];
  };

  return fn as unknown as Sql;
}

describe("createPostgresWaitlistStore", () => {
  it("inserts the email without throwing on success", async () => {
    const store = createPostgresWaitlistStore(createFakeSql("success"));

    await expect(store.insert("new@example.com")).resolves.toBeUndefined();
  });

  it("throws DuplicateEmailError on a unique constraint violation", async () => {
    const store = createPostgresWaitlistStore(createFakeSql("duplicate"));

    await expect(store.insert("dup@example.com")).rejects.toBeInstanceOf(
      DuplicateEmailError,
    );
  });

  it("rethrows unrelated database errors as-is", async () => {
    const store = createPostgresWaitlistStore(
      createFakeSql("connection-error"),
    );

    await expect(store.insert("x@example.com")).rejects.toThrow(
      "connection refused",
    );
  });
});
```

- [ ] **Step 7: 실패 확인**

Run: `npm test -- lib/waitlist/postgres-store.test.ts`
Expected: FAIL — `./postgres-store`를 찾을 수 없음

- [ ] **Step 8: `postgres-store.ts` 구현**

```ts
import type { Sql } from "./db";
import { DuplicateEmailError, type WaitlistStore } from "./save-waitlist-entry";

const POSTGRES_UNIQUE_VIOLATION = "23505";

export function createPostgresWaitlistStore(sql: Sql): WaitlistStore {
  return {
    async insert(email: string) {
      try {
        await sql`INSERT INTO waitlist_entries (email) VALUES (${email})`;
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new DuplicateEmailError();
        }
        throw error;
      }
    },
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === POSTGRES_UNIQUE_VIOLATION
  );
}
```

- [ ] **Step 9: 통과 확인**

Run: `npm test -- lib/waitlist/postgres-store.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 10: `schema.sql` 작성**

실제 Postgres(어떤 공급자든)에 한 번 수동으로 실행해 테이블을 만든다. Vercel
Storage 탭이나 `psql`, Neon/Supabase 콘솔의 쿼리 에디터 등 어떤 방법으로 실행해도
된다.

```sql
CREATE TABLE IF NOT EXISTS waitlist_entries (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

- [ ] **Step 11: 전체 테스트·타입체크·빌드 실행**

```bash
npm test
npm run typecheck
npm run build
```

`db.ts`가 지연 평가라 `DATABASE_URL` 없이도 빌드가 통과해야 한다.

- [ ] **Step 12: 커밋**

```bash
git add lib/waitlist/save-waitlist-entry.ts lib/waitlist/db.ts lib/waitlist/db.test.ts \
  lib/waitlist/postgres-store.ts lib/waitlist/postgres-store.test.ts lib/waitlist/schema.sql
git commit -m "feat: 대기자 저장소 추상화와 Postgres 구현체 추가"
```

---

### Task 6: 대기자 요청 핸들러 (순수 함수, deps 주입)

**Files:**
- Create: `lib/waitlist/handle-waitlist-request.ts`
- Test: `lib/waitlist/handle-waitlist-request.test.ts`

**Interfaces:**
- Consumes: `waitlistRequestSchema`(Task 4), `SaveWaitlistEntry`·`DuplicateEmailError`
  (Task 5).
- Produces: `type WaitlistHandlerDeps = { saveWaitlistEntry: SaveWaitlistEntry;
  checkRateLimit: (key: string) => boolean }`,
  `createWaitlistHandler(deps: WaitlistHandlerDeps): (request: Request) =>
  Promise<Response>` — Task 7의 Route Handler가 이 팩토리로 실제 의존성을 주입한다.

Next.js 16 Route Handler는 표준 `Request`/`Response`를 그대로 쓴다(`NextRequest`/
`NextResponse` import 불필요) — 이 파일은 Next.js에 의존하지 않아 `next` 런타임
없이도 순수 Node 환경에서 테스트된다.

- [ ] **Step 1: `handle-waitlist-request.test.ts` 작성 (실패하는 테스트 먼저)**

```ts
import { describe, expect, it, vi } from "vitest";

import { createWaitlistHandler } from "./handle-waitlist-request";
import { DuplicateEmailError } from "./save-waitlist-entry";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("createWaitlistHandler", () => {
  it("saves a valid email and returns ok", async () => {
    const saveWaitlistEntry = vi.fn().mockResolvedValue(undefined);
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "new@example.com", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(saveWaitlistEntry).toHaveBeenCalledWith("new@example.com");
  });

  it("rejects an invalid email without calling saveWaitlistEntry", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "not-an-email", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid-request" });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("rejects a request missing consent", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "new@example.com", consent: false, honeypot: "" }),
    );

    expect(response.status).toBe(400);
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("returns 409 when saveWaitlistEntry reports a duplicate email", async () => {
    const saveWaitlistEntry = vi
      .fn()
      .mockRejectedValue(new DuplicateEmailError());
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({ email: "dup@example.com", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "duplicate-email" });
  });

  it("silently succeeds without saving when the honeypot field is filled", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    const response = await handler(
      makeRequest({
        email: "bot@example.com",
        consent: true,
        honeypot: "i-am-a-bot",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    const saveWaitlistEntry = vi.fn();
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => false,
    });

    const response = await handler(
      makeRequest({ email: "new@example.com", consent: true, honeypot: "" }),
    );

    expect(response.status).toBe(429);
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it("rethrows unexpected storage errors instead of swallowing them", async () => {
    const saveWaitlistEntry = vi.fn().mockRejectedValue(new Error("db down"));
    const handler = createWaitlistHandler({
      saveWaitlistEntry,
      checkRateLimit: () => true,
    });

    await expect(
      handler(
        makeRequest({ email: "new@example.com", consent: true, honeypot: "" }),
      ),
    ).rejects.toThrow("db down");
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- lib/waitlist/handle-waitlist-request.test.ts`
Expected: FAIL — `./handle-waitlist-request`를 찾을 수 없음

- [ ] **Step 3: `handle-waitlist-request.ts` 구현**

```ts
import { waitlistRequestSchema } from "./schema";
import { DuplicateEmailError, type SaveWaitlistEntry } from "./save-waitlist-entry";

export type WaitlistHandlerDeps = {
  saveWaitlistEntry: SaveWaitlistEntry;
  checkRateLimit: (key: string) => boolean;
};

export function createWaitlistHandler({
  saveWaitlistEntry,
  checkRateLimit,
}: WaitlistHandlerDeps) {
  return async function handleWaitlistRequest(
    request: Request,
  ): Promise<Response> {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    if (!checkRateLimit(ip)) {
      return Response.json({ error: "rate-limited" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = waitlistRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "invalid-request" }, { status: 400 });
    }

    if (parsed.data.honeypot.length > 0) {
      return Response.json({ ok: true });
    }

    try {
      await saveWaitlistEntry(parsed.data.email);
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        return Response.json({ error: "duplicate-email" }, { status: 409 });
      }
      throw error;
    }

    return Response.json({ ok: true });
  };
}
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- lib/waitlist/handle-waitlist-request.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: 커밋**

```bash
git add lib/waitlist/handle-waitlist-request.ts lib/waitlist/handle-waitlist-request.test.ts
git commit -m "feat: 대기자 요청 핸들러 추가"
```

---

### Task 7: API 라우트 wiring + 환경변수 설정

**Files:**
- Create: `app/api/waitlist/route.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: `createWaitlistHandler`(Task 6), `createSaveWaitlistEntry`(Task 5),
  `createPostgresWaitlistStore`(Task 5), `getSql`(Task 5), `checkRateLimit`(Task 4).
- Produces: `POST` export — Task 10의 `WaitlistForm`이 `fetch("/api/waitlist", {
  method: "POST" })`로 호출한다.

이 파일은 의존성을 실제로 연결만 하는 얇은 wiring이라 별도 단위 테스트를 두지
않는다 — 로직은 이미 Task 6에서 fake로 전부 검증했다. 여기서는 빌드 통과와
수동 dev 서버 확인으로 wiring 자체가 올바른지 본다.

- [ ] **Step 1: `app/api/waitlist/route.ts` 작성**

```ts
import { getSql } from "@/lib/waitlist/db";
import { createWaitlistHandler } from "@/lib/waitlist/handle-waitlist-request";
import { createPostgresWaitlistStore } from "@/lib/waitlist/postgres-store";
import { checkRateLimit } from "@/lib/waitlist/rate-limit";
import { createSaveWaitlistEntry } from "@/lib/waitlist/save-waitlist-entry";

export async function POST(request: Request): Promise<Response> {
  const store = createPostgresWaitlistStore(getSql());
  const handler = createWaitlistHandler({
    saveWaitlistEntry: createSaveWaitlistEntry(store),
    checkRateLimit,
  });

  return handler(request);
}
```

- [ ] **Step 2: `.env.example` 작성**

```
DATABASE_URL=postgres://user:password@host:5432/database
```

- [ ] **Step 3: `DATABASE_URL` 없이 빌드 통과 확인**

`getSql()`이 지연 평가라 이 시점엔 환경변수가 없어도 빌드가 통과해야 한다 —
Task 5에서 만든 계약을 여기서 다시 확인한다.

```bash
unset DATABASE_URL
npm run build
```

Expected: `Compiled successfully`

- [ ] **Step 4: 실제 Postgres로 수동 검증 (DATABASE_URL 준비된 경우)**

이 단계는 실제 Postgres 데이터베이스가 필요하다 — Vercel 대시보드의 Storage 탭이나
Neon/Supabase 같은 공급자에서 하나 준비하고, `psql`이나 그 콘솔의 쿼리 에디터로
Task 5의 `lib/waitlist/schema.sql`을 한 번 실행한 뒤 진행한다.

```bash
cp .env.example .env.local
# .env.local의 DATABASE_URL을 실제 connection string으로 교체

npm run dev &
DEV_PID=$!
sleep 3

curl -s -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"qa@example.com","consent":true,"honeypot":""}'
echo ""
# 기대: {"ok":true}

curl -s -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"qa@example.com","consent":true,"honeypot":""}'
echo ""
# 기대: {"error":"duplicate-email"} (HTTP 409)

kill $DEV_PID
```

DATABASE_URL을 아직 준비하지 못했다면 이 단계는 건너뛰고 Task 12의 최종 검증에서
다시 수행한다 — Step 3의 빌드 통과 확인만으로 이 태스크의 나머지 코드는 완결된다.

- [ ] **Step 5: 커밋**

```bash
git add app/api/waitlist/route.ts .env.example
git commit -m "feat: 대기자 API 라우트 wiring 추가"
```

---

### Task 8: 랜딩 콘텐츠 모듈

**Files:**
- Create: `content/landing-content.ts`

**Interfaces:**
- Consumes: `type WaitlistErrorCode`(Task 4).
- Produces: `HERO_BACKGROUND`, `HERO_HEADLINE_PREFIX`, `HERO_HEADLINE_SUFFIX`,
  `HERO_DESCRIPTION: readonly string[]`, `type FeatureHighlight`,
  `FEATURE_HIGHLIGHTS: readonly FeatureHighlight[]`, `WAITLIST_EMAIL_LABEL`,
  `WAITLIST_EMAIL_PLACEHOLDER`, `WAITLIST_CONSENT_LABEL`, `WAITLIST_SUBMIT_LABEL`,
  `WAITLIST_SUBMIT_PENDING_LABEL`, `WAITLIST_SUCCESS_MESSAGE`,
  `WAITLIST_ERROR_MESSAGES: Record<WaitlistErrorCode, string>`,
  `FOOTER_CONTACT_EMAIL`, `FOOTER_COPYRIGHT` — Task 9·10이 전부 여기서 가져온다.

**이 파일이 CTA·카피의 유일한 소유자다.** 출시 후 CTA를 "app.petty.im으로 이동"이나
스토어 배지로 바꿀 때 이 파일만 고치면 된다(Global Constraints). 순수 데이터라
`WAITLIST_ERROR_MESSAGES: Record<WaitlistErrorCode, string>` 타입 자체가 모든
`WaitlistErrorCode` 값에 메시지가 있음을 컴파일 타임에 보장하므로 별도 런타임
테스트는 두지 않는다.

`FOOTER_CONTACT_EMAIL`은 임시로 `hello@petty.im`을 쓴다 — 실제 문의 메일함이 정해지면
이 값만 바꾸면 된다.

- [ ] **Step 1: `content/landing-content.ts` 작성**

```ts
import type { WaitlistErrorCode } from "@/lib/waitlist/error-code";

export const HERO_BACKGROUND = "/assets/welcome-background.png";

export const HERO_HEADLINE_PREFIX = "당신만의 이야기,";
export const HERO_HEADLINE_SUFFIX = "와 함께";

export const HERO_DESCRIPTION = [
  "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다.",
  "가장 먼저 만나보세요.",
] as const;

export type FeatureHighlight = {
  id: string;
  title: string;
  description: string;
};

export const FEATURE_HIGHLIGHTS: readonly FeatureHighlight[] = [
  {
    id: "chat",
    title: "캐릭터와의 대화",
    description: "나만을 기다리는 캐릭터와 몰입감 있는 대화를 나눠보세요.",
  },
  {
    id: "create",
    title: "나만의 캐릭터 만들기",
    description: "성격과 말투까지, 당신만의 캐릭터를 직접 만들 수 있어요.",
  },
  {
    id: "worldbook",
    title: "세계관과 스토리",
    description: "월드북으로 캐릭터의 세계관을 채우고 이야기를 확장해보세요.",
  },
];

export const WAITLIST_EMAIL_LABEL = "이메일";
export const WAITLIST_EMAIL_PLACEHOLDER = "name@example.com";
export const WAITLIST_CONSENT_LABEL =
  "이메일은 출시 알림 발송 목적으로만 사용되며, 알림 발송 후 즉시 파기됩니다.";
export const WAITLIST_SUBMIT_LABEL = "가장 먼저 알림받기";
export const WAITLIST_SUBMIT_PENDING_LABEL = "등록하는 중…";
export const WAITLIST_SUCCESS_MESSAGE =
  "등록되었어요. 출시 소식을 가장 먼저 알려드릴게요.";

export const WAITLIST_ERROR_MESSAGES: Record<WaitlistErrorCode, string> = {
  "invalid-request": "올바른 이메일 주소를 입력해 주세요.",
  "duplicate-email": "이미 등록된 이메일이에요.",
  "rate-limited": "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  network: "네트워크 연결을 확인하고 다시 시도해 주세요.",
  unknown: "등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export const FOOTER_CONTACT_EMAIL = "hello@petty.im";
export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Petty. All rights reserved.`;
```

- [ ] **Step 2: 타입체크로 검증**

```bash
npm run typecheck
```

Expected: 에러 없음 — `WAITLIST_ERROR_MESSAGES`가 `WaitlistErrorCode`의 다섯 값을
모두 포함하지 않으면 여기서 컴파일 에러가 난다.

- [ ] **Step 3: 커밋**

```bash
git add content/landing-content.ts
git commit -m "feat: 랜딩페이지 콘텐츠 모듈 추가"
```

---

### Task 9: 정적 섹션 (Hero, FeatureHighlights, SiteFooter)

**Files:**
- Create: `components/landing/Hero.tsx`
- Create: `components/landing/FeatureHighlights.tsx`
- Create: `components/landing/SiteFooter.tsx`
- Modify: `app/page.tsx` (임시 조립 — Task 11이 `WaitlistForm`을 추가해 완성한다)

**Interfaces:**
- Consumes: `Wordmark`(Task 2), `content/landing-content.ts`의 export(Task 8).
- Produces: `Hero({ children: ReactNode })`, `FeatureHighlights()`, `SiteFooter()` —
  전부 props 없이(Hero만 `children`) 쓸 수 있는 Server Component. Task 11이
  `<Hero><WaitlistForm /></Hero>`로 조립한다.

세 컴포넌트 모두 로직이 없는 순수 프레젠테이션이라 petty의 검증 원칙("화면 확인은
개발 서버에서 직접 한다")을 그대로 따른다 — 자동 테스트 대신 dev 서버에서 눈으로
확인한다.

`Global Constraints`에 따라 petty의 `max-w-mobile`(480px) 모바일 셸을 쓰지 않고
반응형 데스크톱 폭(`max-w-3xl`, `max-w-5xl`)을 쓴다.

- [ ] **Step 1: `components/landing/Hero.tsx` 작성**

Next.js 16에서 `Image`의 `priority`는 `preload`로 대체됐다(Global Constraints) —
petty의 `WelcomeScreen`과 동일한 패턴을 쓴다.

```tsx
import Image from "next/image";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/ui/wordmark";
import {
  HERO_BACKGROUND,
  HERO_DESCRIPTION,
  HERO_HEADLINE_PREFIX,
  HERO_HEADLINE_SUFFIX,
} from "@/content/landing-content";

export function Hero({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      <Image
        alt=""
        className="z-0 object-cover object-center"
        fill
        preload
        sizes="100vw"
        src={HERO_BACKGROUND}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-background-deep/50"
      />

      <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-between gap-8 px-page py-24">
        <div className="flex flex-col gap-4">
          <h1 className="flex flex-col gap-1 text-display font-bold text-foreground">
            <span>{HERO_HEADLINE_PREFIX}</span>
            <span className="flex items-center gap-2">
              <Wordmark size="display" />
              <span>{HERO_HEADLINE_SUFFIX}</span>
            </span>
          </h1>

          <p className="flex flex-col text-body text-text-secondary">
            {HERO_DESCRIPTION.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `components/landing/FeatureHighlights.tsx` 작성**

```tsx
import { FEATURE_HIGHLIGHTS } from "@/content/landing-content";

export function FeatureHighlights() {
  return (
    <section className="mx-auto w-full max-w-5xl px-page py-16">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {FEATURE_HIGHLIGHTS.map((feature) => (
          <li
            className="flex flex-col gap-2 rounded-card border border-border bg-card p-6"
            key={feature.id}
          >
            <h2 className="text-title text-foreground">{feature.title}</h2>
            <p className="text-body-sm text-text-secondary">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: `components/landing/SiteFooter.tsx` 작성**

```tsx
import { FOOTER_CONTACT_EMAIL, FOOTER_COPYRIGHT } from "@/content/landing-content";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-page py-8 text-center text-body-sm text-text-muted">
      <p>{FOOTER_COPYRIGHT}</p>
      <p>
        문의:{" "}
        <a className="underline" href={`mailto:${FOOTER_CONTACT_EMAIL}`}>
          {FOOTER_CONTACT_EMAIL}
        </a>
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: `app/page.tsx`를 임시로 조립해 시각 확인**

`WaitlistForm`은 아직 없으므로 `Hero`의 `children` 자리에 임시 텍스트를 넣는다 —
Task 11에서 실제 폼으로 교체한다.

```tsx
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <Hero>
        <p className="text-body-sm text-text-secondary">
          (대기자 폼 자리 — Task 11에서 교체)
        </p>
      </Hero>
      <FeatureHighlights />
      <SiteFooter />
    </main>
  );
}
```

- [ ] **Step 5: dev 서버에서 시각 확인**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -sf http://localhost:3000 > /dev/null && echo "OK: page responded"
kill $DEV_PID
```

가능하면 브라우저로 `http://localhost:3000`을 직접 열어 확인한다 — 별밤 히어로
배경 위에 워드마크가 들어간 헤드라인이 보이고, 그 아래 기능 카드 3개, 푸터가
차례로 보여야 한다.

- [ ] **Step 6: 커밋**

```bash
git add components/landing/Hero.tsx components/landing/FeatureHighlights.tsx \
  components/landing/SiteFooter.tsx app/page.tsx
git commit -m "feat: 히어로·기능 하이라이트·푸터 섹션 추가"
```

---

### Task 10: WaitlistForm (클라이언트 컴포넌트)

**Files:**
- Create: `components/landing/WaitlistForm.tsx`

**Interfaces:**
- Consumes: `Button`·`Checkbox`·`Input`·`Label`(Task 3), `content/landing-content.ts`의
  폼 카피 export(Task 8), `toWaitlistErrorCode`(Task 4). `POST /api/waitlist`(Task 7)를
  `fetch`로 호출한다.
- Produces: `WaitlistForm()` — Task 11이 `<Hero><WaitlistForm /></Hero>`로 조립한다.

성공 시 폼 전체를 성공 메시지로 교체한다(재제출 방지 겸 단순한 상태 모델). 상태
문구는 petty 로그인 화면과 같은 패턴으로 고정 높이(`min-h-11`)
`aria-live="polite"` 영역에 렌더해 CTA 위치가 튀지 않게 한다. 제출 중에는 이메일
입력과 동의 체크박스를 native `disabled`로 잠근다.

- [ ] **Step 1: `components/landing/WaitlistForm.tsx` 작성**

```tsx
"use client";

import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  WAITLIST_CONSENT_LABEL,
  WAITLIST_EMAIL_LABEL,
  WAITLIST_EMAIL_PLACEHOLDER,
  WAITLIST_ERROR_MESSAGES,
  WAITLIST_SUBMIT_LABEL,
  WAITLIST_SUBMIT_PENDING_LABEL,
  WAITLIST_SUCCESS_MESSAGE,
} from "@/content/landing-content";
import { toWaitlistErrorCode, type WaitlistErrorCode } from "@/lib/waitlist/error-code";

type WaitlistStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success" }
  | { kind: "error"; code: WaitlistErrorCode };

const HONEYPOT_FIELD_NAME = "company";

export function WaitlistForm() {
  const [status, setStatus] = useState<WaitlistStatus>({ kind: "idle" });
  const [consent, setConsent] = useState(false);
  const emailId = useId();
  const consentId = useId();

  const isPending = status.kind === "pending";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const honeypot = String(formData.get(HONEYPOT_FIELD_NAME) ?? "");

    setStatus({ kind: "pending" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, honeypot }),
      });

      if (response.ok) {
        setStatus({ kind: "success" });
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      setStatus({ kind: "error", code: toWaitlistErrorCode(body?.error) });
    } catch {
      setStatus({ kind: "error", code: "network" });
    }
  }

  if (status.kind === "success") {
    return (
      <p className="min-h-11 text-body-sm text-success" role="status">
        {WAITLIST_SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={emailId}>{WAITLIST_EMAIL_LABEL}</Label>
        <Input
          autoComplete="email"
          disabled={isPending}
          id={emailId}
          name="email"
          placeholder={WAITLIST_EMAIL_PLACEHOLDER}
          required
          type="email"
        />
      </div>

      <input
        aria-hidden="true"
        className="hidden"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        type="text"
      />

      <div className="flex items-start gap-2">
        <Checkbox
          checked={consent}
          disabled={isPending}
          id={consentId}
          onCheckedChange={(value) => setConsent(value === true)}
          required
        />
        <Label className="text-body-sm text-text-secondary" htmlFor={consentId}>
          {WAITLIST_CONSENT_LABEL}
        </Label>
      </div>

      <p aria-live="polite" className="min-h-11 text-body-sm text-error">
        {status.kind === "error" ? WAITLIST_ERROR_MESSAGES[status.code] : null}
      </p>

      <Button className="w-full" disabled={isPending || !consent} type="submit">
        {isPending ? WAITLIST_SUBMIT_PENDING_LABEL : WAITLIST_SUBMIT_LABEL}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: 타입체크·린트로 검증**

```bash
npm run typecheck
npm run lint
```

- [ ] **Step 3: 커밋**

```bash
git add components/landing/WaitlistForm.tsx
git commit -m "feat: 대기자 등록 폼 컴포넌트 추가"
```

---

### Task 11: 페이지 최종 조립 + 메타데이터 + favicon

**Files:**
- Modify: `app/page.tsx` (Task 9의 임시 children을 `WaitlistForm`으로 교체)
- Modify: `app/layout.tsx` (metadata 추가)
- Create: `app/icon.tsx`

**Interfaces:**
- Consumes: `Hero`·`FeatureHighlights`·`SiteFooter`(Task 9), `WaitlistForm`(Task 10).

favicon은 별도 이미지 자산 없이 Next.js의 `ImageResponse`(`next/og`)로 코드
생성한다 — 잉크 캔버스 배경 위에 브랜드의 conversation cursor(바이올렛 pill)를
그대로 그린다.

- [ ] **Step 1: `app/page.tsx`를 최종 형태로 교체**

```tsx
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { WaitlistForm } from "@/components/landing/WaitlistForm";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <Hero>
        <WaitlistForm />
      </Hero>
      <FeatureHighlights />
      <SiteFooter />
    </main>
  );
}
```

- [ ] **Step 2: `app/layout.tsx`에 메타데이터 추가**

```tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { pretendard } from "@/app/fonts";

export const metadata: Metadata = {
  title: "petty | 당신만의 이야기가 시작되는 곳",
  description:
    "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다. 출시 소식을 가장 먼저 받아보세요.",
  metadataBase: new URL("https://petty.im"),
  openGraph: {
    title: "petty | 당신만의 이야기가 시작되는 곳",
    description: "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다.",
    url: "https://petty.im",
    siteName: "petty",
    images: ["/assets/welcome-background.png"],
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={pretendard.variable} lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: `app/icon.tsx` 작성**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090D17",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 4,
            height: 16,
            borderRadius: 9999,
            background: "#9146E8",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 4: 빌드로 검증**

```bash
npm run build
```

- [ ] **Step 5: dev 서버로 전체 페이지 확인**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -sf http://localhost:3000 > /dev/null && echo "OK"
curl -sf http://localhost:3000/icon > /dev/null && echo "OK: icon route responds"
kill $DEV_PID
```

브라우저로 직접 열어 히어로 안에 실제 대기자 폼이 보이는지, 탭 파비콘이 브랜드
컬러로 나오는지 확인한다.

- [ ] **Step 6: 커밋**

```bash
git add app/page.tsx app/layout.tsx app/icon.tsx
git commit -m "feat: 페이지 최종 조립, 메타데이터, favicon 추가"
```

---

### Task 12: 최종 검증 + README

**Files:**
- Create: `README.md`

**Interfaces:**
- 없음 — 이 태스크는 전체 프로젝트를 검증하고 문서화한다.

- [ ] **Step 1: `README.md` 작성**

```md
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
```

- [ ] **Step 2: 전체 검증 스위트 실행**

```bash
npm run verify
```

Expected: 테스트 전부 PASS, 타입체크·린트·빌드 전부 통과.

- [ ] **Step 3: 수동 QA 체크리스트**

`DATABASE_URL`이 설정된 상태에서(Task 7 Step 4를 아직 안 했다면 여기서 한다):

```bash
npm run dev &
DEV_PID=$!
sleep 3
```

브라우저(또는 `mcp__Claude_Browser__*` 도구)로 `http://localhost:3000`을 열어
확인한다.

- [ ] 히어로 배경·워드마크·헤드라인이 보인다.
- [ ] 이메일을 비운 채 제출하면 브라우저 네이티브 필수 필드 검증이 막는다.
- [ ] 동의 체크박스를 누르지 않으면 제출 버튼이 비활성 상태다.
- [ ] 유효한 이메일 + 동의 체크 후 제출 → "등록되었어요…" 성공 메시지로 폼이
      교체된다.
- [ ] 같은 이메일로 다시 시도(새로고침 후 폼이 남아있는 경우) → "이미 등록된
      이메일이에요." 에러가 고정 높이 영역에 나타나고 CTA 위치가 튀지 않는다.
- [ ] 키보드만으로 Tab 이동 시 이메일 → 동의 체크박스 → 제출 버튼 순서로
      포커스가 이동하고, 포커스 링이 보인다.
- [ ] 기능 하이라이트 카드 3개와 푸터가 보인다.
- [ ] 브라우저 탭 favicon이 어두운 배경 + 바이올렛 막대로 보인다.

```bash
kill $DEV_PID
```

색상 대비는 petty에서 이미 검증된 토큰 값을 그대로 재사용했으므로(Task 2) 별도
재검증은 생략한다.

- [ ] **Step 4: 커밋**

```bash
git add README.md
git commit -m "docs: petty-im README 추가"
```

---

## 다음 단계 (이 계획 밖)

- Vercel 프로젝트를 만들고 이 저장소를 연결한다.
- Vercel 프로젝트 설정에 `DATABASE_URL`을 등록한다.
- `petty.im` 도메인을 Vercel 프로젝트에 연결한다(DNS).
- 대기자 명단이 쌓인 뒤 실제 출시 알림 **발송** 기능을 별도로 설계한다(스펙의
  "이 설계에서 제외한 것" 참고).
