import { NextResponse, type NextRequest } from "next/server";
import {
  isLocale,
  LOCALE_COOKIE,
  LOCALE_PREFIX,
  localeFromPathname,
  localePath,
  resolveLocale,
} from "@/lib/i18n/locale";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
  httpOnly: true,
} as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secure = request.nextUrl.protocol === "https:";
  const requested = request.nextUrl.searchParams.get("lang");

  // An explicit ?lang= choice moves the visitor onto that language's real URL.
  // Keeping one address per language is what lets search engines index all three.
  if (isLocale(requested)) {
    const target = request.nextUrl.clone();
    target.pathname = localePath(pathname, requested);
    target.searchParams.delete("lang");
    const redirect = NextResponse.redirect(target, 307);
    redirect.cookies.set(LOCALE_COOKIE, requested, {
      ...COOKIE_OPTIONS,
      secure,
    });
    return redirect;
  }

  // Country is a presentation hint only; never use it for authorization.
  const country =
    (process.env.COUNTRY_HEADER
      ? request.headers.get(process.env.COUNTRY_HEADER)
      : null) ??
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cloudfront-viewer-country") ??
    request.headers.get("cf-ipcountry");

  // Automatic language selection applies to the root only, and only for a real
  // browser navigation. Crawlers do not send Sec-Fetch-Mode, so "/" always serves
  // Korean to them instead of redirecting on a US IP with no Accept-Language.
  if (
    pathname === "/" &&
    request.headers.get("sec-fetch-mode") === "navigate"
  ) {
    const preferred = resolveLocale({
      saved: request.cookies.get(LOCALE_COOKIE)?.value,
      country,
      acceptLanguage: request.headers.get("accept-language"),
    });
    if (preferred !== "ko") {
      const target = request.nextUrl.clone();
      target.pathname = LOCALE_PREFIX[preferred];
      return NextResponse.redirect(target, 307);
    }
  }

  const locale = localeFromPathname(pathname);
  const headers = new Headers(request.headers);
  headers.set("x-petty-locale", locale);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Language", locale);
  // No Cache-Control here: these pages render at request time, so Next already
  // marks them uncacheable, and a header set here does not survive its pipeline.
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|licenses|favicon.ico|robots.txt|sitemap.xml|icon|opengraph-image).*)",
  ],
};
