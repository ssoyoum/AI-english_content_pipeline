const sentences = [
  {
    section: "INTRODUCTION",
    text: "Climate change is no longer a distant threat—it is a present reality that affects ecosystems, communities, and the availability of vital resources.",
    translation: "기후 변화는 더 이상 먼 미래의 위협이 아니다. 기후 변화는 생태계와 공동체, 그리고 필수 자원의 이용 가능성에 영향을 미치는 현재의 현실이다.",
    learningNote: "no longer A는 ‘더 이상 A가 아니다’라는 뜻입니다.",
    concepts: [
      { label: "현재 일어나고 있는 문제", keywords: ["현재", "현실", "지금", "오늘"], warnings: ["미래", "언젠가"], note: "present reality는 먼 미래가 아니라 지금 실제로 일어나고 있다는 뜻입니다." },
      { label: "영향을 받는 대상", keywords: ["생태계", "공동체", "자원"], warnings: [], note: "affects 뒤에는 생태계, 공동체, 필수 자원이 병렬로 연결됩니다." }
    ]
  },
  {
    section: "INTRODUCTION",
    text: "Among the most critical of these resources is water.",
    translation: "이러한 자원 중 가장 중요한 것 가운데 하나가 물이다.",
    learningNote: "Among the most critical of these resources is water는 ‘이 자원들 중 가장 중요한 것은 물이다’라는 도치 표현입니다.",
    concepts: [
      { label: "물의 중요성", keywords: ["물"], warnings: [], note: "문장의 핵심 주어는 water입니다." },
      { label: "가장 중요한 자원 중 하나", keywords: ["가장", "중요", "자원"], warnings: [], note: "Among ~는 여러 자원 가운데 하나를 고르는 표현입니다." }
    ]
  },
  {
    section: "CHANGING RAINFALL PATTERNS",
    text: "Over the past few decades, scientists have observed shifts in rainfall distribution around the world.",
    translation: "지난 수십 년 동안 과학자들은 전 세계적으로 강우 분포가 변하는 현상을 관찰해왔다.",
    learningNote: "have observed는 과거부터 현재까지 관찰해왔다는 현재완료 표현입니다.",
    concepts: [
      { label: "지난 수십 년 동안", keywords: ["지난", "수십", "몇십", "몇 십", "기간"], warnings: [], note: "Over the past few decades는 최근 수십 년에 걸친 기간을 뜻합니다." },
      { label: "강우 분포의 변화", keywords: ["강우", "강수", "비", "분포", "변화", "이동"], warnings: [], note: "shifts in rainfall distribution은 비가 내리는 지역과 양상이 변했다는 의미입니다." }
    ]
  },
  {
    section: "CHANGING RAINFALL PATTERNS",
    text: "Some regions are experiencing prolonged droughts, while others face intense flooding.",
    translation: "일부 지역은 장기간의 가뭄을 겪고 있는 반면, 다른 지역은 극심한 홍수에 직면하고 있다.",
    learningNote: "while은 두 지역의 서로 다른 상황을 대조합니다.",
    concepts: [
      { label: "일부 지역의 장기 가뭄", keywords: ["일부", "지역", "장기", "장기간", "가뭄"], warnings: [], note: "prolonged droughts는 오랫동안 이어지는 가뭄입니다." },
      { label: "다른 지역의 극심한 홍수", keywords: ["다른", "지역", "극심", "심한", "홍수"], warnings: [], note: "intense flooding은 강도가 매우 큰 홍수를 뜻합니다." }
    ]
  },
  {
    section: "CHANGING RAINFALL PATTERNS",
    text: "These changes disrupt the natural cycle of water, making it difficult to manage reservoirs, irrigation systems, and urban water supplies.",
    translation: "이러한 변화는 물의 자연 순환을 방해하여 저수지, 관개 시스템, 도시의 물 공급을 관리하기 어렵게 만든다.",
    learningNote: "making it difficult to manage는 물 관리가 어려워지는 결과를 설명합니다.",
    concepts: [
      { label: "물의 자연 순환 방해", keywords: ["자연", "순환", "물", "방해", "깨뜨"], warnings: [], note: "These changes는 앞 문장의 강우 패턴 변화를 가리킵니다." },
      { label: "관리하기 어려워짐", keywords: ["어렵", "관리", "저수지", "관개", "공급"], warnings: [], note: "making it difficult to는 ‘~하기 어렵게 만들다’라는 결과 표현입니다." }
    ]
  },
  {
    section: "MELTING GLACIERS AND SNOWPACKS",
    text: "In many mountainous regions, glaciers and snowpacks serve as natural water towers, slowly releasing water into rivers and streams.",
    translation: "많은 산악 지역에서 빙하와 적설은 자연적인 물 저장고 역할을 하며, 강과 하천에 물을 천천히 방출한다.",
    learningNote: "serve as는 ‘~의 역할을 하다’, slowly releasing은 물을 방출하면서 역할을 한다는 뜻입니다.",
    concepts: [
      { label: "빙하와 적설", keywords: ["빙하", "눈", "적설", "설원"], warnings: [], note: "snowpacks는 산에 쌓인 눈과 눈 저장량을 가리킵니다." },
      { label: "자연적인 물 저장고 역할", keywords: ["저장", "물 저장", "물탑", "물 저장고", "역할"], warnings: [], note: "natural water towers는 물을 저장했다가 천천히 공급한다는 비유입니다." },
      { label: "강과 하천에 천천히 방출", keywords: ["강", "하천", "천천히", "방출", "흘려"], warnings: [], note: "slowly releasing은 물을 강과 하천으로 조금씩 보낸다는 의미입니다." }
    ]
  },
  {
    section: "MELTING GLACIERS AND SNOWPACKS",
    text: "However, due to global warming, these ice reserves are shrinking at an alarming rate.",
    translation: "그러나 지구 온난화로 인해 이러한 얼음 저장량은 우려스러운 속도로 줄어들고 있다.",
    learningNote: "due to는 원인을, at an alarming rate는 매우 걱정스러운 속도를 나타냅니다.",
    concepts: [
      { label: "지구 온난화가 원인", keywords: ["지구", "온난화", "기후", "더워"], warnings: [], note: "due to global warming은 빙하 감소의 원인을 설명합니다." },
      { label: "얼음 저장량이 빠르게 감소", keywords: ["얼음", "빙하", "저장", "줄", "감소", "사라"], warnings: [], note: "are shrinking은 현재 진행 중인 감소를 의미합니다." }
    ]
  },
  {
    section: "RISING TEMPERATURES",
    text: "Higher temperatures increase the rate of evaporation from lakes, rivers, and soil.",
    translation: "기온이 높아지면 호수, 강, 토양에서 물이 증발하는 속도가 빨라진다.",
    learningNote: "increase the rate of evaporation은 증발 속도가 빨라진다는 인과관계를 보여줍니다.",
    concepts: [
      { label: "기온 상승", keywords: ["기온", "온도", "더운", "높아"], warnings: [], note: "Higher temperatures가 문장의 원인입니다." },
      { label: "호수·강·토양에서 증발 증가", keywords: ["호수", "강", "토양", "증발", "빠르"], warnings: [], note: "from은 증발이 일어나는 장소를 나타냅니다." }
    ]
  },
  {
    section: "RISING TEMPERATURES",
    text: "This means that even if rainfall levels remain the same, the net water availability decreases.",
    translation: "이는 강우량이 동일하게 유지되더라도 실제로 이용할 수 있는 물의 양은 줄어든다는 의미이다.",
    learningNote: "even if는 ‘~일지라도’라는 조건을 만들며, 비가 같아도 실제 물의 양은 줄 수 있음을 강조합니다.",
    concepts: [
      { label: "강우량이 같아도", keywords: ["강우", "강수", "비", "같", "동일"], warnings: [], note: "even if rainfall levels remain the same은 비가 그대로라는 가정입니다." },
      { label: "실제로 이용 가능한 물은 감소", keywords: ["실제", "이용", "사용", "가능", "물", "줄", "감소"], warnings: ["증가", "늘"], note: "net water availability는 증발을 고려한 실제 물의 가용량입니다." }
    ]
  },
  {
    section: "WATER QUALITY ISSUES",
    text: "Not only is the quantity of water affected, but also its quality.",
    translation: "영향을 받는 것은 물의 양뿐만 아니라 수질도 마찬가지이다.",
    learningNote: "Not only A but also B 도치 구문으로, 물의 양과 수질 모두 영향을 받는다는 뜻입니다.",
    concepts: [
      { label: "물의 양", keywords: ["양", "수량", "물"], warnings: [], note: "quantity는 물의 양을 의미합니다." },
      { label: "물의 질 또는 수질", keywords: ["질", "수질", "깨끗", "오염"], warnings: [], note: "quality는 이 문맥에서 물의 질, 즉 수질입니다." },
      { label: "둘 다 영향을 받음", keywords: ["둘", "모두", "뿐만 아니라", "영향", "받"], warnings: [], note: "Not only A but also B는 A뿐만 아니라 B도라는 강조 표현입니다." }
    ]
  }
];

const dayTwoSentences = [
  {
    section: "THE VALUE OF REST",
    text: "Rest is not a reward for finishing everything; it is part of the process that helps us do meaningful work.",
    translation: "휴식은 모든 일을 끝낸 뒤 받는 보상이 아니라, 의미 있는 일을 할 수 있도록 돕는 과정의 일부이다.",
    learningNote: "not A; it is B는 ‘A가 아니라 B이다’라는 대조 구조입니다.",
    focusTerms: ["not a reward", "part of the process", "meaningful work"],
    concepts: [
      { label: "휴식은 보상이 아님", keywords: ["휴식", "보상", "아니"], warnings: ["보상이다"], note: "not a reward는 휴식을 보상으로 보지 않는다는 뜻입니다." },
      { label: "의미 있는 일을 돕는 과정의 일부", keywords: ["과정", "일부", "돕", "의미", "일"], warnings: [], note: "part of the process는 전체 과정에 포함된 요소라는 의미입니다." }
    ]
  },
  {
    section: "A SUSTAINABLE ROUTINE",
    text: "A sustainable routine gives people enough space to focus, recover, and return with more energy.",
    translation: "지속 가능한 생활 방식은 사람들이 집중하고 회복한 뒤 더 많은 에너지를 가지고 돌아올 충분한 여유를 준다.",
    learningNote: "enough space to + 동사는 ‘~할 충분한 여유’를 뜻합니다.",
    focusTerms: ["sustainable routine", "enough space", "focus", "recover", "more energy"],
    concepts: [
      { label: "지속 가능한 루틴", keywords: ["지속", "꾸준", "생활", "루틴", "방식"], warnings: [], note: "sustainable은 오래 유지할 수 있다는 의미입니다." },
      { label: "집중하고 회복할 여유", keywords: ["집중", "회복", "여유", "시간", "공간"], warnings: [], note: "space는 물리적 공간이 아니라 시간적·정신적 여유를 의미합니다." }
    ]
  },
  {
    section: "A SMALL CHANGE",
    text: "Even a small change in our daily habits can improve the way we feel and work.",
    translation: "일상 습관의 작은 변화만으로도 우리가 느끼고 일하는 방식이 좋아질 수 있다.",
    learningNote: "Even a small change는 작은 변화도 충분히 효과를 낼 수 있다는 강조입니다.",
    focusTerms: ["Even a small change", "daily habits", "improve", "the way we feel and work"],
    concepts: [
      { label: "작은 변화도 가능함", keywords: ["작은", "변화", "조금", "습관"], warnings: [], note: "Even은 작은 변화라도 의미가 있다는 점을 강조합니다." },
      { label: "느끼고 일하는 방식의 개선", keywords: ["느끼", "일하", "방식", "개선", "좋아", "나아"], warnings: [], note: "the way + 주어 + 동사는 ‘~하는 방식’을 뜻합니다." }
    ]
  }
];

function makeSampleSentence(section, text, translation, focusTerms) {
  return {
    section,
    text,
    translation,
    learningNote: "Focus on the highlighted phrase and its role in the sentence.",
    focusTerms,
    concepts: [{
      label: "Key structure",
      keywords: focusTerms.slice(0, 2),
      warnings: [],
      note: "Use this phrase as one meaningful unit when translating."
    }]
  };
}

const extraLessons = [
  {
    day: 3,
    tag: "READING · DIGITAL HABITS",
    title: "Digital Minimalism<br />and Attention",
    description: "Explore how intentional technology habits can protect focus and create room for deeper work.",
    sentences: [
      makeSampleSentence("FOCUS AND ATTENTION", "Digital minimalism asks us to use technology with intention rather than by default.", "디지털 미니멀리즘은 기술을 무조건 사용하는 대신 의도적으로 사용하라고 말합니다.", ["digital minimalism", "with intention", "rather than by default"]),
      makeSampleSentence("A QUIETER ROUTINE", "Short periods away from notifications can restore attention and reduce mental noise.", "알림에서 잠시 벗어나는 시간은 집중력을 회복하고 정신적인 소음을 줄여 줍니다.", ["periods away from", "restore attention", "reduce mental noise"])
    ]
  },
  {
    day: 4,
    tag: "READING · TECHNOLOGY",
    title: "Technology<br />and Trust",
    description: "Practice explaining why transparent systems help people make confident decisions.",
    sentences: [
      makeSampleSentence("TRANSPARENT SYSTEMS", "People trust a system more when they understand how it makes important decisions.", "사람들은 중요한 결정을 시스템이 어떻게 내리는지 이해할 때 그 시스템을 더 신뢰합니다.", ["trust a system", "when they understand", "important decisions"]),
      makeSampleSentence("CLEAR EXPLANATIONS", "Clear explanations turn complex tools into services that people can use responsibly.", "명확한 설명은 복잡한 도구를 사람들이 책임감 있게 사용할 수 있는 서비스로 바꿉니다.", ["clear explanations", "complex tools", "responsibly"])
    ]
  },
  {
    day: 5,
    tag: "READING · COMMUNICATION",
    title: "Global Communication<br />in Practice",
    description: "Build useful language for collaboration across cultures, teams, and time zones.",
    sentences: [
      makeSampleSentence("WORKING ACROSS BORDERS", "Effective communication depends on listening carefully and checking what the other person means.", "효과적인 의사소통은 주의 깊게 듣고 상대방의 의도를 확인하는 데 달려 있습니다.", ["effective communication", "depends on", "checking what"]),
      makeSampleSentence("SHARED CONTEXT", "A shared vocabulary helps teams solve misunderstandings before they become larger problems.", "공통된 어휘는 오해가 더 큰 문제가 되기 전에 팀이 해결하도록 도와줍니다.", ["shared vocabulary", "solve misunderstandings", "before they become"])
    ]
  },
  {
    day: 6,
    tag: "READING · HEALTHY HABITS",
    title: "Small Habits<br />That Last",
    description: "Learn how small, repeatable choices can become a reliable routine over time.",
    sentences: [
      makeSampleSentence("REPEATABLE ACTIONS", "A habit becomes easier to keep when the action is simple enough to repeat every day.", "습관은 매일 반복할 수 있을 만큼 행동이 간단할 때 더 쉽게 유지됩니다.", ["becomes easier to keep", "simple enough to", "repeat every day"]),
      makeSampleSentence("LONG-TERM CHANGE", "Consistency matters more than intensity when we are building a lasting change.", "지속적인 변화를 만들 때는 강도보다 꾸준함이 더 중요합니다.", ["consistency matters", "more than intensity", "lasting change"])
    ]
  },
  {
    day: 7,
    tag: "READING · CREATIVE THINKING",
    title: "Ideas into<br />Action",
    description: "Practice describing how thoughtful ideas become useful experiments and real results.",
    sentences: [
      makeSampleSentence("FROM IDEA TO TEST", "A useful idea becomes stronger when we test it with a real person and learn from the result.", "유용한 아이디어는 실제 사람에게 시험하고 결과에서 배울 때 더 발전합니다.", ["becomes stronger", "test it with", "learn from the result"]),
      makeSampleSentence("LEARNING BY DOING", "Small experiments give us evidence that can guide the next decision.", "작은 실험은 다음 결정을 이끌 수 있는 근거를 제공합니다.", ["small experiments", "give us evidence", "guide the next decision"])
    ]
  }
];

function appendThemeSentences(target, section, entries) {
  entries.forEach(([text, translation]) => target.push(makeSampleSentence(section, text, translation, text.toLowerCase().split(/\s+/).slice(0, 3))));
}

appendThemeSentences(dayTwoSentences, "REST AND RECOVERY", [
  ["Rest gives the brain time to organize new information and make useful connections.", "휴식은 뇌가 새로운 정보를 정리하고 유용한 연결을 만들 시간을 줍니다."],
  ["Learners often remember more when they alternate focused practice with short, intentional breaks.", "학습자는 집중 연습과 짧고 의도적인 휴식을 번갈아 할 때 더 많이 기억합니다."],
  ["A realistic schedule protects energy instead of using every available minute for work.", "현실적인 일정은 가능한 모든 시간을 일에 쓰는 대신 에너지를 보호합니다."],
  ["Sleep is one of the simplest ways to support memory, attention, and emotional balance.", "수면은 기억력과 집중력, 정서적 균형을 돕는 가장 간단한 방법 중 하나입니다."],
  ["When people ignore recovery, even meaningful goals can begin to feel impossible.", "회복을 무시하면 의미 있는 목표도 불가능하게 느껴지기 시작할 수 있습니다."],
  ["A short walk can create enough distance to return to a difficult problem with fresh eyes.", "짧은 산책은 어려운 문제를 새로운 시각으로 다시 볼 수 있는 거리를 만들어 줍니다."],
  ["The goal is not to avoid effort but to make effort sustainable over the long term.", "목표는 노력을 피하는 것이 아니라 장기적으로 지속 가능하게 만드는 것입니다."]
]);

const themeSentenceAdditions = {
  3: [
    ["A focused digital environment makes it easier to notice what deserves our attention.", "집중할 수 있는 디지털 환경은 무엇에 주의를 기울여야 하는지 알아차리기 쉽게 합니다."],
    ["Before adding a new tool, people can ask whether it solves a real and recurring problem.", "새로운 도구를 추가하기 전에 실제로 반복되는 문제를 해결하는지 물어볼 수 있습니다."],
    ["Turning off unnecessary alerts creates a quiet boundary around important work.", "불필요한 알림을 끄면 중요한 일 주변에 조용한 경계가 생깁니다."],
    ["Choosing fewer sources can help us read more carefully and remember what we learn.", "더 적은 자료를 선택하면 더 주의 깊게 읽고 배운 것을 기억하는 데 도움이 됩니다."],
    ["Intentional use does not reject technology; it gives technology a clear purpose.", "의도적인 사용은 기술을 거부하는 것이 아니라 기술에 분명한 목적을 부여합니다."],
    ["A device-free transition between tasks can protect the quality of our concentration.", "일 사이에 기기 없이 전환하는 시간은 집중의 질을 보호할 수 있습니다."],
    ["The less attention we spend on low-value choices, the more energy remains for creative work.", "가치가 낮은 선택에 쓰는 주의가 적을수록 창의적인 일에 더 많은 에너지가 남습니다."],
    ["Digital minimalism is a practice that can be adjusted as our priorities change.", "디지털 미니멀리즘은 우선순위가 바뀔 때 조정할 수 있는 실천입니다."]
  ],
  4: [
    ["Trust grows when a service explains its limits as clearly as its benefits.", "서비스가 장점만큼 한계도 명확하게 설명할 때 신뢰가 커집니다."],
    ["People need a way to question an automated decision when the result affects their lives.", "결과가 삶에 영향을 줄 때 사람들은 자동화된 결정에 질문할 방법이 필요합니다."],
    ["Transparent design shows which information was used and which information was left out.", "투명한 설계는 어떤 정보가 사용되었고 어떤 정보가 제외되었는지 보여 줍니다."],
    ["A reliable tool should make it possible to correct an error without starting over.", "신뢰할 수 있는 도구는 처음부터 다시 시작하지 않고 오류를 수정할 수 있게 해야 합니다."],
    ["Clear language can reduce fear when people are asked to try an unfamiliar system.", "명확한 언어는 사람들이 익숙하지 않은 시스템을 사용해 보라는 요청을 받을 때 두려움을 줄입니다."],
    ["Accountability matters because every useful technology still reflects human choices.", "유용한 기술도 인간의 선택을 반영하기 때문에 책임성이 중요합니다."],
    ["The best explanation is not the longest one but the one that helps a person act.", "가장 좋은 설명은 가장 긴 설명이 아니라 사람이 행동할 수 있게 하는 설명입니다."],
    ["Trust becomes stronger when users can see how feedback changes the product.", "사용자가 피드백이 제품을 어떻게 바꾸는지 볼 수 있을 때 신뢰가 더 강해집니다."]
  ],
  5: [
    ["Good collaboration begins when speakers make room for different ways of expressing an idea.", "좋은 협업은 사람들이 생각을 표현하는 다양한 방식을 받아들일 때 시작됩니다."],
    ["A short summary after a meeting can prevent small misunderstandings from spreading.", "회의 후 짧은 요약은 작은 오해가 커지는 것을 막을 수 있습니다."],
    ["Time-zone differences require teams to document decisions instead of relying on memory.", "시간대가 다르면 팀은 기억에 의존하지 않고 결정을 기록해야 합니다."],
    ["Questions are often more useful than quick answers when the context is unfamiliar.", "맥락이 익숙하지 않을 때는 빠른 답보다 질문이 더 유용한 경우가 많습니다."],
    ["Respectful disagreement can reveal an assumption that the whole team had overlooked.", "존중하는 의견 차이는 팀 전체가 놓친 가정을 드러낼 수 있습니다."],
    ["Shared examples give abstract instructions a meaning that everyone can discuss.", "공통된 예시는 추상적인 지시에 모두가 논의할 수 있는 의미를 부여합니다."],
    ["A team communicates better when important information is easy to find later.", "중요한 정보를 나중에 쉽게 찾을 수 있을 때 팀은 더 잘 소통합니다."],
    ["Listening for the intention behind a sentence is as important as translating its words.", "문장의 단어를 번역하는 것만큼 문장 뒤의 의도를 듣는 것도 중요합니다."]
  ],
  6: [
    ["The first step should be small enough that it does not depend on perfect motivation.", "첫 단계는 완벽한 의지에 의존하지 않을 만큼 작아야 합니다."],
    ["Attaching a new action to an existing routine makes it easier to remember.", "새로운 행동을 기존 루틴에 연결하면 기억하기 쉬워집니다."],
    ["Tracking a habit can provide useful information without turning the routine into a competition.", "습관을 기록하면 루틴을 경쟁으로 만들지 않고 유용한 정보를 얻을 수 있습니다."],
    ["Missing one day is a signal to adjust the plan, not a reason to abandon it.", "하루를 놓친 것은 계획을 포기할 이유가 아니라 조정할 신호입니다."],
    ["A flexible routine can survive changes in schedule, energy, and unexpected events.", "유연한 루틴은 일정과 에너지의 변화, 예상치 못한 사건을 견딜 수 있습니다."],
    ["People are more likely to continue when progress is visible in a simple form.", "진전이 간단한 형태로 보일 때 사람들은 계속할 가능성이 더 높습니다."],
    ["The purpose of a routine is to support a life, not to control every moment of it.", "루틴의 목적은 삶의 모든 순간을 통제하는 것이 아니라 삶을 돕는 것입니다."],
    ["Over time, repeated choices can become evidence that a person is capable of change.", "시간이 지나면 반복된 선택은 사람이 변할 수 있다는 증거가 될 수 있습니다."]
  ],
  7: [
    ["An experiment turns an abstract possibility into something that can be observed and discussed.", "실험은 추상적인 가능성을 관찰하고 논의할 수 있는 것으로 바꿉니다."],
    ["Good ideas become clearer when we describe the problem they are meant to solve.", "좋은 아이디어는 해결하려는 문제를 설명할 때 더 분명해집니다."],
    ["Feedback is most useful when it arrives early enough to change the next attempt.", "피드백은 다음 시도를 바꿀 수 있을 만큼 일찍 올 때 가장 유용합니다."],
    ["A failed test can narrow the possibilities and save time on the next decision.", "실패한 테스트는 가능성을 좁히고 다음 결정에 걸리는 시간을 줄일 수 있습니다."],
    ["Creative work needs both imagination and a practical way to evaluate results.", "창의적인 작업에는 상상력과 결과를 평가할 실용적인 방법이 모두 필요합니다."],
    ["Teams move faster when they separate a promising idea from their personal identity.", "팀은 유망한 아이디어와 개인의 정체성을 분리할 때 더 빠르게 움직입니다."],
    ["A clear next step keeps a discussion from ending with enthusiasm but no action.", "명확한 다음 단계는 토론이 열정만 남긴 채 행동 없이 끝나는 것을 막습니다."],
    ["Learning by doing gives language a purpose because every phrase supports a real decision.", "실행을 통한 학습은 모든 표현이 실제 결정을 돕기 때문에 언어에 목적을 부여합니다."]
  ]
};

Object.entries(themeSentenceAdditions).forEach(([day, entries]) => {
  const lesson = extraLessons.find((item) => item.day === Number(day));
  if (lesson) appendThemeSentences(lesson.sentences, lesson.sentences[0].section, entries);
});

const lessons = [
  {
    day: 1,
    tag: "READING · CLIMATE",
    title: "Climate Change<br />and Water",
    description: "기후 변화가 물의 양과 수질에 미치는 영향을 읽고 이해합니다.",
    sentences
  },
  {
    day: 2,
    tag: "READING · WELLBEING",
    title: "The Value of<br />Rest",
    description: "휴식과 지속 가능한 루틴이 학습과 일에 미치는 영향을 읽고 이해합니다.",
    sentences: dayTwoSentences
  },
  ...extraLessons
];

const storageKey = "english-content-pipeline-study-v1";
const answersStorageKey = `${storageKey}-answers`;
const completionStorageKey = `${storageKey}-completion`;
const legacyAnswers = JSON.parse(localStorage.getItem(storageKey) || "{}");
const savedAnswers = JSON.parse(localStorage.getItem(answersStorageKey) || "{}");
if (!savedAnswers[1] && Object.keys(legacyAnswers).length) savedAnswers[1] = legacyAnswers;
const completionByDate = JSON.parse(localStorage.getItem(completionStorageKey) || "{}");
const studyTimeStorageKey = `${storageKey}-study-time`;
const studyTimeByDate = JSON.parse(localStorage.getItem(studyTimeStorageKey) || "{}");
let studyTimerStartedAt = null;
let studyTimerDateKey = null;

function persistStudyTime() {
  localStorage.setItem(studyTimeStorageKey, JSON.stringify(studyTimeByDate));
}

function startStudyTimer() {
  if (document.hidden || document.querySelector("#studyWorkspace")?.hidden !== false) return;
  if (!studyTimerStartedAt) {
    studyTimerStartedAt = Date.now();
    studyTimerDateKey = state?.activeDate || todayKey;
  }
}

function flushStudyTimer() {
  if (!studyTimerStartedAt || !studyTimerDateKey) return;
  const elapsedSeconds = Math.max(0, (Date.now() - studyTimerStartedAt) / 1000);
  studyTimeByDate[studyTimerDateKey] = Number(studyTimeByDate[studyTimerDateKey] || 0) + elapsedSeconds;
  studyTimerStartedAt = Date.now();
  persistStudyTime();
  if (typeof renderDesignDashboard === "function") renderDesignDashboard();
  if (typeof renderDesignCalendar === "function") renderDesignCalendar();
  if (typeof renderDesignProgress === "function") renderDesignProgress();
}

function stopStudyTimer() {
  flushStudyTimer();
  studyTimerStartedAt = null;
  studyTimerDateKey = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopStudyTimer();
  else startStudyTimer();
});
window.addEventListener("beforeunload", () => {
  flushPendingAnswerSave();
  flushStudyTimer();
});
window.setInterval(() => {
  if (!document.hidden) flushStudyTimer();
}, 15000);

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const today = new Date();
const todayKey = dateKey(today);
const courseStartKey = `${storageKey}-start-date`;
const courseStartDateKey = localStorage.getItem(courseStartKey) || todayKey;
localStorage.setItem(courseStartKey, courseStartDateKey);

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayDifference(fromKey, toKey) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((dateFromKey(toKey) - dateFromKey(fromKey)) / oneDay);
}

function lessonForDate(key) {
  const day = dayDifference(courseStartDateKey, key) + 1;
  return lessons.find((lesson) => lesson.day === day) || null;
}

let activeLesson = lessonForDate(todayKey) || lessons[0];
const state = {
  current: 0,
  activeDate: todayKey,
  answers: savedAnswers[activeLesson.day] || {},
  revealed: false
};

const currentSentences = () => activeLesson.sentences;

const dayOneFocusTerms = [
  ["present reality", "affects", "availability"],
  ["most critical", "resources", "water"],
  ["past few decades", "observed", "shifts", "rainfall distribution"],
  ["prolonged droughts", "intense flooding"],
  ["disrupt", "natural cycle", "making it difficult"],
  ["natural water towers", "slowly releasing", "rivers", "streams"],
  ["due to global warming", "ice reserves", "shrinking", "alarming rate"],
  ["Higher temperatures", "rate of evaporation", "lakes", "rivers", "soil"],
  ["even if", "rainfall levels", "net water availability", "decreases"],
  ["Not only", "quantity", "but also", "quality"]
];
sentences.forEach((sentence, index) => { sentence.focusTerms = dayOneFocusTerms[index]; });

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function saveAnswers() {
  savedAnswers[activeLesson.day] = state.answers;
  localStorage.setItem(answersStorageKey, JSON.stringify(savedAnswers));
  updateCompletion();
  localStorage.setItem(storageKey, JSON.stringify(state.answers));
  $("#saveStatus").textContent = "자동 저장됨 · 방금 전";
}

function isLessonComplete() {
  return currentSentences().every((_, index) => Boolean((state.answers[index] || "").trim()));
}

function updateCompletion() {
  if (isLessonComplete()) completionByDate[state.activeDate] = true;
  else delete completionByDate[state.activeDate];
  localStorage.setItem(completionStorageKey, JSON.stringify(completionByDate));
  if ($("#calendarPanel")) renderCalendar();
  if (typeof renderDesignDashboard === "function") renderDesignDashboard();
  if (typeof renderDesignProgress === "function") renderDesignProgress();
}

function selectDate(key) {
  const lesson = lessonForDate(key);
  if (!lesson) return;
  activeLesson = lesson;
  state.activeDate = key;
  state.current = 0;
  state.revealed = false;
  state.answers = savedAnswers[lesson.day] || {};
  renderLessonHeader();
  renderOriginalReference();
  loadTtsForLesson();
  renderStudy();
  renderReading();
  renderCalendar();
  showView("study");
}

function renderCalendar() {
  if (!$("#calendarPanel")) return;
  const cursor = dateFromKey(state.activeDate);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const cells = [];

  for (let index = 0; index < firstDay; index += 1) cells.push("<span class=\"calendar-day\"></span>");
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    const lesson = lessonForDate(key);
    const isSelected = key === state.activeDate;
    const isToday = key === todayKey;
    const isComplete = Boolean(completionByDate[key]);
    const classes = ["calendar-day"];
    if (lesson) classes.push("has-lesson");
    if (isSelected) classes.push("is-selected");
    if (isToday) classes.push("is-today");
    if (isComplete) classes.push("is-complete");
    const lessonTitle = lesson ? lesson.title.replace(/<br\s*\/?>/gi, " ") : "";
    cells.push(lesson
      ? `<button class="${classes.join(" ")}" data-date="${key}" title="${lessonTitle}" aria-label="${key} · ${lessonTitle}" type="button"><span>${day}</span><span class="calendar-check">${isComplete ? "✓" : ""}</span></button>`
      : `<span class="${classes.join(" ")}"><span>${day}</span><span class="calendar-check"></span></span>`);
  }

  const selectedLesson = lessonForDate(state.activeDate);
  const selectedLabel = selectedLesson ? `${pad(selectedLesson.day)}일차 · ${selectedLesson.title.replace(/<br\s*\/?>/gi, " ")}` : "학습 없음";
  $("#calendarPanel").innerHTML = `<div class="calendar-header">
    <span class="calendar-month">${cursor.toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}</span>
    <span class="calendar-caption">${state.activeDate === todayKey ? "오늘 · " : "선택됨 · "}${selectedLabel}</span>
  </div>
  <div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
  <div class="calendar-grid">${cells.join("")}</div>`;

  $$(".calendar-day[data-date]").forEach((button) => {
    button.addEventListener("click", () => selectDate(button.dataset.date));
  });
}

function renderLessonHeader() {
  const title = activeLesson.title;
  $("#lessonDay").textContent = `${pad(activeLesson.day)}일차`;
  $("#lessonTag").textContent = activeLesson.tag;
  $("#lessonTitle").innerHTML = title;
  $("#lessonDescription").textContent = activeLesson.description;
}

const ttsAssets = {
  1: {
    audio: "../outputs/climate-change-and-water/audio.mp3",
    cues: "../outputs/climate-change-and-water/audio_cues.json"
  },
  2: { audio: "../outputs/weekly-day-2-rest/audio.mp3", cues: "../outputs/weekly-day-2-rest/audio_cues.json" },
  3: { audio: "../outputs/weekly-day-3-digital-focus/audio.mp3", cues: "../outputs/weekly-day-3-digital-focus/audio_cues.json" },
  4: { audio: "../outputs/weekly-day-4-technology-trust/audio.mp3", cues: "../outputs/weekly-day-4-technology-trust/audio_cues.json" },
  5: { audio: "../outputs/weekly-day-5-global-communication/audio.mp3", cues: "../outputs/weekly-day-5-global-communication/audio_cues.json" },
  6: { audio: "../outputs/weekly-day-6-small-habits/audio.mp3", cues: "../outputs/weekly-day-6-small-habits/audio_cues.json" },
  7: { audio: "../outputs/weekly-day-7-ideas-action/audio.mp3", cues: "../outputs/weekly-day-7-ideas-action/audio_cues.json" }
};
let ttsCues = [];

function renderOriginalReference() {
  const target = $("#originalReferenceText");
  if (!target) return;
  target.innerHTML = `<p>${escapeHtml(currentSentences().map((sentence) => sentence.text).join(" "))}</p>`;
}

function renderTtsTranscript(words, fallbackText) {
  const target = $("#ttsTranscript");
  if (!target) return;
  const transcriptWords = words.length ? words : String(fallbackText || "").match(/\S+/g)?.map((text, index) => ({ text, start: index, end: index + 1 })) || [];
  target.innerHTML = transcriptWords.length
    ? transcriptWords.map((cue, index) => `<span class="tts-word" data-cue-index="${index}" data-start="${Number(cue.start) || 0}" data-end="${Number(cue.end) || 0}">${escapeHtml(cue.text)}</span>`).join(" ")
    : `<p class="tts-empty">이 학습에는 연결된 TTS 대본이 없습니다.</p>`;
}

async function loadTtsForLesson() {
  const audio = $("#lessonAudio");
  if (!audio) return;
  const asset = ttsAssets[activeLesson.day];
  const fallbackText = currentSentences().map((sentence) => sentence.text).join(" ");
  ttsCues = [];
  if (!asset) {
    audio.removeAttribute("src");
    audio.load();
    renderTtsTranscript([], fallbackText);
    return;
  }
  audio.src = asset.audio;
  audio.load();
  try {
    const response = await fetch(asset.cues);
    if (!response.ok) throw new Error("TTS cues unavailable");
    const payload = await response.json();
    ttsCues = Array.isArray(payload.words) ? payload.words : [];
    if (payload.voice) $("#ttsVoiceLabel").textContent = payload.voice.replace("en-US-", "").replace("Neural", " Neural");
    renderTtsTranscript(ttsCues, payload.transcript || fallbackText);
  } catch (_error) {
    renderTtsTranscript([], fallbackText);
  }
}

function updateTtsHighlight() {
  const audio = $("#lessonAudio");
  if (!audio) return;
  const currentTime = audio.currentTime;
  const activeIndex = ttsCues.findIndex((cue) => currentTime >= Number(cue.start) && currentTime <= Number(cue.end));
  $$(".tts-word").forEach((word, index) => word.classList.toggle("is-active", index === activeIndex));
  const activeWord = $(".tts-word.is-active");
  if (activeWord && activeIndex >= 0) activeWord.scrollIntoView({ block: "nearest", inline: "nearest" });
}

$("#lessonAudio")?.addEventListener("timeupdate", updateTtsHighlight);

function renderNavigation() {
  const sentences = currentSentences();
  $("#sentenceNav").innerHTML = sentences.map((sentence, index) => {
    const isComplete = Boolean((state.answers[index] || "").trim());
    const indexLabel = String(index + 1).padStart(2, "0");
    const subheading = sentence.subheading || `${sentence.section} · Sentence ${indexLabel}`;
    return `<button type="button" class="${index === state.current ? "is-active " : ""}${isComplete ? "is-complete" : ""}" data-index="${index}">
      <span class="nav-index">${indexLabel}</span>
      <span class="nav-title">${escapeHtml(subheading)}</span>
      <span class="nav-check">✓</span>
    </button>`;
  }).join("");

  $$("#sentenceNav button").forEach((button) => {
    button.addEventListener("click", () => {
      state.current = Number(button.dataset.index);
      state.revealed = false;
      renderStudy();
    });
  });
}

function renderProgress() {
  const sentences = currentSentences();
  const completed = sentences.filter((_, index) => Boolean((state.answers[index] || "").trim())).length;
  const percentage = Math.round((completed / sentences.length) * 100);
  $("#progressText").textContent = `${percentage}%`;
  $("#progressBar").style.width = `${percentage}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function analyzeAnswer(sentence, answer) {
  const trimmed = answer.trim();
  if (!trimmed) {
    return {
      understood: [],
      issues: ["아직 직접 작성한 해석이 없어 비교할 수 없습니다."],
      learn: [sentence.learningNote]
    };
  }

  const normalized = trimmed.toLowerCase();
  const understood = [];
  const issues = [];
  const learn = [];

  sentence.concepts.forEach((concept) => {
    const found = concept.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
    const warning = concept.warnings.some((keyword) => normalized.includes(keyword.toLowerCase()));
    if (warning) {
      issues.push(`${concept.label}: 해석에 ‘${concept.warnings.find((keyword) => normalized.includes(keyword.toLowerCase()))}’라는 표현이 있어 의미를 다시 확인해보세요.`);
    } else if (found) {
      understood.push(`${concept.label}: 핵심 의미를 포함했습니다.`);
    } else {
      issues.push(`${concept.label}: 이 의미가 해석에 드러나지 않습니다.`);
    }
    learn.push(concept.note);
  });

  return { understood, issues, learn: [...new Set(learn)] };
}

function renderFeedback(sentence, answer) {
  const feedback = analyzeAnswer(sentence, answer);
  const list = (items, emptyMessage) => items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : `<p class="feedback-empty">${escapeHtml(emptyMessage)}</p>`;
  return `<div class="feedback-section is-good">
      <p class="feedback-heading">잘 잡은 의미</p>${list(feedback.understood, "아직 잡힌 핵심 의미가 없습니다.")}
    </div>
    <div class="feedback-section is-warning">
      <p class="feedback-heading">다시 확인할 의미</p>${list(feedback.issues, "현재 해석에서 놓친 핵심 의미가 없습니다.")}
    </div>
    <div class="feedback-section is-learn">
      <p class="feedback-heading">이 문장에서 더 알아둘 것</p>${list(feedback.learn, "추가 학습 내용이 없습니다.")}
    </div>`;
}

function renderReading() {
  const sentences = currentSentences();
  const grouped = sentences.reduce((sections, sentence, index) => {
    const current = sections[sections.length - 1];
    if (!current || current.name !== sentence.section) {
      sections.push({ name: sentence.section, items: [{ sentence, index }] });
    } else {
      current.items.push({ sentence, index });
    }
    return sections;
  }, []);

  $("#readingText").innerHTML = grouped.map((section) => `<section class="reading-section">
    <h4>${escapeHtml(section.name)}</h4>
    <p class="reading-paragraph">${section.items.map(({ sentence, index }) => `<span class="reading-sentence"><span class="reading-number">${String(index + 1).padStart(2, "0")}</span>${highlightOriginal(sentence.text, sentence.focusTerms)} </span>`).join("")}</p>
  </section>`).join("");
}

function highlightOriginal(text, terms = []) {
  if (!terms.length) return escapeHtml(text);
  const escapedTerms = terms
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");
  let result = "";
  let lastIndex = 0;
  text.replace(pattern, (match, _group, offset) => {
    result += escapeHtml(text.slice(lastIndex, offset));
    result += `<mark class="important-word">${escapeHtml(match)}</mark>`;
    lastIndex = offset + match.length;
    return match;
  });
  result += escapeHtml(text.slice(lastIndex));
  return result;
}

function renderStudy() {
  const sentences = currentSentences();
  const sentence = sentences[state.current];
  const answer = state.answers[state.current] || "";
  const indexLabel = String(state.current + 1).padStart(2, "0");
  $("#sentenceCounter").textContent = `SENTENCE ${indexLabel} / ${String(sentences.length).padStart(2, "0")}`;
  $("#sectionLabel").textContent = `${sentence.section} · SENTENCE ${indexLabel}`;
  $("#sentenceNumber").textContent = indexLabel;
  $("#originalSentence").innerHTML = highlightOriginal(sentence.text, sentence.focusTerms);
  $("#interpretationInput").value = answer;
  $("#characterCount").textContent = `${answer.length}자`;
  $("#correctTranslation").textContent = sentence.translation;
  $("#reviewFeedback").innerHTML = renderFeedback(sentence, answer);
  $("#answerPreview").hidden = !state.revealed;
  $("#revealButton").textContent = state.revealed ? "올바른 해석 숨기기" : "올바른 해석 보기";
  $("#previousButton").disabled = state.current === 0;
  $("#nextButton").textContent = state.current === sentences.length - 1 ? "Review 보기 →" : "다음 문장 →";
  const status = $("#sentenceStatus");
  status.textContent = answer.trim() ? "작성 완료" : "작성 전";
  status.classList.toggle("is-complete", Boolean(answer.trim()));
  renderNavigation();
  renderProgress();
}

function renderReview() {
  const sentences = currentSentences();
  $("#reviewList").innerHTML = sentences.map((sentence, index) => {
    const answer = (state.answers[index] || "").trim();
    return `<article class="review-item">
      <div class="review-item-header">
        <span class="review-item-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="review-item-status">${answer ? "내 해석 작성 완료" : "내 해석을 아직 작성하지 않음"}</span>
      </div>
      <div class="review-row review-original"><p class="review-row-label">원문</p><p>${highlightOriginal(sentence.text, sentence.focusTerms)}</p></div>
      <div class="review-row"><p class="review-row-label">내 해석</p><p>${escapeHtml(answer || "아직 입력하지 않았습니다.")}</p></div>
      <div class="review-row"><p class="review-row-label">올바른 해석</p><p>${escapeHtml(sentence.translation)}</p></div>
      <div class="review-row review-key"><p class="review-row-label">이 문장, 이렇게 이해했나요?</p>${renderFeedback(sentence, answer)}</div>
    </article>`;
  }).join("");
}

function showView(view) {
  const isStudy = view === "study";
  const isReading = view === "reading";
  $("#studyView").hidden = !isStudy;
  $("#readingView").hidden = !isReading;
  $("#reviewView").hidden = view !== "review";
  $$(".view-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  if (isReading) renderReading();
  if (view === "review") renderReview();
}

let saveAnswersTimer = null;

function flushPendingAnswerSave() {
  if (!saveAnswersTimer) return;
  window.clearTimeout(saveAnswersTimer);
  saveAnswersTimer = null;
  saveAnswers();
}

$("#interpretationInput").addEventListener("input", (event) => {
  const wasComplete = Boolean((state.answers[state.current] || "").trim());
  state.answers[state.current] = event.target.value;
  $("#characterCount").textContent = `${event.target.value.length}자`;
  if (wasComplete !== Boolean(event.target.value.trim())) renderNavigation();
  renderProgress();
  const status = $("#sentenceStatus");
  status.textContent = event.target.value.trim() ? "작성 완료" : "작성 전";
  status.classList.toggle("is-complete", Boolean(event.target.value.trim()));
  if (state.revealed) $("#reviewFeedback").innerHTML = renderFeedback(currentSentences()[state.current], event.target.value);
  window.clearTimeout(saveAnswersTimer);
  saveAnswersTimer = window.setTimeout(() => {
    saveAnswersTimer = null;
    saveAnswers();
  }, 250);
});

$("#interpretationInput").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey) return;
  event.preventDefault();
  state.answers[state.current] = event.currentTarget.value;
  window.clearTimeout(saveAnswersTimer);
  saveAnswersTimer = null;
  saveAnswers();
  if (state.current < currentSentences().length - 1) {
    state.current += 1;
    state.revealed = false;
    renderStudy();
    $("#interpretationInput").focus();
  } else {
    showView("review");
  }
});

$("#revealButton").addEventListener("click", () => {
  state.revealed = !state.revealed;
  $("#answerPreview").hidden = !state.revealed;
  $("#revealButton").textContent = state.revealed ? "올바른 해석 숨기기" : "올바른 해석 보기";
});

$("#previousButton").addEventListener("click", () => {
  if (state.current > 0) { state.current -= 1; state.revealed = false; renderStudy(); }
});

$("#nextButton").addEventListener("click", () => {
  if (state.current < currentSentences().length - 1) {
    state.current += 1;
    state.revealed = false;
    renderStudy();
  } else {
    showView("review");
  }
});

$("#resetButton").addEventListener("click", () => {
  if (!window.confirm("작성한 해석을 모두 지울까요?")) return;
  state.answers = {};
  state.current = 0;
  state.revealed = false;
  saveAnswers();
  renderStudy();
  showView("study");
});

$$('.view-tab').forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));

renderStudy();
renderReading();
renderLessonHeader();
renderOriginalReference();
loadTtsForLesson();
renderCalendar();


/* Figma screen navigation layered onto the original study application. */
const designPanels = [...document.querySelectorAll("[data-design-panel]")];
const designNavItems = [...document.querySelectorAll("[data-design-screen]")];
const designWorkspace = document.querySelector("#designWorkspace");
const studyWorkspace = document.querySelector("#studyWorkspace");
const designToast = document.querySelector("#saveStatus");
document.querySelector(".design-activity-card")?.remove();

function openDesignScreen(name) {
  const panel = document.querySelector("[data-design-panel=\"" + name + "\"]");
  if (!panel) {
    if (designToast) designToast.textContent = "This learning view is coming soon.";
    return;
  }
  stopStudyTimer();
  if (studyWorkspace) studyWorkspace.hidden = true;
  designWorkspace.hidden = false;
  designPanels.forEach((item) => item.classList.toggle("is-visible", item === panel));
  designNavItems.forEach((item) => item.classList.toggle("is-active", item.dataset.designScreen === name));
  if (name === "progress") renderDesignProgress();
  window.location.hash = name;
}

function returnToStudy() {
  designWorkspace.hidden = true;
  if (studyWorkspace) studyWorkspace.hidden = false;
  startStudyTimer();
  designNavItems.forEach((item) => item.classList.remove("is-active"));
  window.location.hash = "study";
}

designNavItems.forEach((item) => item.addEventListener("click", () => {
  const name = item.dataset.designScreen;
  if (name === "study") returnToStudy();
  else openDesignScreen(name);
}));
document.querySelector("#designStartStudy")?.addEventListener("click", () => {
  const recommendedDay = Number(document.querySelector("#designStartStudy")?.dataset.lessonDay || activeLesson.day);
  openDesignLesson(recommendedDay);
});
document.querySelector(".design-brand")?.addEventListener("click", (event) => {
  event.preventDefault();
  openDesignScreen("dashboard");
});
document.querySelector(".brand-mark")?.addEventListener("click", (event) => {
  event.preventDefault();
  openDesignScreen("dashboard");
});

const designCalendarGrid = document.querySelector("#designCalendarGrid");
const designCalendarTitle = document.querySelector("#designCalendarTitle");
const designCalendarSelectedLabel = document.querySelector("#designCalendarSelectedLabel");
const designCalendarCompletedLessons = document.querySelector("#designCalendarCompletedLessons");
const designCalendarCursor = dateFromKey(todayKey);
designCalendarCursor.setDate(1);
let designCalendarSelectedDate = todayKey;

function renderDesignCalendar() {
  if (!designCalendarGrid) return;
  const year = designCalendarCursor.getFullYear();
  const month = designCalendarCursor.getMonth();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  if (designCalendarTitle) designCalendarTitle.textContent = designCalendarCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = [];
  for (let index = 0; index < firstDayOffset; index += 1) cells.push("<span class=\"design-calendar-day muted\"></span>");
  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(year, month, day);
    const key = dateKey(currentDate);
    const lesson = lessonForDate(key);
    const lessonStats = lesson ? getDesignLessonStats(lesson) : null;
    const minutes = Math.round(Number(studyTimeByDate[key] || 0) / 60);
    const selected = key === designCalendarSelectedDate;
    const today = key === todayKey;
    const score = lessonStats?.answered ? `${lessonStats.percent}%` : (minutes ? `${minutes}m` : "");
    cells.push(`<button class="design-calendar-day${lesson ? " has-lesson" : ""}${selected ? " selected" : ""}${today ? " today" : ""}" type="button" data-design-date="${key}"><span class="design-calendar-number">${day}</span>${score ? `<span class="design-calendar-score">${score}</span>` : ""}</button>`);
  }
  designCalendarGrid.innerHTML = cells.join("");
  designCalendarGrid.querySelectorAll("[data-design-date]").forEach((day) => day.addEventListener("click", () => {
    designCalendarSelectedDate = day.dataset.designDate;
    renderDesignCalendar();
  }));
  const selectedKey = designCalendarSelectedDate;
  const selectedLesson = lessonForDate(selectedKey);
  const selectedStats = selectedLesson ? getDesignLessonStats(selectedLesson) : { answered: 0, accuracy: 0 };
  if (designCalendarSelectedLabel) designCalendarSelectedLabel.textContent = new Date(`${selectedKey}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (designCalendarCompletedLessons) {
    designCalendarCompletedLessons.innerHTML = selectedLesson && selectedStats.percent === 100
      ? `<li>${escapeHtml(getDesignLessonTitle(selectedLesson))}</li>`
      : "<li>No completed lesson</li>";
  }
  const detailSentences = document.querySelector("#designCalendarDetailSentences");
  const detailAccuracy = document.querySelector("#designCalendarDetailAccuracy");
  const detailTime = document.querySelector("#designCalendarDetailTime");
  if (detailSentences) detailSentences.textContent = `${selectedStats.answered} sentences`;
  if (detailAccuracy) detailAccuracy.textContent = `${selectedStats.accuracy || 0}%`;
  if (detailTime) detailTime.textContent = `${Math.round(Number(studyTimeByDate[selectedKey] || 0) / 60)} min`;
  renderDesignCalendarSummary();
}
document.querySelector("#designPreviousMonth")?.addEventListener("click", () => { designCalendarCursor.setMonth(designCalendarCursor.getMonth() - 1); renderDesignCalendar(); });
document.querySelector("#designNextMonth")?.addEventListener("click", () => { designCalendarCursor.setMonth(designCalendarCursor.getMonth() + 1); renderDesignCalendar(); });

function renderDesignCalendarSummary() {
  const year = designCalendarCursor.getFullYear();
  const month = designCalendarCursor.getMonth();
  const monthKeys = Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, index) => dateKey(new Date(year, month, index + 1)));
  const activeDays = monthKeys.filter((key) => Number(studyTimeByDate[key] || 0) > 0 || completionByDate[key]);
  const monthLessons = monthKeys.map((key) => lessonForDate(key)).filter(Boolean);
  const monthStats = monthLessons.map((lesson) => getDesignLessonStats(lesson));
  const totalAnswered = monthStats.reduce((sum, stats) => sum + stats.answered, 0);
  const accuracySamples = monthStats.filter((stats) => stats.answered > 0);
  const averageAccuracy = accuracySamples.length ? Math.round(accuracySamples.reduce((sum, stats) => sum + stats.accuracy, 0) / accuracySamples.length) : 0;
  const studyDays = document.querySelector("#designCalendarStudyDays");
  const sentences = document.querySelector("#designCalendarSentences");
  const accuracy = document.querySelector("#designCalendarAccuracy");
  if (studyDays) studyDays.textContent = `${activeDays.length} active days`;
  if (sentences) sentences.textContent = String(totalAnswered);
  if (accuracy) accuracy.textContent = `${averageAccuracy}%`;
}
renderDesignCalendar();

function renderDesignAccuracyChart() {
  const chart = document.querySelector("#designAccuracyChart");
  if (!chart) return;
  const layer = chart.querySelector(".design-chart-segments");
  if (!layer) return;
  layer.innerHTML = "";
  const points = getDesignAccuracySeries();
  points.slice(0,-1).forEach((point, index) => {
    const next = points[index + 1];
    const x = index * (100 / (points.length - 1));
    const nextX = (index + 1) * (100 / (points.length - 1));
    const dx = ((nextX - x) / 100) * chart.clientWidth;
    const dy = next - point;
    const segment = document.createElement("span");
    segment.className = "design-chart-segment";
    segment.style.left = x + "%";
    segment.style.top = point + "%";
    segment.style.width = Math.sqrt(dx * dx + dy * dy) + "px";
    segment.style.transform = "rotate(" + (Math.atan2(dy, dx) * (180 / Math.PI)) + "deg)";
    layer.appendChild(segment);
  });
}
function getDesignLessonStats(lesson) {
  const answers = lesson.day === activeLesson.day ? state.answers : (savedAnswers[lesson.day] || {});
  const answered = lesson.sentences.filter((_, index) => Boolean((answers[index] || "").trim())).length;
  let understood = 0;
  let conceptCount = 0;
  lesson.sentences.forEach((sentence, index) => {
    const answer = (answers[index] || "").trim();
    if (!answer) return;
    const feedback = analyzeAnswer(sentence, answer);
    understood += feedback.understood.length;
    conceptCount += sentence.concepts.length;
  });
  return {
    answered,
    total: lesson.sentences.length,
    percent: lesson.sentences.length ? Math.round((answered / lesson.sentences.length) * 100) : 0,
    accuracy: conceptCount ? Math.round((understood / conceptCount) * 100) : 0
  };
}

function getDesignProgressSummary() {
  const stats = lessons.map((lesson) => getDesignLessonStats(lesson));
  const answered = stats.reduce((sum, item) => sum + item.answered, 0);
  const available = stats.reduce((sum, item) => sum + item.total, 0);
  const accuracySamples = stats.filter((item) => item.answered > 0);
  const accuracy = accuracySamples.length ? Math.round(accuracySamples.reduce((sum, item) => sum + item.accuracy, 0) / accuracySamples.length) : 0;
  const seconds = Object.values(studyTimeByDate).reduce((sum, value) => sum + Number(value || 0), 0);
  return {
    stats,
    answered,
    available,
    accuracy,
    completedLessons: stats.filter((item) => item.percent === 100).length,
    streak: Object.keys(completionByDate).length,
    minutes: Math.round(seconds / 60)
  };
}

function getDesignAccuracySeries() {
  const series = [];
  for (let offset = 29; offset >= 0; offset -= 1) {
    const day = dateFromKey(todayKey);
    day.setDate(day.getDate() - offset);
    const lesson = lessonForDate(dateKey(day));
    const lessonStats = lesson ? getDesignLessonStats(lesson) : null;
    series.push(lessonStats?.answered ? 100 - lessonStats.accuracy : 84);
  }
  return series;
}

function getDesignMilestoneData(summary) {
  return [
    ["First Step", "Answer your first sentence", summary.answered >= 1],
    ["Lesson Complete", "Finish one full lesson", summary.completedLessons >= 1],
    ["Ten Sentences", "Study ten sentences", summary.answered >= 10],
    ["Three-Day Streak", "Complete three study days", summary.streak >= 3],
    ["Focused 30", "Study for thirty minutes", summary.minutes >= 30],
    ["Week Explorer", "Complete all seven lessons", summary.completedLessons >= 7]
  ];
}

function renderDesignMilestones(target, summary, compact = false) {
  if (!target) return;
  target.innerHTML = getDesignMilestoneData(summary).map(([title, description, earned]) => `<div class="design-milestone-item ${earned ? "is-earned" : "is-locked"}"><span class="design-milestone ${earned ? "mint" : "locked"}">${earned ? "✓" : "·"}</span><b>${title}</b><small>${earned ? "Earned" : description}</small></div>`).join("");
  if (compact) target.classList.add("is-compact");
}

function renderDesignProgress() {
  const summary = getDesignProgressSummary();
  const total = document.querySelector("#designProgressTotal");
  const totalNote = document.querySelector("#designProgressTotalNote");
  const accuracy = document.querySelector("#designProgressAccuracy");
  const accuracyNote = document.querySelector("#designProgressAccuracyNote");
  const streak = document.querySelector("#designProgressStreak");
  const streakNote = document.querySelector("#designProgressStreakNote");
  const time = document.querySelector("#designProgressTime");
  const timeNote = document.querySelector("#designProgressTimeNote");
  if (total) total.textContent = String(summary.answered);
  if (totalNote) totalNote.textContent = `${summary.answered} / ${summary.available} studied`;
  if (accuracy) accuracy.textContent = `${summary.accuracy}%`;
  if (accuracyNote) accuracyNote.textContent = summary.answered ? "Based on your answer analysis" : "Answer a sentence to begin";
  if (streak) streak.textContent = `${summary.streak} Days`;
  if (streakNote) streakNote.textContent = `${summary.completedLessons} lessons completed`;
  if (time) time.textContent = `${summary.minutes} min`;
  if (timeNote) timeNote.textContent = "Active Study time";

  const dailyBars = document.querySelector("#designDailyBars");
  if (dailyBars) {
    const values = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = dateFromKey(todayKey);
      day.setDate(day.getDate() - offset);
      const lesson = lessonForDate(dateKey(day));
      const value = lesson ? getDesignLessonStats(lesson).answered : 0;
      values.push({ label: day.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1), value });
    }
    const max = Math.max(1, ...values.map((item) => item.value));
    dailyBars.innerHTML = values.map((item) => `<div style="--h:${item.value ? Math.max(8, Math.round((item.value / max) * 100)) : 3}%"><i></i><span>${item.label}</span></div>`).join("");
  }

  const weakList = document.querySelector("#designWeakList");
  if (weakList) {
    const missed = new Map();
    lessons.forEach((lesson) => {
      const answers = lesson.day === activeLesson.day ? state.answers : (savedAnswers[lesson.day] || {});
      lesson.sentences.forEach((sentence, index) => {
        const answer = (answers[index] || "").trim();
        if (!answer) return;
        const feedback = analyzeAnswer(sentence, answer);
        feedback.issues.forEach((issue) => missed.set(issue, (missed.get(issue) || 0) + 1));
      });
    });
    const weakItems = [...missed.entries()].sort((left, right) => right[1] - left[1]).slice(0, 3);
    weakList.innerHTML = weakItems.length
      ? weakItems.map(([label, count]) => `<div class="design-weak-item"><div><strong>${escapeHtml(label)}</strong><span>Review this structure in Study</span></div><b>Missed ${count} time${count === 1 ? "" : "s"}</b></div>`).join("")
      : `<p class="design-progress-empty">No missed areas yet. Complete a sentence to generate feedback.</p>`;
  }

  const milestones = document.querySelector("#designMilestones");
  renderDesignMilestones(milestones, summary);
  renderDesignAccuracyChart();
}

function getDesignLessonTitle(lesson) {
  return lesson.title.replace(/<br\s*\/?\s*>/gi, " ").replace(/\s+/g, " ").trim();
}

function openDesignLesson(day) {
  const lesson = lessons.find((item) => item.day === day);
  if (!lesson) return;
  activeLesson = lesson;
  const lessonDate = dateFromKey(courseStartDateKey);
  lessonDate.setDate(lessonDate.getDate() + lesson.day - 1);
  state.activeDate = dateKey(lessonDate);
  state.current = 0;
  state.revealed = false;
  state.answers = savedAnswers[lesson.day] || {};
  renderLessonHeader();
  renderStudy();
  renderReading();
  renderOriginalReference();
  loadTtsForLesson();
  returnToStudy();
}

function renderDesignDashboard() {
  const orderedLessons = [...lessons].sort((left, right) => left.day - right.day);
  const progressSummary = getDesignProgressSummary();
  const recommended = orderedLessons.find((lesson) => getDesignLessonStats(lesson).percent < 100) || orderedLessons[0];
  const stats = orderedLessons.map((lesson) => getDesignLessonStats(lesson));
  const totalSentences = stats.reduce((sum, item) => sum + item.answered, 0);
  const totalAvailable = stats.reduce((sum, item) => sum + item.total, 0);
  const completedLessons = stats.filter((item) => item.percent === 100).length;
  const averageProgress = totalAvailable ? Math.round((totalSentences / totalAvailable) * 100) : 0;

  const dailyStreak = document.querySelector("#designDailyStreak");
  const sentencesStudied = document.querySelector("#designSentencesStudied");
  const accuracy = document.querySelector("#designAccuracy");
  if (dailyStreak) dailyStreak.textContent = `${Object.keys(completionByDate).length} Days`;
  if (sentencesStudied) sentencesStudied.textContent = `${totalSentences} Sentences`;
  if (accuracy) accuracy.textContent = `${averageProgress}% Average`;
  renderDesignMilestones(document.querySelector("#designDashboardMilestones"), progressSummary, true);

  if (recommended) {
    const recommendedStats = getDesignLessonStats(recommended);
    const recommendationLabel = document.querySelector(".design-recommended-card .design-card-eyebrow");
    const title = document.querySelector("#designRecommendedTitle");
    const description = document.querySelector("#designRecommendedDescription");
    const level = document.querySelector("#designRecommendedLevel");
    const sentenceCount = document.querySelector("#designRecommendedSentences");
    const sessionTime = document.querySelector("#designRecommendedTime");
    const startButton = document.querySelector("#designStartStudy");
    if (recommendationLabel) recommendationLabel.textContent = "TODAY'S STUDY";
    if (title) title.textContent = getDesignLessonTitle(recommended);
    if (description) description.textContent = recommended.description;
    if (level) level.textContent = recommendedStats.answered ? "In progress" : `Lesson ${recommended.day}`;
    if (sentenceCount) sentenceCount.textContent = `${recommendedStats.total} sentences · ${recommendedStats.percent}% complete`;
    if (sessionTime) sessionTime.textContent = `~${Math.max(10, recommendedStats.total * 2)} min session`;
    if (startButton) startButton.dataset.lessonDay = String(recommended.day);
  }

  const weeklyChart = document.querySelector("#designWeeklyChart");
  if (weeklyChart) {
    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    weeklyChart.innerHTML = labels.map((label, index) => {
      const chartDate = dateFromKey(todayKey);
      chartDate.setDate(chartDate.getDate() - (6 - index));
      const minutes = Math.round(Number(studyTimeByDate[dateKey(chartDate)] || 0) / 60);
      const height = minutes ? Math.max(8, Math.round((minutes / 20) * 100)) : 3;
      const todayClass = dateKey(chartDate) === todayKey ? "today" : "";
      return `<div class="${todayClass.trim()}" style="--h:${height}%" title="${minutes} minutes"><i></i><span>${label}</span></div>`;
    }).join("");
  }

  const topicList = document.querySelector("#designTopicList");
  if (topicList) {
    topicList.innerHTML = orderedLessons.map((lesson) => {
      const lessonStats = getDesignLessonStats(lesson);
      const isCurrent = lesson.day === activeLesson.day;
      return `<button class="design-topic-item${isCurrent ? " is-current" : ""}" type="button" data-lesson-day="${lesson.day}"><span class="design-topic-day">DAY ${lesson.day}</span><strong>${escapeHtml(getDesignLessonTitle(lesson))}</strong><span class="design-topic-progress">${lessonStats.percent}% complete</span></button>`;
    }).join("");
    topicList.querySelectorAll("[data-lesson-day]").forEach((item) => item.addEventListener("click", () => openDesignLesson(Number(item.dataset.lessonDay))));
  }

  const activityList = document.querySelector(".design-activity-list");
  if (activityList) {
    activityList.innerHTML = [...orderedLessons].reverse().map((lesson) => {
      const lessonStats = getDesignLessonStats(lesson);
      const status = lessonStats.percent === 100 ? "Completed" : lessonStats.answered ? `In progress · ${lessonStats.answered}/${lessonStats.total} sentences` : "Not started";
      return `<button class="design-activity-item" type="button" data-lesson-day="${lesson.day}"><div><strong>${escapeHtml(getDesignLessonTitle(lesson))}</strong><small>${escapeHtml(status)}</small></div><b>${lessonStats.percent}%</b><div class="design-mini-progress"><i style="width:${lessonStats.percent}%"></i><span>${lessonStats.percent}%</span></div></button>`;
    }).join("");
    activityList.querySelectorAll("[data-lesson-day]").forEach((item) => item.addEventListener("click", () => openDesignLesson(Number(item.dataset.lessonDay))));
  }
}

const designInitialScreen = window.location.hash.slice(1);
if (designInitialScreen === "study") returnToStudy();
else if (["dashboard", "calendar", "progress"].includes(designInitialScreen)) openDesignScreen(designInitialScreen);
else openDesignScreen("dashboard");
renderDesignDashboard();
renderDesignProgress();
