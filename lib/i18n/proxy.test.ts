import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("locale request plumbing", () => {
  it("overwrites spoofed internal locale and uses the country hint", () => {
    const response = proxy(
      new NextRequest("https://petty.im/", {
        headers: {
          "x-vercel-ip-country": "JP",
          "x-petty-locale": "en",
          "accept-language": "ko",
        },
      }),
    );
    expect(response.headers.get("x-middleware-request-x-petty-locale")).toBe(
      "ja",
    );
    expect(response.headers.get("content-language")).toBe("ja");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it("persists explicit selection but not automatic detection", () => {
    const manual = proxy(new NextRequest("https://petty.im/?lang=en"));
    expect(manual.cookies.get("petty-locale")?.value).toBe("en");
    expect(manual.cookies.get("petty-locale")?.secure).toBe(true);
    const automatic = proxy(
      new NextRequest("https://petty.im/", {
        headers: { "accept-language": "ja" },
      }),
    );
    expect(automatic.cookies.get("petty-locale")).toBeUndefined();
  });
  it("honors a returning visitor's language cookie", () => {
    const response = proxy(
      new NextRequest("https://petty.im/", {
        headers: { cookie: "petty-locale=ko", "cf-ipcountry": "US" },
      }),
    );
    expect(response.headers.get("content-language")).toBe("ko");
  });
});
