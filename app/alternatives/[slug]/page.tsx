import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonPage } from "@/components/comparison/ComparisonPage";
import { COMPARISONS, getComparison } from "@/content/comparisons";
import { alternatesFor } from "@/lib/seo/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = getComparison((await params).slug);
  if (!comparison) return {};
  const route = `/alternatives/${comparison.slug}`;
  return {
    title: comparison.title,
    description: comparison.description,
    // Published in Korean only, so the hreflang set names Korean alone.
    alternates: alternatesFor("ko", route, ["ko"]),
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      url: route,
      siteName: "Petty",
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function AlternativePage({ params }: Props) {
  const comparison = getComparison((await params).slug);
  if (!comparison) notFound();
  return <ComparisonPage comparison={comparison} />;
}
