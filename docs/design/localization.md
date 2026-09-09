# Landing localization

## Supported markets

- Korea: Korean (`ko`)
- Japan: Japanese (`ja`)
- United States: English (`en`)

## URL structure

Each language has its own address. This is what lets search engines index all
three: a single URL that changes language by cookie or IP shows a crawler only
one version, and Googlebot crawls from US IPs with no cookie and no
`Accept-Language`.

| Locale | Landing URL |
| --- | --- |
| Korean | `/` |
| Japanese | `/ja` |
| English | `/en` |

Korean sits at the root so the most linked-to URL never redirects. `/terms`,
`/privacy` and `/alternatives/*` are Korean-only and live at the root as well.

Every landing page carries a self-referencing canonical plus the full hreflang
set (`ko-KR`, `ja-JP`, `en-US`, `x-default` to `/`). `lib/seo/site.ts` builds
both from one place; `app/sitemap.ts` repeats the same set as `<xhtml:link>`
entries, including the self-reference that Next does not add on its own.

## Selection order

`proxy.ts` derives the rendered language from the path alone, so the same URL
always returns the same language. Visitor signals only decide where to *send*
someone, never what a given URL contains:

1. A valid `?lang=ko|ja|en` parameter redirects (307) to that language's URL and
   saves the first-party `petty-locale` cookie for one year.
2. At `/` only, and only for a real browser navigation (`Sec-Fetch-Mode:
   navigate`), the saved cookie, then the country hint, then `Accept-Language`
   choose a language; a non-Korean result redirects to `/ja` or `/en`.
3. Everything else renders the language its path names.

Crawlers do not send `Sec-Fetch-Mode`, so `/` stays Korean for them instead of
redirecting to `/en` on a US IP. Deeper paths are never redirected.

## Country integration

Reads `COUNTRY_HEADER` if configured, followed by `x-vercel-ip-country`, `cloudfront-viewer-country`, and `cf-ipcountry`. The CDN must actually forward country information. CloudFront requires a suitable origin request policy to include `CloudFront-Viewer-Country`. If hosting does not supply a country header, browser language is the fallback; local development cannot infer a real country from localhost.

Country is only a presentation hint, never an authorization or compliance signal. Pages render at request time, so Next marks them uncacheable on its own and the proxy sets no `Cache-Control` of its own; a header set there does not survive Next's response pipeline. Only `/` varies by visitor, and the redirect decision runs in the proxy on every request rather than out of a cache. Proxy matching covers pages and excludes APIs, framework assets, images, `robots.txt` and `sitemap.xml`.

## Translation coverage

`content/landing-content.ts` preserves Korean source content. `content/landing-locales.ts` defines complete typed dictionaries for all three locales. `LocaleProvider` supplies translations to sections, forms and portaled dialogs.

Includes hero copy, navigation, feature cards, sample conversations, character names/genres/descriptions, download section, footer, accessible labels, launch signup and API error messages. App Store / Google Play brand names remain unchanged. The QR code goes to the canonical mobile site, which negotiates language independently on that device.

Phone montage images contain locale-specific UI text. Generated via the built-in ImageGen editing tool using `public/assets/app-phones.png` as the reference:

- `public/assets/app-phones-en.png` / `.webp`: preserve four phones and artwork; translate all Korean screen text to American English. Main banner “Your story starts here”, button “Meet characters”, section “Popular characters”, dialogue “Are you okay?” / “Glad you are here.”
- `public/assets/app-phones-ja.png` / `.webp`: preserve four phones and artwork; translate all Korean screen text to Japanese. Main banner “あなただけの物語を”, button “キャラクターを見る”, section “人気キャラクター”, dialogue “大丈夫ですか？” / “いてくれてよかった。”

These remain promotional illustrations, not proof of shipped native-app localization. API data storage and launch email delivery were not changed by the landing localization.

## Validation

46 tests pass, including path-to-locale mapping, the crawler case at `/` (US IP, no `Accept-Language`, spoofed internal header), `?lang=` redirects, browser-only root redirection and translation coverage. TypeScript, lint (two existing warnings) and production build pass.

HTTP requests verified that `/`, `/ja` and `/en` each return their own language to a cookie-free request, that a US-IP request with no `Accept-Language` still gets Korean at `/`, and that `?lang=` and browser navigation redirect as described. The rendered HTML was checked for `html[lang]`, canonical and the hreflang set on every locale.
