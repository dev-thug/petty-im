import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const BROWSER = { "sec-fetch-mode": "navigate" };

describe("locale request plumbing", () => {
  it("serves Korean at the root to crawlers regardless of IP or headers", () => {
    // Googlebot crawls from US IPs, sends no Accept-Language and no Sec-Fetch-Mode.
    // The root must stay Korean for it instead of redirecting to /en.
    const response = proxy(
      new NextRequest("https://petty.im/", {
        headers: { "x-vercel-ip-country": "US", "x-petty-locale": "ja" },
      }),
    );
    expect(response.headers.get("x-middleware-request-x-petty-locale")).toBe(
      "ko",
    );
    expect(response.headers.get("content-language")).toBe("ko");
    expect(response.status).toBe(200);
  });

  it("takes the locale from the path, not from the visitor", () => {
    for (const [url, locale] of [
      ["https://petty.im/ja", "ja"],
      ["https://petty.im/en", "en"],
      ["https://petty.im/alternatives/zeta", "ko"],
      ["https://petty.im/terms", "ko"],
    ] as const) {
      const response = proxy(
        new NextRequest(url, {
          headers: { "x-vercel-ip-country": "US", "accept-language": "ko" },
        }),
      );
      expect(response.headers.get("content-language")).toBe(locale);
    }
  });

  it("moves an explicit ?lang= choice onto that language's own URL", () => {
    const response = proxy(new NextRequest("https://petty.im/?lang=en"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://petty.im/en");
    expect(response.cookies.get("petty-locale")?.value).toBe("en");
    expect(response.cookies.get("petty-locale")?.secure).toBe(true);
  });

  it("switches back to Korean at the site root", () => {
    const response = proxy(new NextRequest("https://petty.im/ja?lang=ko"));
    expect(response.headers.get("location")).toBe("https://petty.im/");
  });

  it("sends a browser to its language once, from the root only", () => {
    const japanese = proxy(
      new NextRequest("https://petty.im/", {
        headers: { ...BROWSER, "x-vercel-ip-country": "JP" },
      }),
    );
    expect(japanese.headers.get("location")).toBe("https://petty.im/ja");

    const returning = proxy(
      new NextRequest("https://petty.im/", {
        headers: { ...BROWSER, cookie: "petty-locale=en" },
      }),
    );
    expect(returning.headers.get("location")).toBe("https://petty.im/en");

    // Deeper pages are already unambiguous and must never be redirected.
    const deep = proxy(
      new NextRequest("https://petty.im/terms", {
        headers: { ...BROWSER, "x-vercel-ip-country": "JP" },
      }),
    );
    expect(deep.status).toBe(200);
  });

  it("does not persist automatic detection", () => {
    const automatic = proxy(
      new NextRequest("https://petty.im/", {
        headers: { ...BROWSER, "accept-language": "ja" },
      }),
    );
    expect(automatic.cookies.get("petty-locale")).toBeUndefined();
  });

  it("lets a saved Korean preference keep the root Korean", () => {
    // The only escape hatch for an English-preference visitor who wants Korean
    // is the language selector, which saves this cookie. It must win.
    const response = proxy(
      new NextRequest("https://petty.im/", {
        headers: {
          ...BROWSER,
          cookie: "petty-locale=ko",
          "accept-language": "en-US,en;q=0.9",
          "x-vercel-ip-country": "US",
        },
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-language")).toBe("ko");
  });
});
