import type { Comparison } from "./types";

export const characterAi: Comparison = {
  slug: "character-ai",
  competitorName: "Character.AI",
  competitorOperator: "Character Technologies",
  aliases: [
    "Character.AI 대체",
    "캐릭터 AI 대신",
    "Character AI 한국어 대안",
    "c.ai 대체 앱",
  ],
  title: "Character.AI 대체 — 한국어로 쓰는 AI 캐릭터 채팅 | Petty",
  description:
    "Character.AI 대신 쓸 한국어 AI 캐릭터 채팅을 찾고 있다면. 두 서비스의 차이와 각각 어떤 사람에게 맞는지 정리했습니다.",
  heading: "Character.AI 대체 — 한국어로 쓰는 AI 캐릭터 채팅",
  summary: [
    "Character.AI는 이 카테고리를 만든 서비스입니다. 캐릭터 수와 커뮤니티에서 여전히 가장 크고, 영어 환경에서는 대체하기 어렵습니다.",
    "Petty는 한국어를 1순위로 만든 서비스입니다. 번역된 한국어가 아니라 처음부터 한국어 대화를 전제로 캐릭터와 카피를 설계했고, 일본어 · 영어도 함께 제공합니다.",
  ],
  whySwitch: {
    id: "why",
    title: "Character.AI에서 다른 서비스를 찾는 이유",
    paragraphs: [
      "가장 자주 언급되는 이유는 언어입니다. 한국어로 대화할 수는 있지만, 말투와 뉘앙스가 영어권 캐릭터를 번역한 듯한 느낌으로 돌아오는 경우가 있습니다. 존댓말과 반말의 거리, 선후배 호칭 같은 요소는 한국어를 전제로 만들어야 자연스럽게 나옵니다.",
      "정책 변화도 이유가 됐습니다. Character.AI는 2025년 말 18세 미만 이용자의 오픈엔디드 채팅을 종료했습니다. 이 변화 이후 대체 서비스를 찾는 검색이 크게 늘었습니다.",
      "국내 이용자에게는 접속 속도와 결제, 고객 문의 대응처럼 서비스 운영 위치에서 오는 차이도 실질적인 이유입니다.",
    ],
  },
  tableCaption: "Character.AI와 Petty 한눈에 비교",
  rows: [
    {
      label: "1순위 언어",
      competitor: "영어 (다국어 지원)",
      petty: "한국어 (일본어 · 영어 동시 제공)",
    },
    {
      label: "캐릭터 규모",
      competitor: "이용자 창작 기반의 대형 라이브러리",
      petty: "큐레이션된 캐릭터 + 직접 만들기",
    },
    {
      label: "연령 정책",
      competitor: "2025년 말 18세 미만 오픈엔디드 채팅 종료",
      petty: "이용약관 기준 (petty.im/terms)",
    },
    {
      label: "대화 기억",
      competitor: "세션 내 맥락 유지",
      petty: "대화를 기억해 다음 대화로 이어감",
    },
    {
      label: "기록",
      competitor: "채팅 기록",
      petty: "대화와 순간을 남기고 다시 보는 공간",
    },
    {
      label: "이용 방법",
      competitor: "웹(character.ai) · iOS · Android 앱",
      petty: "웹(app.petty.im) · iOS · Android 앱",
    },
    {
      label: "운영",
      competitor: "미국",
      petty: "한국 (스페시파이) · 국내 약관과 개인정보처리방침 제공",
    },
  ],
  sections: [
    {
      id: "korean",
      title: "한국어가 기본값이라는 것",
      paragraphs: [
        "번역된 한국어와 한국어로 쓰인 한국어는 다릅니다. Petty의 캐릭터는 '차가운 후배 서하', '소꿉친구 유리'처럼 한국어 관계 호칭 위에서 설계됐습니다. 존댓말에서 반말로 넘어가는 순간, 선배라고 부르다 이름을 부르게 되는 순간 같은 것이 대화의 사건이 됩니다.",
        "영어권 서비스에서 이 결을 재현하려면 프롬프트로 계속 교정해야 합니다. 그 교정 작업 자체가 몰입을 깨뜨립니다.",
      ],
    },
    {
      id: "scale",
      title: "규모는 Character.AI가 앞섭니다",
      paragraphs: [
        "숨길 이유가 없는 사실입니다. 캐릭터 수, 커뮤니티, 축적된 창작물 모두 Character.AI가 훨씬 큽니다. 아주 구체적인 원작 캐릭터나 니치한 설정을 찾는다면 그쪽에 있을 확률이 높습니다.",
        "Petty가 그 규모를 이기려 하지는 않습니다. 대신 처음 열었을 때 무엇부터 해야 할지 알기 쉬운 상태를 목표로 합니다.",
      ],
    },
    {
      id: "policy",
      title: "국내 서비스로서의 차이",
      paragraphs: [
        "Petty는 국내 사업자가 운영하며 한국어 이용약관과 개인정보처리방침을 제공합니다. 문의도 한국어로 처리됩니다.",
        "해외 서비스와 비교할 때 이 부분은 취향이 아니라 조건에 가깝습니다. 결제 · 탈퇴 · 데이터 처리에 대해 한국어로 확인할 수 있는지가 중요한 이용자에게는 무시하기 어려운 차이입니다.",
      ],
    },
  ],
  stayWithCompetitor: [
    "영어로 대화하는 것이 더 편한 사람",
    "특정 원작 캐릭터나 니치한 설정을 반드시 찾아야 하는 사람",
    "이용자 창작 라이브러리의 규모 자체가 목적인 사람",
  ],
  choosePetty: [
    "한국어 말투와 호칭이 자연스러운 대화를 원하는 사람",
    "한국어 · 일본어 · 영어를 오가며 쓰는 사람",
    "대화가 기억되고 기록으로 남는 경험을 원하는 사람",
    "국내 약관 · 개인정보처리방침 · 한국어 문의를 중요하게 보는 사람",
  ],
  faqs: [
    {
      question: "Character.AI 대신 쓸 한국어 앱이 있나요?",
      answer:
        "국내 서비스로는 제타, 크랙, 버블챗, Petty 등이 있습니다. 규모를 우선한다면 제타, 한국어 대화의 결과 대화 연속성을 우선한다면 Petty를 보시면 됩니다.",
    },
    {
      question: "Character.AI 캐릭터를 Petty로 가져올 수 있나요?",
      answer:
        "직접 이전하는 기능은 없습니다. 다만 Petty에서도 캐릭터를 직접 만들 수 있으므로, 원하는 설정을 새로 구성하는 방식은 가능합니다.",
    },
    {
      question: "Petty는 미성년자도 쓸 수 있나요?",
      answer:
        "이용 자격은 Petty 이용약관(petty.im/terms)을 확인해 주세요. 약관에 명시된 기준이 기준입니다.",
    },
  ],
  sources: [
    {
      label: "Character.AI/대체 방안 — 나무위키",
      url: "https://namu.wiki/w/Character.AI/%EB%8C%80%EC%B2%B4%20%EB%B0%A9%EC%95%88",
    },
    {
      label: "9 Best Character.AI Alternatives (2026)",
      url: "https://aiinsightsnews.net/character-ai-alternatives/",
    },
  ],
};
