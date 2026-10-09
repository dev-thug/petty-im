import { COMPARISONS } from "@/content/comparisons";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  PETTY_APP_URL,
} from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";
import { landingSearchContent } from "@/content/landing-search";
import { absoluteUrl, localeRoute } from "@/lib/seo/site";

/**
 * A small, human-readable index of public Petty pages for tools that choose to
 * consume the community llms.txt proposal. It is supplemental discovery data,
 * not a crawler policy or a search ranking signal.
 */
export function buildLlmsTxt(): string {
  const korean = landingSearchContent.ko;
  const platformAnswer = korean.faqs.find((faq) =>
    faq.question.includes("PC"),
  )?.answer;
  const overview = [
    korean.introduction,
    platformAnswer?.replace(/^네\.\s*/, ""),
  ]
    .filter(Boolean)
    .join(" ");

  const links = [
    "# Petty (페티)",
    "",
    `> ${overview}`,
    "",
    "공식 홈페이지는 한국어, 영어, 일본어 페이지를 제공합니다. 비교 가이드는 한국어로 제공됩니다.",
    "",
    "## Product",
    `- [Petty web app](${PETTY_APP_URL}): AI character chat service.`,
    ...(APP_STORE_URL
      ? [`- [Petty on the App Store](${APP_STORE_URL}).`]
      : []),
    ...(GOOGLE_PLAY_URL
      ? [`- [Petty on Google Play](${GOOGLE_PLAY_URL}).`]
      : []),
    `- [한국어 홈페이지](${absoluteUrl(localeRoute("ko", "/"))}): Petty 소개와 기능 안내.`,
    `- [English homepage](${absoluteUrl(localeRoute("en", "/"))}): Product overview in English.`,
    `- [日本語ホームページ](${absoluteUrl(localeRoute("ja", "/"))}): 日本語でのサービス紹介。`,
    "",
    "## Comparison guides (Korean)",
    `- [AI character chat app comparison](${absoluteUrl("/alternatives")}): Overview and links to individual comparisons.`,
    ...COMPARISONS.map(
      (comparison) =>
        `- [${comparison.competitorName} comparison](${absoluteUrl(
          `/alternatives/${comparison.slug}`,
        )}): ${comparison.description}`,
    ),
    "",
    "## Policies (Korean)",
    `- [Terms of service](${absoluteUrl("/terms")}): Terms for the official Petty website.`,
    `- [Privacy policy](${absoluteUrl("/privacy")}): Privacy information for the official Petty website.`,
    "",
    "## Contact",
    `- Customer support: ${BUSINESS.supportEmail}`,
    "",
  ];

  return `${links.join("\n")}\n`;
}
