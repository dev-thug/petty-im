import { bubblechat } from "./bubblechat";
import { characterAi } from "./character-ai";
import { crack } from "./crack";
import { zeta } from "./zeta";
import type { Comparison } from "./types";

export type { Comparison } from "./types";

/** Ordered by how much search demand each competitor's brand carries in Korea. */
export const COMPARISONS: readonly Comparison[] = [
  zeta,
  crack,
  characterAi,
  bubblechat,
];

export const COMPARISON_UPDATED_AT = "2026-09-08";

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((comparison) => comparison.slug === slug);
}

/** Korean-only hub. Linked from the Korean footer so the comparison pages are
 * reachable from the homepage instead of sitting orphaned in the sitemap. */
export const COMPARISON_HUB = {
  href: "/alternatives",
  label: "AI 캐릭터 채팅 앱 비교",
} as const;
