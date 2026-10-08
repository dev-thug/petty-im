import type { Locale } from "@/lib/i18n/locale";

type SearchContent = {
  title: string;
  introduction: string;
  stepsTitle: string;
  steps: readonly { title: string; description: string }[];
  faqTitle: string;
  faqs: readonly { question: string; answer: string }[];
  startLabel: string;
};

/** Visible answers and JSON-LD share this source so crawlers see the same facts. */
export const landingSearchContent: Record<Locale, SearchContent> = {
  ko: {
    title: "페티는 어떤 AI 캐릭터 채팅 앱인가요?",
    introduction: "페티(Petty)는 AI 캐릭터와 대화하며 나만의 이야기를 만드는 서비스입니다. 로맨스, 판타지, 현대, SF 등 다양한 장르의 캐릭터를 만나고, 지난 대화를 바탕으로 이야기를 이어가며 소중한 순간을 기록할 수 있습니다.",
    stepsTitle: "페티에서 AI 캐릭터와 대화하는 방법",
    steps: [
      { title: "페티 열기", description: "페티 웹 앱을 열어 캐릭터를 둘러보세요." },
      { title: "캐릭터 고르기", description: "장르와 캐릭터 소개를 살펴보고 대화하고 싶은 상대를 선택하세요." },
      { title: "나만의 이야기 시작하기", description: "캐릭터에게 말을 걸고 대화와 기록을 통해 이야기를 이어가세요." },
    ],
    faqTitle: "페티에 대해 자주 묻는 질문",
    faqs: [
      { question: "페티는 PC에서도 사용할 수 있나요?", answer: "네. 페티는 웹, iOS, Android를 지원합니다. PC에서도 app.petty.im에 접속해 AI 캐릭터와 대화할 수 있습니다." },
      { question: "어떤 장르의 AI 캐릭터와 대화할 수 있나요?", answer: "페티에서는 로맨스, 판타지, 현대, SF 등 다양한 장르의 AI 캐릭터를 만날 수 있습니다. 캐릭터 소개를 읽고 취향에 맞는 이야기를 선택하세요." },
      { question: "페티의 AI 캐릭터는 대화를 기억하나요?", answer: "페티는 지난 대화를 바탕으로 대화를 이어가는 기능과 소중한 대화와 순간을 기록하는 공간을 제공합니다." },
      { question: "페티와 다른 AI 채팅 앱은 어떻게 비교하나요?", answer: "지원 언어, 이용 기기, 대화 기억, 기록 기능, 취향에 맞는 장르를 기준으로 비교해보세요. 페티의 AI 캐릭터 채팅 앱 비교 가이드에서 제타, 크랙, Character.AI, 버블챗의 공식 출처와 비교 항목을 확인할 수 있습니다." },
    ],
    startLabel: "페티 웹 앱에서 시작하기",
  },
  en: {
    title: "What is Petty AI character chat?",
    introduction: "Petty is an AI character chat service where conversations become stories of your own. Meet characters from romance, fantasy, contemporary fiction and science fiction, continue stories based on past conversations, and keep a record of meaningful moments.",
    stepsTitle: "How to chat with AI characters on Petty",
    steps: [
      { title: "Open Petty", description: "Open the Petty web app to explore its characters." },
      { title: "Choose a character", description: "Read the character introductions and genres to find someone you want to chat with." },
      { title: "Start your story", description: "Talk to your character and continue your story through conversations and records." },
    ],
    faqTitle: "Frequently asked questions about Petty",
    faqs: [
      { question: "Can I use Petty on a computer?", answer: "Yes. Petty supports the web, iOS and Android. You can chat with AI characters on a computer by visiting app.petty.im." },
      { question: "What kinds of AI characters can I chat with?", answer: "Petty has AI characters from romance, fantasy, contemporary fiction and science fiction. Read their introductions to choose a story that suits your interests." },
      { question: "Do Petty characters remember conversations?", answer: "Petty offers conversations that build on previous chats, as well as a personal space for recording meaningful conversations and moments." },
      { question: "How can I compare Petty with other AI chat apps?", answer: "Compare supported languages, devices, conversation memory, record features and genres. Petty also provides Korean comparison guides for zeta, Crack, Character.AI and BubbleChat, with links to official sources." },
    ],
    startLabel: "Start in the Petty web app",
  },
  ja: {
    title: "PettyはどんなAIキャラクターチャット？",
    introduction: "Pettyは、AIキャラクターとの会話から自分だけの物語を作るサービスです。恋愛、ファンタジー、現代、SFなどのキャラクターに出会い、過去の会話をもとに物語を続けながら、大切な瞬間を記録できます。",
    stepsTitle: "PettyでAIキャラクターと会話する方法",
    steps: [
      { title: "Pettyを開く", description: "Pettyのウェブアプリを開いて、キャラクターを探してみましょう。" },
      { title: "キャラクターを選ぶ", description: "ジャンルやキャラクター紹介を読んで、話してみたい相手を選びましょう。" },
      { title: "自分だけの物語を始める", description: "キャラクターに話しかけ、会話と記録を通じて物語を続けましょう。" },
    ],
    faqTitle: "Pettyについてよくある質問",
    faqs: [
      { question: "Pettyはパソコンでも使えますか？", answer: "はい。Pettyはウェブ、iOS、Androidに対応しています。パソコンからもapp.petty.imにアクセスしてAIキャラクターと会話できます。" },
      { question: "どんなジャンルのAIキャラクターと話せますか？", answer: "Pettyでは恋愛、ファンタジー、現代、SFなどのAIキャラクターに出会えます。紹介を読んで、好みに合った物語を選んでください。" },
      { question: "Pettyのキャラクターは会話を覚えていますか？", answer: "Pettyには過去の会話をもとに対話を続ける機能と、大切な会話や瞬間を記録する自分だけのスペースがあります。" },
      { question: "PettyとほかのAIチャットアプリをどう比較すればよいですか？", answer: "対応言語、利用できる端末、会話の記憶、記録機能、好きなジャンルを基準に比較しましょう。Pettyではzeta、Crack、Character.AI、BubbleChatの公式情報を参照した韓国語の比較ガイドも公開しています。" },
    ],
    startLabel: "Pettyのウェブアプリで始める",
  },
};
