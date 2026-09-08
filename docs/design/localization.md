# Landing localization

## Supported markets

- Korea: Korean (`ko`)
- Japan: Japanese (`ja`)
- United States: English (`en`)

## Selection order

1. Valid `?lang=ko|ja|en` URL parameter; also saves a first-party `petty-locale` preference cookie for one year.
2. Saved language preference.
3. Supported country hint (`JP` → `ja`, `US` → `en`, `KR` → `ko`).
4. `Accept-Language`, respecting regional variants, quality weights and exclusions.
5. Korean fallback.

`proxy.ts` selects the locale before rendering and replaces the internal request header. Root layout renders the correct `html[lang]`, localized metadata and content on the server. A language switch preserves the current section and other query parameters. No external geolocation API or location permission is used.

## Country integration

Reads `COUNTRY_HEADER` if configured, followed by `x-vercel-ip-country`, `cloudfront-viewer-country`, and `cf-ipcountry`. The CDN must actually forward country information. CloudFront requires a suitable origin request policy to include `CloudFront-Viewer-Country`. If hosting does not supply a country header, browser language is the fallback; local development cannot infer a real country from localhost.

Country is only a presentation hint, never an authorization or compliance signal. The page uses request-time rendering; do not add shared CDN caching that ignores visitor language/cookies. Proxy matching is restricted to `/`, leaving APIs, images and framework assets unaffected.

## Translation coverage

`content/landing-content.ts` preserves Korean source content. `content/landing-locales.ts` defines complete typed dictionaries for all three locales. `LocaleProvider` supplies translations to sections, forms and portaled dialogs.

Includes hero copy, navigation, feature cards, sample conversations, character names/genres/descriptions, download section, footer, accessible labels, launch signup and API error messages. App Store / Google Play brand names remain unchanged. The QR code goes to the canonical mobile site, which negotiates language independently on that device.

Phone montage images contain locale-specific UI text. Generated via the built-in ImageGen editing tool using `public/assets/app-phones.png` as the reference:

- `public/assets/app-phones-en.png` / `.webp`: preserve four phones and artwork; translate all Korean screen text to American English. Main banner “Your story starts here”, button “Meet characters”, section “Popular characters”, dialogue “Are you okay?” / “Glad you are here.”
- `public/assets/app-phones-ja.png` / `.webp`: preserve four phones and artwork; translate all Korean screen text to Japanese. Main banner “あなただけの物語を”, button “キャラクターを見る”, section “人気キャラクター”, dialogue “大丈夫ですか？” / “いてくれてよかった。”

These remain promotional illustrations, not proof of shipped native-app localization. API data storage and launch email delivery were not changed by the landing localization.

## Validation

39 tests pass, including locale precedence, browser quality-weight parsing, cookie persistence, internal-header replacement, translation coverage and character/feature identity. TypeScript, lint (two existing warnings) and production build pass.

HTTP requests verified country-driven Japanese and English, Japanese browser fallback, and a saved Korean preference overriding a US country hint. Browser verified English/Japanese server titles, language selection, persistence on a plain `/` visit, localized launch form, and mobile layouts. No real signup submitted.
