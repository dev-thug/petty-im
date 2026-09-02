import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { WaitlistForm } from "@/components/landing/WaitlistForm";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <Hero>
        <WaitlistForm />
      </Hero>
      <FeatureHighlights />
      <SiteFooter />
    </main>
  );
}
