import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { privacy } from "@/content/legal/privacy";
import { alternatesFor } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Petty",
  description: privacy.description,
  alternates: alternatesFor("ko", "/privacy", ["ko"]),
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
