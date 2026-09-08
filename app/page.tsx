import { CharacterShowcase } from "@/components/landing/CharacterShowcase";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function LandingPage() {
  return (
    <div className="landing-page flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <FeatureHighlights />
        <CharacterShowcase />
        <DownloadSection />
      </main>
      <SiteFooter />
    </div>
  );
}
