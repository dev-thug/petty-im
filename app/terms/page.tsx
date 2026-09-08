import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { terms } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "이용약관 | Petty",
  description: terms.description,
  alternates: { canonical: "/terms", languages: { "ko-KR": "/terms" } },
  openGraph: {
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
