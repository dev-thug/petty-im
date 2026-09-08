import { BUSINESS } from "@/content/legal/business";
import type { Locale } from "@/lib/i18n/locale";
const labels = {
  ko: {
    title: "사업자 정보",
    name: "상호",
    representative: "대표자",
    registration: "사업자등록번호",
    address: "사업장 소재지",
    email: "고객지원",
  },
  en: {
    title: "Business information",
    name: "Legal business name",
    representative: "Representative",
    registration: "Business registration no.",
    address: "Business address",
    email: "Support",
  },
  ja: {
    title: "事業者情報",
    name: "事業者名",
    representative: "代表者",
    registration: "事業者登録番号",
    address: "所在地",
    email: "お問い合わせ",
  },
};
export function BusinessInformation({ locale = "ko" }: { locale?: Locale }) {
  const t = labels[locale];
  return (
    <section className="business-information" aria-label={t.title}>
      <h2>{t.title}</h2>
      <dl>
        <div>
          <dt>{t.name}</dt>
          <dd lang="ko">{BUSINESS.name}</dd>
        </div>
        <div>
          <dt>{t.representative}</dt>
          <dd lang="ko">{BUSINESS.representative}</dd>
        </div>
        <div>
          <dt>{t.registration}</dt>
          <dd>{BUSINESS.registrationNumber}</dd>
        </div>
        <div className="business-address">
          <dt>{t.address}</dt>
          <dd lang="ko">{BUSINESS.address}</dd>
        </div>
        <div>
          <dt>{t.email}</dt>
          <dd>
            <a href={`mailto:${BUSINESS.supportEmail}`}>
              {BUSINESS.supportEmail}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
