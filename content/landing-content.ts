import type { WaitlistErrorCode } from "@/lib/waitlist/error-code";

export const HERO_BACKGROUND = "/assets/welcome-background.png";

export const HERO_HEADLINE_PREFIX = "당신만의 이야기,";
export const HERO_HEADLINE_SUFFIX = "와 함께";

export const HERO_DESCRIPTION = [
  "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다.",
  "가장 먼저 만나보세요.",
] as const;

export type FeatureHighlight = {
  id: string;
  title: string;
  description: string;
};

export const FEATURE_HIGHLIGHTS: readonly FeatureHighlight[] = [
  {
    id: "chat",
    title: "캐릭터와의 대화",
    description: "나만을 기다리는 캐릭터와 몰입감 있는 대화를 나눠보세요.",
  },
  {
    id: "create",
    title: "나만의 캐릭터 만들기",
    description: "성격과 말투까지, 당신만의 캐릭터를 직접 만들 수 있어요.",
  },
  {
    id: "worldbook",
    title: "세계관과 스토리",
    description: "월드북으로 캐릭터의 세계관을 채우고 이야기를 확장해보세요.",
  },
];

export const WAITLIST_EMAIL_LABEL = "이메일";
export const WAITLIST_EMAIL_PLACEHOLDER = "name@example.com";
export const WAITLIST_CONSENT_LABEL =
  "이메일은 출시 알림 발송 목적으로만 사용되며, 알림 발송 후 즉시 파기됩니다.";
export const WAITLIST_SUBMIT_LABEL = "가장 먼저 알림받기";
export const WAITLIST_SUBMIT_PENDING_LABEL = "등록하는 중…";
export const WAITLIST_SUCCESS_MESSAGE =
  "등록되었어요. 출시 소식을 가장 먼저 알려드릴게요.";

export const WAITLIST_ERROR_MESSAGES: Record<WaitlistErrorCode, string> = {
  "invalid-request": "올바른 이메일 주소를 입력해 주세요.",
  "duplicate-email": "이미 등록된 이메일이에요.",
  "rate-limited": "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  network: "네트워크 연결을 확인하고 다시 시도해 주세요.",
  unknown: "등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export const FOOTER_CONTACT_EMAIL = "hello@petty.im";
export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Petty. All rights reserved.`;
