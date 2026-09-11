export const BUSINESS = {
  name: "스페시파이(specify)",
  representative: "김현중",
  registrationNumber: "656-14-02899",
  address: "서울특별시 동대문구 왕산로 288, 902호(전농동, 에스앤제이프리미안)",
  supportEmail: "support@specify.app",
} as const;

export const LEGAL_UPDATED_AT = "2026-09-08";

export type LegalDocument = {
  title: string;
  description: string;
  /** Set when this document changed after LEGAL_UPDATED_AT, so the other one
   * does not show a revision date it never had. */
  updatedAt?: string;
  sections: { id: string; title: string; paragraphs: string[] }[];
};
