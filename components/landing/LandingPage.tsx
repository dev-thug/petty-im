import { CharacterShowcase } from "@/components/landing/CharacterShowcase";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRequestLocale } from "@/lib/i18n/server";
import { landingGraph } from "@/lib/seo/structured-data";

/** Shared by /, /ja and /en. The locale comes from the path via the proxy, so
 * one component serves every language without any request sniffing of its own. */
export async function LandingPage() {
  const locale = await getRequestLocale();
  return (
    <div className="landing-page flex min-h-dvh flex-col">
      <JsonLd data={landingGraph(locale)} />
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
