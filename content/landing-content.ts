import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/content/app-links";
import { BUSINESS } from "@/content/legal/business";

export const HERO_BACKGROUND = "/assets/hero-background.webp";

export type NavLink = {
  id: string;
  label: string;
  href: string;
};

export const NAV_LINKS: readonly NavLink[] = [
  { id: "hero", label: "서비스 소개", href: "#hero" },
  { id: "features", label: "주요 기능", href: "#features" },
  { id: "characters", label: "캐릭터", href: "#characters" },
  { id: "download", label: "다운로드", href: "#download" },
];

export const NAV_CTA_LABEL = "지금 시작하기";

export const HERO_TITLE_LINES = [
  "상상 속 캐릭터와",
  "내가 주인공이 되는",
] as const;

export const HERO_TITLE_HIGHLIGHT = "이야기, Petty";

export const HERO_DESCRIPTION = [
  "취향에 맞는 AI 캐릭터를 만나고,",
  "대화로 나만의 이야기를 만들어보세요.",
] as const;

export const HERO_PRIMARY_CTA_LABEL = "페티 시작하기";
export const HERO_SECONDARY_CTA_LABEL = "캐릭터 둘러보기";

export type FeatureHighlight = {
  id: string;
  title: string;
  description: string;
};

export const FEATURES_TITLE = "Petty는 이런 공간이에요";
export const FEATURES_SUBTITLE =
  "AI 캐릭터와 대화하고, 관계를 쌓아가는 새로운 경험";

export const FEATURE_HIGHLIGHTS: readonly FeatureHighlight[] = [
  {
    id: "characters",
    title: "나만의 AI 캐릭터",
    description: "다양한 캐릭터와 대화하고 특별한 관계를 만들어가요.",
  },
  {
    id: "memory",
    title: "기억하고 이어지는 대화",
    description: "AI가 대화를 기억하고 더 깊고 자연스럽게 이어가요.",
  },
  {
    id: "records",
    title: "나만의 공간과 기록",
    description: "소중한 대화와 순간을 기록하고 들여다볼 수 있어요.",
  },
  {
    id: "story",
    title: "당신의 이야기, Petty",
    description: "AI 캐릭터와 함께 만드는 당신만의 이야기.",
  },
];

export const FEATURE_CHAT_PREVIEW = {
  incoming: ["선배, 오늘도 늦었네요?", "괜찮으세요?"],
  outgoing: ["응, 괜찮아.", "내가 있어서 다행이야."],
} as const;

export type FeatureRecordPreview = {
  id: string;
  name: string;
  role: string;
  message: string;
  time: string;
};

export const FEATURE_RECORD_PREVIEWS: readonly FeatureRecordPreview[] = [
  {
    id: "seoha",
    name: "서하",
    role: "차가운 후배",
    message: "...흠, 별 말씀을요.",
    time: "2시간 전",
  },
  {
    id: "ian",
    name: "이안",
    role: "천재 연구원",
    message: "새로운 실험 결과가 나왔습니다.",
    time: "2시간 전",
  },
  {
    id: "kyle",
    name: "카일",
    role: "도시의 히어로",
    message: "정의를 포기하지 않아.",
    time: "1일 전",
  },
];

export type Character = {
  id: string;
  name: string;
  role: string;
  genre: string;
};

export const CHARACTERS_TITLE = "다양한 캐릭터를 만나보세요";
export const CHARACTERS_SUBTITLE =
  "로맨스, 판타지, 현대, SF 등 다양한 장르의 캐릭터";

export const CHARACTERS: readonly Character[] = [
  { id: "seoha", name: "서하", role: "차가운 후배", genre: "로맨스" },
  { id: "ian", name: "이안", role: "천재 연구원", genre: "현대" },
  { id: "yuri", name: "유리", role: "소꿉친구", genre: "로맨스" },
  { id: "kyle", name: "카일", role: "도시의 히어로", genre: "SF" },
  { id: "elia", name: "엘리아", role: "마법사", genre: "판타지" },
];

export const CHARACTERS_MORE_LABEL = ["더 많은 캐릭터", "만들기"] as const;

export const DOWNLOAD_TITLE = "지금 Petty를 시작하세요";
export const DOWNLOAD_SUBTITLE =
  "Petty는 언제나 당신의 이야기를 기다리고 있어요.";
export const DOWNLOAD_QR_LABEL = "QR코드로 다운로드";

export const STORE_BADGES = {
  appStore: {
    eyebrow: "Download on the",
    label: "App Store",
    href: APP_STORE_URL,
  },
  googlePlay: {
    eyebrow: "GET IT ON",
    label: "Google Play",
    href: GOOGLE_PLAY_URL,
  },
} as const;

export const FOOTER_TAGLINE = [
  "AI 캐릭터와 함께하는",
  "특별한 이야기의 시작",
] as const;

export const FOOTER_CONTACT_EMAIL = BUSINESS.supportEmail;

export const FOOTER_LINKS: readonly NavLink[] = [
  { id: "about", label: "서비스 소개", href: "#hero" },
  { id: "terms", label: "이용약관", href: "/terms" },
  { id: "privacy", label: "개인정보처리방침", href: "/privacy" },
  { id: "support", label: "고객센터", href: `mailto:${FOOTER_CONTACT_EMAIL}` },
];

export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Petty. All rights reserved.`;
