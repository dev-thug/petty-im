import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { terms } from "@/content/legal/terms";
import { SITE_NAME, alternatesFor } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "이용약관 | Petty",
  description: terms.description,
  alternates: alternatesFor("ko", "/terms", ["ko"]),
  openGraph: {
    siteName: SITE_NAME,
    title: "이용약관 | Petty",
    description: terms.description,
    url: "/terms",
    locale: "ko_KR",
    type: "website",
  },
};

export default function TermsPage() {
  return <LegalDocumentPage document={terms} />;
}
