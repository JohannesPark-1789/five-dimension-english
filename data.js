/* =====================================================================
   5차원 영어 · BASIC DRILL
   data.js — 학습 데이터 + 카드 자동 생성 엔진

   원동연 박사 5차원영어학습법의 BASIC DRILL 원리를 코드로 옮긴 것.
   하나의 동사를 11가지 시제·조동사 형태로 변형하고,
   거기에 5개 의문사(What/Where/How/Why/When)를 결합한다.
   동사를 추가할수록 연습량이 무한히 늘어난다.
   ===================================================================== */

/* --- 11가지 시제·조동사 형태 --------------------------------------- */
/* en(verb)  -> 영어 의문문 (의문사 없는 기본형)
   ko(verb)  -> 한국어 의문문 (의문사 없는 기본형)               */
const FORMS = [
  { id: 'present',    label: '현재',          group: '기본 시제',
    en: v => `Do you ${v.base}?`,          ko: v => v.ko.present },
  { id: 'continuous', label: '현재진행',      group: '기본 시제',
    en: v => `Are you ${v.ing}?`,          ko: v => v.ko.continuous },
  { id: 'past',       label: '과거',          group: '기본 시제',
    en: v => `Did you ${v.base}?`,         ko: v => v.ko.past },
  { id: 'future',     label: '미래 (will)',   group: '미래·가능',
    en: v => `Will you ${v.base}?`,        ko: v => v.ko.future },
  { id: 'can',        label: '가능 (can)',    group: '미래·가능',
    en: v => `Can you ${v.base}?`,         ko: v => v.ko.can },
  { id: 'haveTo',     label: '의무 (have to)', group: '의무·소망·취향',
    en: v => `Do you have to ${v.base}?`,  ko: v => v.ko.haveTo },
  { id: 'hadTo',      label: '과거 의무',     group: '의무·소망·취향',
    en: v => `Did you have to ${v.base}?`, ko: v => v.ko.hadTo },
  { id: 'wantTo',     label: '소망 (want to)', group: '의무·소망·취향',
    en: v => `Do you want to ${v.base}?`,  ko: v => v.ko.wantTo },
  { id: 'wantedTo',   label: '과거 소망',     group: '의무·소망·취향',
    en: v => `Did you want to ${v.base}?`, ko: v => v.ko.wantedTo },
  { id: 'enjoy',      label: '취향 (enjoy)',  group: '의무·소망·취향',
    en: v => `Do you enjoy ${v.ing}?`,     ko: v => v.ko.enjoy },
  { id: 'enjoyed',    label: '과거 취향',     group: '의무·소망·취향',
    en: v => `Did you enjoy ${v.ing}?`,    ko: v => v.ko.enjoyed },
];

/* --- 의문사 (없음 + 5개) ------------------------------------------- */
const QWORDS = [
  { id: 'none',  en: '',      ko: '' },
  { id: 'what',  en: 'What',  ko: '뭘 ' },
  { id: 'where', en: 'Where', ko: '어디서 ' },
  { id: 'how',   en: 'How',   ko: '어떻게 ' },
  { id: 'why',   en: 'Why',   ko: '왜 ' },
  { id: 'when',  en: 'When',  ko: '언제 ' },
];

/* --- 동사 사전 ------------------------------------------------------ */
/* base : 동사원형, ing : 진행형
   ko   : 11개 한국어 변형 (의문사 없는 기본형, "(너)" 주어 생략)     */
const VERBS = [
  {
    id: 'buy', base: 'buy', ing: 'buying', emoji: '🛒', meaning: '사다',
    ko: {
      present: '사니?', continuous: '사고 있니?', past: '샀니?',
      future: '살 거니?', can: '살 수 있니?',
      haveTo: '사야 하니?', hadTo: '사야 했니?',
      wantTo: '사고 싶니?', wantedTo: '사고 싶었니?',
      enjoy: '사는 걸 즐기니?', enjoyed: '사는 걸 즐겼니?',
    },
  },
  {
    id: 'eat', base: 'eat', ing: 'eating', emoji: '🍽️', meaning: '먹다',
    ko: {
      present: '먹니?', continuous: '먹고 있니?', past: '먹었니?',
      future: '먹을 거니?', can: '먹을 수 있니?',
      haveTo: '먹어야 하니?', hadTo: '먹어야 했니?',
      wantTo: '먹고 싶니?', wantedTo: '먹고 싶었니?',
      enjoy: '먹는 걸 즐기니?', enjoyed: '먹는 걸 즐겼니?',
    },
  },
  {
    id: 'meet', base: 'meet', ing: 'meeting', emoji: '🤝', meaning: '만나다',
    ko: {
      present: '만나니?', continuous: '만나고 있니?', past: '만났니?',
      future: '만날 거니?', can: '만날 수 있니?',
      haveTo: '만나야 하니?', hadTo: '만나야 했니?',
      wantTo: '만나고 싶니?', wantedTo: '만나고 싶었니?',
      enjoy: '만나는 걸 즐기니?', enjoyed: '만나는 걸 즐겼니?',
    },
  },
  {
    id: 'read', base: 'read', ing: 'reading', emoji: '📖', meaning: '읽다',
    ko: {
      present: '읽니?', continuous: '읽고 있니?', past: '읽었니?',
      future: '읽을 거니?', can: '읽을 수 있니?',
      haveTo: '읽어야 하니?', hadTo: '읽어야 했니?',
      wantTo: '읽고 싶니?', wantedTo: '읽고 싶었니?',
      enjoy: '읽는 걸 즐기니?', enjoyed: '읽는 걸 즐겼니?',
    },
  },
  {
    id: 'write', base: 'write', ing: 'writing', emoji: '✏️', meaning: '쓰다',
    ko: {
      present: '쓰니?', continuous: '쓰고 있니?', past: '썼니?',
      future: '쓸 거니?', can: '쓸 수 있니?',
      haveTo: '써야 하니?', hadTo: '써야 했니?',
      wantTo: '쓰고 싶니?', wantedTo: '쓰고 싶었니?',
      enjoy: '쓰는 걸 즐기니?', enjoyed: '쓰는 걸 즐겼니?',
    },
  },
  {
    id: 'make', base: 'make', ing: 'making', emoji: '🔨', meaning: '만들다',
    ko: {
      present: '만드니?', continuous: '만들고 있니?', past: '만들었니?',
      future: '만들 거니?', can: '만들 수 있니?',
      haveTo: '만들어야 하니?', hadTo: '만들어야 했니?',
      wantTo: '만들고 싶니?', wantedTo: '만들고 싶었니?',
      enjoy: '만드는 걸 즐기니?', enjoyed: '만드는 걸 즐겼니?',
    },
  },
  {
    id: 'study', base: 'study', ing: 'studying', emoji: '📚', meaning: '공부하다',
    ko: {
      present: '공부하니?', continuous: '공부하고 있니?', past: '공부했니?',
      future: '공부할 거니?', can: '공부할 수 있니?',
      haveTo: '공부해야 하니?', hadTo: '공부해야 했니?',
      wantTo: '공부하고 싶니?', wantedTo: '공부하고 싶었니?',
      enjoy: '공부하는 걸 즐기니?', enjoyed: '공부하는 걸 즐겼니?',
    },
  },
  {
    id: 'drink', base: 'drink', ing: 'drinking', emoji: '🥤', meaning: '마시다',
    ko: {
      present: '마시니?', continuous: '마시고 있니?', past: '마셨니?',
      future: '마실 거니?', can: '마실 수 있니?',
      haveTo: '마셔야 하니?', hadTo: '마셔야 했니?',
      wantTo: '마시고 싶니?', wantedTo: '마시고 싶었니?',
      enjoy: '마시는 걸 즐기니?', enjoyed: '마시는 걸 즐겼니?',
    },
  },
  {
    id: 'learn', base: 'learn', ing: 'learning', emoji: '🎓', meaning: '배우다',
    ko: {
      present: '배우니?', continuous: '배우고 있니?', past: '배웠니?',
      future: '배울 거니?', can: '배울 수 있니?',
      haveTo: '배워야 하니?', hadTo: '배워야 했니?',
      wantTo: '배우고 싶니?', wantedTo: '배우고 싶었니?',
      enjoy: '배우는 걸 즐기니?', enjoyed: '배우는 걸 즐겼니?',
    },
  },
  {
    id: 'play', base: 'play', ing: 'playing', emoji: '⚽', meaning: '놀다',
    ko: {
      present: '노니?', continuous: '놀고 있니?', past: '놀았니?',
      future: '놀 거니?', can: '놀 수 있니?',
      haveTo: '놀아야 하니?', hadTo: '놀아야 했니?',
      wantTo: '놀고 싶니?', wantedTo: '놀고 싶었니?',
      enjoy: '노는 걸 즐기니?', enjoyed: '노는 걸 즐겼니?',
    },
  },
  {
    id: 'go', base: 'go', ing: 'going', emoji: '🚶', meaning: '가다',
    ko: {
      present: '가니?', continuous: '가고 있니?', past: '갔니?',
      future: '갈 거니?', can: '갈 수 있니?',
      haveTo: '가야 하니?', hadTo: '가야 했니?',
      wantTo: '가고 싶니?', wantedTo: '가고 싶었니?',
      enjoy: '가는 걸 즐기니?', enjoyed: '가는 걸 즐겼니?',
    },
  },
  {
    id: 'come', base: 'come', ing: 'coming', emoji: '👋', meaning: '오다',
    ko: {
      present: '오니?', continuous: '오고 있니?', past: '왔니?',
      future: '올 거니?', can: '올 수 있니?',
      haveTo: '와야 하니?', hadTo: '와야 했니?',
      wantTo: '오고 싶니?', wantedTo: '오고 싶었니?',
      enjoy: '오는 걸 즐기니?', enjoyed: '오는 걸 즐겼니?',
    },
  },
  {
    id: 'walk', base: 'walk', ing: 'walking', emoji: '🚶‍♂️', meaning: '걷다',
    ko: {
      present: '걷니?', continuous: '걷고 있니?', past: '걸었니?',
      future: '걸을 거니?', can: '걸을 수 있니?',
      haveTo: '걸어야 하니?', hadTo: '걸어야 했니?',
      wantTo: '걷고 싶니?', wantedTo: '걷고 싶었니?',
      enjoy: '걷는 걸 즐기니?', enjoyed: '걷는 걸 즐겼니?',
    },
  },
  {
    id: 'run', base: 'run', ing: 'running', emoji: '🏃', meaning: '달리다',
    ko: {
      present: '달리니?', continuous: '달리고 있니?', past: '달렸니?',
      future: '달릴 거니?', can: '달릴 수 있니?',
      haveTo: '달려야 하니?', hadTo: '달려야 했니?',
      wantTo: '달리고 싶니?', wantedTo: '달리고 싶었니?',
      enjoy: '달리는 걸 즐기니?', enjoyed: '달리는 걸 즐겼니?',
    },
  },
  {
    id: 'cook', base: 'cook', ing: 'cooking', emoji: '🍳', meaning: '요리하다',
    ko: {
      present: '요리하니?', continuous: '요리하고 있니?', past: '요리했니?',
      future: '요리할 거니?', can: '요리할 수 있니?',
      haveTo: '요리해야 하니?', hadTo: '요리해야 했니?',
      wantTo: '요리하고 싶니?', wantedTo: '요리하고 싶었니?',
      enjoy: '요리하는 걸 즐기니?', enjoyed: '요리하는 걸 즐겼니?',
    },
  },
  {
    id: 'clean', base: 'clean', ing: 'cleaning', emoji: '🧹', meaning: '청소하다',
    ko: {
      present: '청소하니?', continuous: '청소하고 있니?', past: '청소했니?',
      future: '청소할 거니?', can: '청소할 수 있니?',
      haveTo: '청소해야 하니?', hadTo: '청소해야 했니?',
      wantTo: '청소하고 싶니?', wantedTo: '청소하고 싶었니?',
      enjoy: '청소하는 걸 즐기니?', enjoyed: '청소하는 걸 즐겼니?',
    },
  },
  {
    id: 'open', base: 'open', ing: 'opening', emoji: '🚪', meaning: '열다',
    ko: {
      present: '여니?', continuous: '열고 있니?', past: '열었니?',
      future: '열 거니?', can: '열 수 있니?',
      haveTo: '열어야 하니?', hadTo: '열어야 했니?',
      wantTo: '열고 싶니?', wantedTo: '열고 싶었니?',
      enjoy: '여는 걸 즐기니?', enjoyed: '여는 걸 즐겼니?',
    },
  },
  {
    id: 'close', base: 'close', ing: 'closing', emoji: '🔒', meaning: '닫다',
    ko: {
      present: '닫니?', continuous: '닫고 있니?', past: '닫았니?',
      future: '닫을 거니?', can: '닫을 수 있니?',
      haveTo: '닫아야 하니?', hadTo: '닫아야 했니?',
      wantTo: '닫고 싶니?', wantedTo: '닫고 싶었니?',
      enjoy: '닫는 걸 즐기니?', enjoyed: '닫는 걸 즐겼니?',
    },
  },
  {
    id: 'send', base: 'send', ing: 'sending', emoji: '📮', meaning: '보내다',
    ko: {
      present: '보내니?', continuous: '보내고 있니?', past: '보냈니?',
      future: '보낼 거니?', can: '보낼 수 있니?',
      haveTo: '보내야 하니?', hadTo: '보내야 했니?',
      wantTo: '보내고 싶니?', wantedTo: '보내고 싶었니?',
      enjoy: '보내는 걸 즐기니?', enjoyed: '보내는 걸 즐겼니?',
    },
  },
  {
    id: 'teach', base: 'teach', ing: 'teaching', emoji: '🧑‍🏫', meaning: '가르치다',
    ko: {
      present: '가르치니?', continuous: '가르치고 있니?', past: '가르쳤니?',
      future: '가르칠 거니?', can: '가르칠 수 있니?',
      haveTo: '가르쳐야 하니?', hadTo: '가르쳐야 했니?',
      wantTo: '가르치고 싶니?', wantedTo: '가르치고 싶었니?',
      enjoy: '가르치는 걸 즐기니?', enjoyed: '가르치는 걸 즐겼니?',
    },
  },
  {
    id: 'call', base: 'call', ing: 'calling', emoji: '📞', meaning: '전화하다',
    ko: {
      present: '전화하니?', continuous: '전화하고 있니?', past: '전화했니?',
      future: '전화할 거니?', can: '전화할 수 있니?',
      haveTo: '전화해야 하니?', hadTo: '전화해야 했니?',
      wantTo: '전화하고 싶니?', wantedTo: '전화하고 싶었니?',
      enjoy: '전화하는 걸 즐기니?', enjoyed: '전화하는 걸 즐겼니?',
    },
  },
  {
    id: 'sing', base: 'sing', ing: 'singing', emoji: '🎤', meaning: '노래하다',
    ko: {
      present: '노래하니?', continuous: '노래하고 있니?', past: '노래했니?',
      future: '노래할 거니?', can: '노래할 수 있니?',
      haveTo: '노래해야 하니?', hadTo: '노래해야 했니?',
      wantTo: '노래하고 싶니?', wantedTo: '노래하고 싶었니?',
      enjoy: '노래하는 걸 즐기니?', enjoyed: '노래하는 걸 즐겼니?',
    },
  },
  {
    id: 'swim', base: 'swim', ing: 'swimming', emoji: '🏊', meaning: '수영하다',
    ko: {
      present: '수영하니?', continuous: '수영하고 있니?', past: '수영했니?',
      future: '수영할 거니?', can: '수영할 수 있니?',
      haveTo: '수영해야 하니?', hadTo: '수영해야 했니?',
      wantTo: '수영하고 싶니?', wantedTo: '수영하고 싶었니?',
      enjoy: '수영하는 걸 즐기니?', enjoyed: '수영하는 걸 즐겼니?',
    },
  },
  {
    id: 'drive', base: 'drive', ing: 'driving', emoji: '🚗', meaning: '운전하다',
    ko: {
      present: '운전하니?', continuous: '운전하고 있니?', past: '운전했니?',
      future: '운전할 거니?', can: '운전할 수 있니?',
      haveTo: '운전해야 하니?', hadTo: '운전해야 했니?',
      wantTo: '운전하고 싶니?', wantedTo: '운전하고 싶었니?',
      enjoy: '운전하는 걸 즐기니?', enjoyed: '운전하는 걸 즐겼니?',
    },
  },
];

/* --- 7단계 정의 ----------------------------------------------------- */
/* 1~6단계 : 의문사별 11문장,  7단계 : 전체 66문장 종합              */
const STEPS = [
  { title: '기본 의문문',  sub: '의문사 없이 11가지 시제·조동사', qword: 'none'  },
  { title: 'What 의문문',  sub: '무엇을 ~?',                     qword: 'what'  },
  { title: 'Where 의문문', sub: '어디서 ~?',                     qword: 'where' },
  { title: 'How 의문문',   sub: '어떻게 ~?',                     qword: 'how'   },
  { title: 'Why 의문문',   sub: '왜 ~?',                         qword: 'why'   },
  { title: 'When 의문문',  sub: '언제 ~?',                       qword: 'when'  },
  { title: '종합 드릴',    sub: '전체 66문장 섞어서',            qword: '__all__' },
];

/* --- 카드 생성 ------------------------------------------------------ */
function makeCard(verb, form, qword) {
  const baseEn = form.en(verb);            // 예: "Do you buy?"
  let en;
  if (qword.id === 'none') {
    en = baseEn;
  } else {
    // 의문사를 앞에 붙이고 첫 글자를 소문자로: "What" + "do you buy?"
    en = qword.en + ' ' + baseEn.charAt(0).toLowerCase() + baseEn.slice(1);
  }
  return {
    ko: qword.ko + form.ko(verb),          // 예: "뭘 사니?"
    en: en,                                // 예: "What do you buy?"
    hint: form.label,                      // 예: "현재진행"
    formId: form.id,
    qwordId: qword.id,
  };
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* 한 동사의 한 단계에 해당하는 카드 묶음을 만든다 */
function buildDeck(verb, stepIndex) {
  const step = STEPS[stepIndex];
  if (step.qword === '__all__') {
    const all = [];
    QWORDS.forEach(q => FORMS.forEach(f => all.push(makeCard(verb, f, q))));
    return shuffle(all);                   // 종합 단계는 섞어서
  }
  const q = QWORDS.find(x => x.id === step.qword);
  return FORMS.map(f => makeCard(verb, f, q));   // 기초 단계는 순서대로
}

window.DRILL = { FORMS, QWORDS, VERBS, STEPS, buildDeck };
