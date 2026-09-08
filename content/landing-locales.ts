import * as base from "./landing-content";
import type { Locale } from "@/lib/i18n/locale";

const ko = {
  ...base,
  INTRODUCTIONS: {
    seoha:
      "무심한 말투 뒤에 숨겨진 다정함. 서하와 함께 평범한 하루를 특별한 이야기로 만들어보세요.",
    ian: "알 수 없는 마음도 연구할 수 있을까요? 호기심 많은 이안과 새로운 가능성을 발견해보세요.",
    yuri: "오랫동안 곁을 지켜온 소꿉친구. 유리에게 오늘 하루의 이야기를 들려주세요.",
    kyle: "도시의 불빛 아래, 당신의 편이 되어줄 히어로. 카일과 새로운 모험을 시작해보세요.",
    elia: "일상에 작은 마법이 필요한 순간. 엘리아와 함께 환상 속 이야기를 펼쳐보세요.",
  } as Record<string, string>,
  UI: {
    navigation: "주요 메뉴",
    footerNavigation: "바닥글 메뉴",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    language: "언어 선택",
    close: "닫기",
    characterDetails: "캐릭터 소개 보기",
    storyCta: "함께 이야기 시작하기",
    openApp: "페티 앱 열기",
    bookAlt: "보라색 책과 깃펜으로 펼쳐지는 나만의 이야기",
    phoneAlt: "Petty 앱의 캐릭터 탐색, 대화, 프로필 화면 미리보기",
    qrAlt: "Petty 모바일 페이지 QR 코드",
    qrLink: "모바일에서 Petty 열기",
    top: "Petty 처음으로",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    support: "고객센터",
    about: "서비스 소개",
  },
  META: {
    title: "Petty | 당신이 주인공이 되는 이야기",
    description:
      "취향에 맞는 AI 캐릭터를 만나고, 대화로 나만의 이야기를 만들어보세요.",
    ogLocale: "ko_KR",
  },
  PHONE_IMAGE: "/assets/app-phones.webp",
};
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;
export type LandingContent = Widen<typeof ko>;

const en: LandingContent = {
  ...ko,
  NAV_LINKS: [
    { id: "hero", label: "About", href: "#hero" },
    { id: "features", label: "Features", href: "#features" },
    { id: "characters", label: "Characters", href: "#characters" },
    { id: "download", label: "Get the app", href: "#download" },
  ],
  NAV_CTA_LABEL: "Get started",
  HERO_TITLE_LINES: ["Meet your characters.", "Be the main character."],
  HERO_TITLE_HIGHLIGHT: "Your story. Petty.",
  HERO_DESCRIPTION: [
    "Find AI characters you connect with.",
    "Turn every conversation into a story of your own.",
  ],
  HERO_PRIMARY_CTA_LABEL: "Start with Petty",
  HERO_SECONDARY_CTA_LABEL: "Explore characters",
  FEATURES_TITLE: "Make yourself at home with Petty",
  FEATURES_SUBTITLE: "Connect with AI characters, one conversation at a time.",
  FEATURE_HIGHLIGHTS: [
    {
      id: "characters",
      title: "Characters for you",
      description:
        "Find characters you love and build a connection of your own.",
    },
    {
      id: "memory",
      title: "Pick up your story",
      description: "Conversation memories help your story carry on naturally.",
    },
    {
      id: "records",
      title: "Your own little world",
      description: "Save the conversations and moments you want to revisit.",
    },
    {
      id: "story",
      title: "A story only you can tell",
      description: "Create your own story, together with AI characters.",
    },
  ],
  FEATURE_CHAT_PREVIEW: {
    incoming: ["Another late night?", "Are you okay?"],
    outgoing: ["I'm okay.", "Glad you're here."],
  },
  FEATURE_RECORD_PREVIEWS: [
    {
      id: "seoha",
      name: "Seoha",
      role: "The quiet one",
      message: "…Don't mention it.",
      time: "2h ago",
    },
    {
      id: "ian",
      name: "Ian",
      role: "Brilliant researcher",
      message: "The new results are in.",
      time: "2h ago",
    },
    {
      id: "kyle",
      name: "Kyle",
      role: "City hero",
      message: "I won't give up on justice.",
      time: "1d ago",
    },
  ],
  CHARACTERS_TITLE: "Find your next favorite character",
  CHARACTERS_SUBTITLE: "From romance and everyday life to fantasy and sci-fi.",
  CHARACTERS: [
    { id: "seoha", name: "Seoha", role: "The quiet one", genre: "Romance" },
    { id: "ian", name: "Ian", role: "Brilliant researcher", genre: "Modern" },
    { id: "yuri", name: "Yuri", role: "Childhood friend", genre: "Romance" },
    { id: "kyle", name: "Kyle", role: "City hero", genre: "Sci-fi" },
    { id: "elia", name: "Elia", role: "Witch", genre: "Fantasy" },
  ],
  CHARACTERS_MORE_LABEL: ["More characters,", "more stories"],
  INTRODUCTIONS: {
    seoha:
      "Behind her cool words is a quiet kindness. Make an ordinary day into something special with Seoha.",
    ian: "Can the heart be understood through research? Discover new possibilities with the ever-curious Ian.",
    yuri: "A childhood friend who's always been by your side. Tell Yuri about your day.",
    kyle: "A hero on your side beneath the city lights. Start a new adventure with Kyle.",
    elia: "When your day could use a little magic, step into a fantasy story with Elia.",
  },
  DOWNLOAD_TITLE: "Your story starts with Petty",
  DOWNLOAD_SUBTITLE: "A new conversation. A whole new world to explore.",
  DOWNLOAD_QR_LABEL: "Open Petty on your phone",
  FOOTER_TAGLINE: [
    "AI characters. Real imagination.",
    "Your next story starts here.",
  ],
  FOOTER_LINKS: [
    { id: "about", label: "About", href: "#hero" },
    { id: "terms", label: "Terms", href: "/terms" },
    { id: "privacy", label: "Privacy", href: "/privacy" },
    {
      id: "support",
      label: "Support",
      href: `mailto:${base.FOOTER_CONTACT_EMAIL}`,
    },
  ],
  UI: {
    navigation: "Main navigation",
    footerNavigation: "Footer navigation",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    language: "Choose language",
    close: "Close",
    characterDetails: "View character",
    storyCta: "Start your story together",
    openApp: "Open Petty",
    bookAlt: "A lavender book and quill for your own story",
    phoneAlt:
      "Preview of Petty character discovery, conversations and profiles",
    qrAlt: "QR code for Petty's mobile website",
    qrLink: "Open Petty on your phone",
    top: "Back to Petty home",
    terms: "Terms (Korean)",
    privacy: "Privacy (Korean)",
    support: "Support",
    about: "About",
  },
  META: {
    title: "Petty | Be the main character in your story",
    description:
      "Find AI characters you connect with and turn every conversation into a story of your own.",
    ogLocale: "en_US",
  },
  PHONE_IMAGE: "/assets/app-phones-en.webp",
};

const ja: LandingContent = {
  ...ko,
  NAV_LINKS: [
    { id: "hero", label: "Pettyとは", href: "#hero" },
    { id: "features", label: "主な機能", href: "#features" },
    { id: "characters", label: "キャラクター", href: "#characters" },
    { id: "download", label: "アプリ", href: "#download" },
  ],
  NAV_CTA_LABEL: "はじめる",
  HERO_TITLE_LINES: ["好きなキャラクターと、", "あなたが主役になる"],
  HERO_TITLE_HIGHLIGHT: "物語を、Pettyで。",
  HERO_DESCRIPTION: [
    "お気に入りのAIキャラクターを見つけて、",
    "会話から、あなただけの物語を紡ごう。",
  ],
  HERO_PRIMARY_CTA_LABEL: "Pettyをはじめる",
  HERO_SECONDARY_CTA_LABEL: "キャラクターを見る",
  FEATURES_TITLE: "Pettyは、こんな場所",
  FEATURES_SUBTITLE: "AIキャラクターと語り合い、少しずつ絆を育む体験。",
  FEATURE_HIGHLIGHTS: [
    {
      id: "characters",
      title: "あなただけの出会い",
      description: "個性豊かなキャラクターと、特別な関係を育てよう。",
    },
    {
      id: "memory",
      title: "会話の続きを、いつでも",
      description: "会話の記憶をもとに、物語が自然につながっていく。",
    },
    {
      id: "records",
      title: "思い出を残す場所",
      description: "大切な会話やひとときを記録して、いつでも振り返ろう。",
    },
    {
      id: "story",
      title: "あなたと紡ぐ物語",
      description: "AIキャラクターと一緒につくる、あなただけの物語。",
    },
  ],
  FEATURE_CHAT_PREVIEW: {
    incoming: ["先輩、今日も遅いですね。", "大丈夫ですか？"],
    outgoing: ["うん、大丈夫。", "いてくれてよかった。"],
  },
  FEATURE_RECORD_PREVIEWS: [
    {
      id: "seoha",
      name: "ソハ",
      role: "クールな後輩",
      message: "…お礼なんて、いいですよ。",
      time: "2時間前",
    },
    {
      id: "ian",
      name: "イアン",
      role: "天才研究者",
      message: "新しい実験結果が出ました。",
      time: "2時間前",
    },
    {
      id: "kyle",
      name: "カイル",
      role: "街のヒーロー",
      message: "正義を諦めはしない。",
      time: "1日前",
    },
  ],
  CHARACTERS_TITLE: "お気に入りのキャラクターを見つけよう",
  CHARACTERS_SUBTITLE:
    "恋愛、ファンタジー、現代、SF。いろんな世界で待っています。",
  CHARACTERS: [
    { id: "seoha", name: "ソハ", role: "クールな後輩", genre: "恋愛" },
    { id: "ian", name: "イアン", role: "天才研究者", genre: "現代" },
    { id: "yuri", name: "ユリ", role: "幼なじみ", genre: "恋愛" },
    { id: "kyle", name: "カイル", role: "街のヒーロー", genre: "SF" },
    { id: "elia", name: "エリア", role: "魔法使い", genre: "ファンタジー" },
  ],
  CHARACTERS_MORE_LABEL: ["もっと出会って、", "もっと物語を"],
  INTRODUCTIONS: {
    seoha:
      "そっけない言葉の奥にある、さりげない優しさ。ソハと一緒に、何気ない一日を特別な物語に。",
    ian: "心の謎も、研究で解き明かせるでしょうか？ 好奇心いっぱいのイアンと、新しい可能性を探そう。",
    yuri: "ずっとそばにいてくれた幼なじみ。今日あったことを、ユリに聞かせてみませんか。",
    kyle: "街の明かりの下で、あなたの味方になってくれるヒーロー。カイルと新しい冒険へ。",
    elia: "日常に、ちょっと魔法がほしいとき。エリアと一緒に、幻想の物語を紡ごう。",
  },
  DOWNLOAD_TITLE: "Pettyで、物語をはじめよう",
  DOWNLOAD_SUBTITLE: "あなただけの物語が、ここで待っています。",
  DOWNLOAD_QR_LABEL: "スマホでPettyを開く",
  STORE_BADGES: {
    appStore: { ...ko.STORE_BADGES.appStore, eyebrow: "ダウンロードはこちら" },
    googlePlay: {
      ...ko.STORE_BADGES.googlePlay,
      eyebrow: "ダウンロードはこちら",
    },
  },
  FOOTER_TAGLINE: ["AIキャラクターと一緒に、", "あなただけの物語を。"],
  FOOTER_LINKS: [
    { id: "about", label: "Pettyとは", href: "#hero" },
    { id: "terms", label: "利用規約", href: "/terms" },
    { id: "privacy", label: "プライバシー", href: "/privacy" },
    {
      id: "support",
      label: "お問い合わせ",
      href: `mailto:${base.FOOTER_CONTACT_EMAIL}`,
    },
  ],
  UI: {
    navigation: "メインメニュー",
    footerNavigation: "フッターメニュー",
    menuOpen: "メニューを開く",
    menuClose: "メニューを閉じる",
    language: "言語を選択",
    close: "閉じる",
    characterDetails: "キャラクター紹介を見る",
    storyCta: "一緒に物語をはじめる",
    openApp: "Pettyを開く",
    bookAlt: "あなただけの物語を紡ぐ紫の本と羽根ペン",
    phoneAlt: "Pettyのキャラクター検索、会話、プロフィール画面のプレビュー",
    qrAlt: "Pettyのモバイルサイトを開くQRコード",
    qrLink: "スマホでPettyを開く",
    top: "Pettyのトップへ",
    terms: "利用規約（韓国語）",
    privacy: "プライバシー（韓国語）",
    support: "お問い合わせ",
    about: "Pettyとは",
  },
  META: {
    title: "Petty | あなたが主役になる物語",
    description:
      "お気に入りのAIキャラクターを見つけて、会話からあなただけの物語を紡ごう。",
    ogLocale: "ja_JP",
  },
  PHONE_IMAGE: "/assets/app-phones-ja.webp",
};
export const landingLocales: Record<Locale, LandingContent> = { ko, ja, en };
