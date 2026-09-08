import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, resolveLocale } from "@/lib/i18n/locale";

export function proxy(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("lang");
  // Country is a presentation hint only; never use it for authorization.
  const country =
    (process.env.COUNTRY_HEADER
      ? request.headers.get(process.env.COUNTRY_HEADER)
      : null) ??
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cloudfront-viewer-country") ??
    request.headers.get("cf-ipcountry");
  const locale = resolveLocale({
    requested,
    saved: request.cookies.get(LOCALE_COOKIE)?.value,
    country,
    acceptLanguage: request.headers.get("accept-language"),
  });
  const headers = new Headers(request.headers);
  headers.set("x-petty-locale", locale);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Language", locale);
  response.headers.set("Cache-Control", "private, no-store");
  if (isLocale(requested))
    response.cookies.set(LOCALE_COOKIE, requested, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
    });
  return response;
}
export const config = { matcher: ["/"] };
