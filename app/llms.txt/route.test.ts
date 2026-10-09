import { BUSINESS } from "@/content/legal/business";
import { COMPARISONS } from "@/content/comparisons";
import { PETTY_APP_URL } from "@/content/app-links";
import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/llms.txt", () => {
  it("serves a plain-text index of canonical public pages", async () => {
    const response = GET();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(body).toContain("# Petty (페티)");
    expect(body).toContain(`(${PETTY_APP_URL})`);
    expect(body).toContain("https://petty.im");
    expect(body).toContain("https://petty.im/en");
    expect(body).toContain("https://petty.im/ja");
    expect(body).toContain("https://petty.im/alternatives");
    expect(body).toContain("https://petty.im/terms");
    expect(body).toContain("https://petty.im/privacy");

    for (const comparison of COMPARISONS) {
      expect(body).toContain(
        `https://petty.im/alternatives/${comparison.slug}`,
      );
    }
    expect(body).toContain(BUSINESS.supportEmail);
  });

  it("does not copy personal or business registration details into the index", async () => {
    const body = await GET().text();
    expect(body).not.toContain(BUSINESS.registrationNumber);
    expect(body).not.toContain(BUSINESS.representative);
    expect(body).not.toContain(BUSINESS.address);
  });
});
