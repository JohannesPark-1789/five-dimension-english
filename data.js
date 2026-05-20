/* =====================================================================
   5차원 영어 · BASIC DRILL
   data.js — 학습 데이터 + 카드 자동 생성 엔진

   원동연 박사 5차원영어학습법의 BASIC DRILL 원리를 코드로 옮긴 것.
   하나의 동사를 11가지 시제·조동사 형태로 변형하고,
   거기에 5개 의문사(What/Where/How/Why/When)를 결합한다.

   ※ 동사는 모두 "사물 목적어를 받는 타동사"만 쓴다.
      그래야 "What do you ~?"(뭘 ~?)가 자연스러운 문장이 된다.
      (자동사 go·come 등은 "What do you go?"처럼 비문이 되므로 제외)
   ===================================================================== */

/* --- 11가지 시제·조동사 형태 --------------------------------------- */
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

/* --- 의문사 ---------------------------------------------------------
   동사 종류에 따라 쓰는 의문사가 다르다.
   - 사물 타동사 : What  (뭘 사니?)
   - 사람 타동사 : Who   (누구를 만나니?)
   - 자동사      : What/Who 없음 (목적어가 없으므로)                  */
const QWORDS = {
  none:  { id: 'none',  en: '',      ko: '' },
  what:  { id: 'what',  en: 'What',  ko: '뭘 ' },
  who:   { id: 'who',   en: 'Who',   ko: '누구를 ' },
  where: { id: 'where', en: 'Where', ko: '어디서 ' },
  how:   { id: 'how',   en: 'How',   ko: '어떻게 ' },
  why:   { id: 'why',   en: 'Why',   ko: '왜 ' },
  when:  { id: 'when',  en: 'When',  ko: '언제 ' },
};

/* 동사 종류별 의문사 단계 구성 (마지막에 '종합'이 추가됨) */
const TYPE_QWORDS = {
  thing:        ['none', 'what',  'where', 'how', 'why', 'when'],
  person:       ['none', 'who',   'where', 'how', 'why', 'when'],
  intransitive: ['none', 'where', 'how',   'why', 'when'],
};

const QWORD_INFO = {
  none:  { title: '기본 의문문',  sub: '의문사 없이 11가지 시제·조동사' },
  what:  { title: 'What 의문문',  sub: '무엇을 ~?' },
  who:   { title: 'Who 의문문',   sub: '누구를 ~?' },
  where: { title: 'Where 의문문', sub: '어디서 ~?' },
  how:   { title: 'How 의문문',   sub: '어떻게 ~?' },
  why:   { title: 'Why 의문문',   sub: '왜 ~?' },
  when:  { title: 'When 의문문',  sub: '언제 ~?' },
};

/* --- 동사 사전 (사물목적어 타동사 24개) ---------------------------- */
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
    id: 'drive', base: 'drive', ing: 'driving', emoji: '🚗', meaning: '운전하다',
    ko: {
      present: '운전하니?', continuous: '운전하고 있니?', past: '운전했니?',
      future: '운전할 거니?', can: '운전할 수 있니?',
      haveTo: '운전해야 하니?', hadTo: '운전해야 했니?',
      wantTo: '운전하고 싶니?', wantedTo: '운전하고 싶었니?',
      enjoy: '운전하는 걸 즐기니?', enjoyed: '운전하는 걸 즐겼니?',
    },
  },
  {
    id: 'draw', base: 'draw', ing: 'drawing', emoji: '🎨', meaning: '그리다',
    ko: {
      present: '그리니?', continuous: '그리고 있니?', past: '그렸니?',
      future: '그릴 거니?', can: '그릴 수 있니?',
      haveTo: '그려야 하니?', hadTo: '그려야 했니?',
      wantTo: '그리고 싶니?', wantedTo: '그리고 싶었니?',
      enjoy: '그리는 걸 즐기니?', enjoyed: '그리는 걸 즐겼니?',
    },
  },
  {
    id: 'wash', base: 'wash', ing: 'washing', emoji: '🧼', meaning: '씻다',
    ko: {
      present: '씻니?', continuous: '씻고 있니?', past: '씻었니?',
      future: '씻을 거니?', can: '씻을 수 있니?',
      haveTo: '씻어야 하니?', hadTo: '씻어야 했니?',
      wantTo: '씻고 싶니?', wantedTo: '씻고 싶었니?',
      enjoy: '씻는 걸 즐기니?', enjoyed: '씻는 걸 즐겼니?',
    },
  },
  {
    id: 'watch', base: 'watch', ing: 'watching', emoji: '📺', meaning: '보다',
    ko: {
      present: '보니?', continuous: '보고 있니?', past: '봤니?',
      future: '볼 거니?', can: '볼 수 있니?',
      haveTo: '봐야 하니?', hadTo: '봐야 했니?',
      wantTo: '보고 싶니?', wantedTo: '보고 싶었니?',
      enjoy: '보는 걸 즐기니?', enjoyed: '보는 걸 즐겼니?',
    },
  },
  {
    id: 'catch', base: 'catch', ing: 'catching', emoji: '⚾', meaning: '잡다',
    ko: {
      present: '잡니?', continuous: '잡고 있니?', past: '잡았니?',
      future: '잡을 거니?', can: '잡을 수 있니?',
      haveTo: '잡아야 하니?', hadTo: '잡아야 했니?',
      wantTo: '잡고 싶니?', wantedTo: '잡고 싶었니?',
      enjoy: '잡는 걸 즐기니?', enjoyed: '잡는 걸 즐겼니?',
    },
  },
  {
    id: 'fix', base: 'fix', ing: 'fixing', emoji: '🔧', meaning: '고치다',
    ko: {
      present: '고치니?', continuous: '고치고 있니?', past: '고쳤니?',
      future: '고칠 거니?', can: '고칠 수 있니?',
      haveTo: '고쳐야 하니?', hadTo: '고쳐야 했니?',
      wantTo: '고치고 싶니?', wantedTo: '고치고 싶었니?',
      enjoy: '고치는 걸 즐기니?', enjoyed: '고치는 걸 즐겼니?',
    },
  },
  {
    id: 'build', base: 'build', ing: 'building', emoji: '🏗️', meaning: '짓다',
    ko: {
      present: '짓니?', continuous: '짓고 있니?', past: '지었니?',
      future: '지을 거니?', can: '지을 수 있니?',
      haveTo: '지어야 하니?', hadTo: '지어야 했니?',
      wantTo: '짓고 싶니?', wantedTo: '짓고 싶었니?',
      enjoy: '짓는 걸 즐기니?', enjoyed: '짓는 걸 즐겼니?',
    },
  },
  {
    id: 'sell', base: 'sell', ing: 'selling', emoji: '🏷️', meaning: '팔다',
    ko: {
      present: '파니?', continuous: '팔고 있니?', past: '팔았니?',
      future: '팔 거니?', can: '팔 수 있니?',
      haveTo: '팔아야 하니?', hadTo: '팔아야 했니?',
      wantTo: '팔고 싶니?', wantedTo: '팔고 싶었니?',
      enjoy: '파는 걸 즐기니?', enjoyed: '파는 걸 즐겼니?',
    },
  },
  {
    id: 'throw', base: 'throw', ing: 'throwing', emoji: '🥏', meaning: '던지다',
    ko: {
      present: '던지니?', continuous: '던지고 있니?', past: '던졌니?',
      future: '던질 거니?', can: '던질 수 있니?',
      haveTo: '던져야 하니?', hadTo: '던져야 했니?',
      wantTo: '던지고 싶니?', wantedTo: '던지고 싶었니?',
      enjoy: '던지는 걸 즐기니?', enjoyed: '던지는 걸 즐겼니?',
    },
  },

  /* --- 사람 목적어 타동사 (Who 의문문) --- */
  {
    id: 'meet', base: 'meet', ing: 'meeting', emoji: '🤝', meaning: '만나다',
    type: 'person',
    ko: {
      present: '만나니?', continuous: '만나고 있니?', past: '만났니?',
      future: '만날 거니?', can: '만날 수 있니?',
      haveTo: '만나야 하니?', hadTo: '만나야 했니?',
      wantTo: '만나고 싶니?', wantedTo: '만나고 싶었니?',
      enjoy: '만나는 걸 즐기니?', enjoyed: '만나는 걸 즐겼니?',
    },
  },
  {
    id: 'help', base: 'help', ing: 'helping', emoji: '🆘', meaning: '돕다',
    type: 'person',
    ko: {
      present: '돕니?', continuous: '돕고 있니?', past: '도왔니?',
      future: '도울 거니?', can: '도울 수 있니?',
      haveTo: '도와야 하니?', hadTo: '도와야 했니?',
      wantTo: '돕고 싶니?', wantedTo: '돕고 싶었니?',
      enjoy: '돕는 걸 즐기니?', enjoyed: '돕는 걸 즐겼니?',
    },
  },
  {
    id: 'invite', base: 'invite', ing: 'inviting', emoji: '💌', meaning: '초대하다',
    type: 'person',
    ko: {
      present: '초대하니?', continuous: '초대하고 있니?', past: '초대했니?',
      future: '초대할 거니?', can: '초대할 수 있니?',
      haveTo: '초대해야 하니?', hadTo: '초대해야 했니?',
      wantTo: '초대하고 싶니?', wantedTo: '초대하고 싶었니?',
      enjoy: '초대하는 걸 즐기니?', enjoyed: '초대하는 걸 즐겼니?',
    },
  },

  /* --- 자동사 (목적어 없음 · What/Who 단계 없음) --- */
  {
    id: 'go', base: 'go', ing: 'going', emoji: '🚶', meaning: '가다',
    type: 'intransitive',
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
    type: 'intransitive',
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
    type: 'intransitive',
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
    type: 'intransitive',
    ko: {
      present: '달리니?', continuous: '달리고 있니?', past: '달렸니?',
      future: '달릴 거니?', can: '달릴 수 있니?',
      haveTo: '달려야 하니?', hadTo: '달려야 했니?',
      wantTo: '달리고 싶니?', wantedTo: '달리고 싶었니?',
      enjoy: '달리는 걸 즐기니?', enjoyed: '달리는 걸 즐겼니?',
    },
  },
  {
    id: 'swim', base: 'swim', ing: 'swimming', emoji: '🏊', meaning: '수영하다',
    type: 'intransitive',
    ko: {
      present: '수영하니?', continuous: '수영하고 있니?', past: '수영했니?',
      future: '수영할 거니?', can: '수영할 수 있니?',
      haveTo: '수영해야 하니?', hadTo: '수영해야 했니?',
      wantTo: '수영하고 싶니?', wantedTo: '수영하고 싶었니?',
      enjoy: '수영하는 걸 즐기니?', enjoyed: '수영하는 걸 즐겼니?',
    },
  },
  {
    id: 'play', base: 'play', ing: 'playing', emoji: '⚽', meaning: '놀다',
    type: 'intransitive',
    ko: {
      present: '노니?', continuous: '놀고 있니?', past: '놀았니?',
      future: '놀 거니?', can: '놀 수 있니?',
      haveTo: '놀아야 하니?', hadTo: '놀아야 했니?',
      wantTo: '놀고 싶니?', wantedTo: '놀고 싶었니?',
      enjoy: '노는 걸 즐기니?', enjoyed: '노는 걸 즐겼니?',
    },
  },
];

/* --- 단계 구성 ------------------------------------------------------ */
/* 동사 종류에 맞춰 단계 목록을 만든다.
   사물·사람 타동사 : 7단계,  자동사 : 6단계 (What/Who 단계 없음)     */
function stepsForVerb(verb) {
  const qids = TYPE_QWORDS[verb.type] || TYPE_QWORDS.thing;
  const steps = qids.map(qid => ({
    qword: qid,
    title: QWORD_INFO[qid].title,
    sub: QWORD_INFO[qid].sub,
  }));
  steps.push({ qword: '__all__', title: '종합 드릴', sub: '전체 문장 섞어서' });
  return steps;
}

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

/* 한 동사의 한 단계에 해당하는 카드 묶음을 만든다 (항상 정해진 순서).
   섞을지 여부는 드릴 시작 시 설정에 따라 app.js에서 결정한다. */
function buildDeck(verb, stepIndex) {
  const step = stepsForVerb(verb)[stepIndex];
  if (step.qword === '__all__') {
    const all = [];
    (TYPE_QWORDS[verb.type] || TYPE_QWORDS.thing).forEach(qid =>
      FORMS.forEach(f => all.push(makeCard(verb, f, QWORDS[qid]))));
    return all;
  }
  return FORMS.map(f => makeCard(verb, f, QWORDS[step.qword]));
}

window.DRILL = { FORMS, QWORDS, VERBS, stepsForVerb, buildDeck };
