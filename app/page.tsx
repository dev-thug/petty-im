import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <Hero>
        <p className="text-body-sm text-text-secondary">
          (대기자 폼 자리 — Task 11에서 교체)
        </p>
      </Hero>
      <FeatureHighlights />
      <SiteFooter />
    </main>
  );
}
