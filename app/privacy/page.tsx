import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { privacy } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Petty",
  description: privacy.description,
  alternates: { canonical: "/privacy", languages: { "ko-KR": "/privacy" } },
  openGraph: {
    title: "개인정보처리방침 | Petty",
    description: privacy.description,
    url: "/privacy",
    locale: "ko_KR",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <LegalDocumentPage document={privacy} />;
}
