/* =====================================================================
   5차원 영어 · BASIC DRILL
   data.js — 학습 데이터 + 카드 자동 생성 엔진

   원동연 박사 5차원영어학습법의 BASIC DRILL 원리를 코드로 옮긴 것.
   하나의 동사를 11가지 시제·조동사 형태로 변형하고,
   그것을 다시 평서문·부정문·의문문 세 문형으로 굴린다.
   의문문에는 5개 의문사(What/Where/How/Why/When)를 결합한다.

   ※ 동사는 세 종류로 나뉜다 (type 필드).
      thing        사물 목적어 타동사 → What 단계
      person       사람 목적어 타동사 → Who 단계
      intransitive 자동사            → What/Who 단계 없음

   ※ 타동사에는 기본 목적어(obj·objKo)를 둔다.
      영어는 타동사를 목적어 없이 못 쓰기 때문이다 — "Do you buy?" 는 비문.
      What/Who 단계에서는 의문사가 목적어 노릇을 하므로 슬롯을 비운다.
      자세한 규칙은 makeCard 참조.
   ===================================================================== */

/* --- 11가지 시제·조동사 형태 × 3가지 문형 ---------------------------
   교재는 한 동사를 평서문 → 부정문 → 의문문 순으로 굴린다.
   그래서 형태마다 세 가지 영어 생성기를 둔다.

     q   의문문  Do you buy a ticket?
     dec 평서문  You buy a ticket.
     neg 부정문  You don't buy a ticket.

   두 번째 인자 o 는 목적어 슬롯이다. 동사 바로 뒤에 들어간다.
   무엇이 들어갈지는 makeCard 가 정한다 — What/Who 단계에서는 의문사가
   곧 목적어라 빈 문자열이 온다.

   평서문 과거만 동사원형이 아니라 과거형(v.past)을 쓴다.
   부정문 과거는 did + 원형이라 v.past 가 필요 없다.                   */
const FORMS = [
  { id: 'present', label: '현재', group: '기본 시제',
    q:   (v, o) => `Do you ${v.base}${o}?`,
    dec: (v, o) => `You ${v.base}${o}.`,
    neg: (v, o) => `You don't ${v.base}${o}.`,
    ko: v => v.ko.present },
  { id: 'continuous', label: '현재진행', group: '기본 시제',
    q:   (v, o) => `Are you ${v.ing}${o}?`,
    dec: (v, o) => `You are ${v.ing}${o}.`,
    neg: (v, o) => `You aren't ${v.ing}${o}.`,
    ko: v => v.ko.continuous },
  { id: 'past', label: '과거', group: '기본 시제',
    q:   (v, o) => `Did you ${v.base}${o}?`,
    dec: (v, o) => `You ${v.past}${o}.`,
    neg: (v, o) => `You didn't ${v.base}${o}.`,
    ko: v => v.ko.past },
  { id: 'future', label: '미래 (will)', group: '미래·가능',
    q:   (v, o) => `Will you ${v.base}${o}?`,
    dec: (v, o) => `You will ${v.base}${o}.`,
    neg: (v, o) => `You won't ${v.base}${o}.`,
    ko: v => v.ko.future },
  { id: 'can', label: '가능 (can)', group: '미래·가능',
    q:   (v, o) => `Can you ${v.base}${o}?`,
    dec: (v, o) => `You can ${v.base}${o}.`,
    neg: (v, o) => `You can't ${v.base}${o}.`,
    ko: v => v.ko.can },
  { id: 'haveTo', label: '의무 (have to)', group: '의무·소망·취향',
    q:   (v, o) => `Do you have to ${v.base}${o}?`,
    dec: (v, o) => `You have to ${v.base}${o}.`,
    neg: (v, o) => `You don't have to ${v.base}${o}.`,
    ko: v => v.ko.haveTo },
  { id: 'hadTo', label: '과거 의무', group: '의무·소망·취향',
    q:   (v, o) => `Did you have to ${v.base}${o}?`,
    dec: (v, o) => `You had to ${v.base}${o}.`,
    neg: (v, o) => `You didn't have to ${v.base}${o}.`,
    ko: v => v.ko.hadTo },
  { id: 'wantTo', label: '소망 (want to)', group: '의무·소망·취향',
    q:   (v, o) => `Do you want to ${v.base}${o}?`,
    dec: (v, o) => `You want to ${v.base}${o}.`,
    neg: (v, o) => `You don't want to ${v.base}${o}.`,
    ko: v => v.ko.wantTo },
  { id: 'wantedTo', label: '과거 소망', group: '의무·소망·취향',
    q:   (v, o) => `Did you want to ${v.base}${o}?`,
    dec: (v, o) => `You wanted to ${v.base}${o}.`,
    neg: (v, o) => `You didn't want to ${v.base}${o}.`,
    ko: v => v.ko.wantedTo },
  { id: 'enjoy', label: '취향 (enjoy)', group: '의무·소망·취향',
    q:   (v, o) => `Do you enjoy ${v.ing}${o}?`,
    dec: (v, o) => `You enjoy ${v.ing}${o}.`,
    neg: (v, o) => `You don't enjoy ${v.ing}${o}.`,
    ko: v => v.ko.enjoy },
  { id: 'enjoyed', label: '과거 취향', group: '의무·소망·취향',
    q:   (v, o) => `Did you enjoy ${v.ing}${o}?`,
    dec: (v, o) => `You enjoyed ${v.ing}${o}.`,
    neg: (v, o) => `You didn't enjoy ${v.ing}${o}.`,
    ko: v => v.ko.enjoyed },
];


/* --- 한국어 서술형·부정형 만들기 ------------------------------------
   의문형 11개는 동사마다 적어 두었다. 서술형·부정형까지 손으로 적으면
   동사 하나에 33개 — 관리할 양이 아니다. 그래서 어미 규칙으로 만든다.
   규칙이 안 통하는 현재형만 동사에 koDec·koNeg 로 직접 적어 둔다.

     의문 '샀니?'        → 서술 '샀다'          ('니?' → '다')
     의문 '사야 하니?'   → 서술 '사야 한다'     ('하니?' → '한다')
     의문 '~ 즐기니?'    → 서술 '~ 즐긴다'      ('즐기니?' → '즐긴다')
     의문 '사니?'        → 서술 '산다'          ← 규칙이 안 통해 koDec 사용   */
function koDeclOf(verb, formId) {
  if (formId === 'present') return verb.koDec;
  const q = verb.ko[formId];
  if (q.endsWith('하니?'))   return q.slice(0, -3) + '한다';
  if (q.endsWith('즐기니?')) return q.slice(0, -4) + '즐긴다';
  return q.slice(0, -2) + '다';
}

/* 부정형은 koNeg('사지 않는다')와 서술형에서 갈라져 나온다. */
function koNegOf(verb, formId) {
  const tail = (s, from, to) => s.slice(0, s.length - from.length) + to;
  const n = verb.koNeg;
  switch (formId) {
    case 'present':    return n;
    case 'past':       return tail(n, '않는다', '않았다');
    case 'future':     return tail(n, '않는다', '않을 거다');
    case 'haveTo':     return tail(n, '않는다', '않아도 된다');   // don't have to
    case 'hadTo':      return tail(n, '않는다', '않아도 됐다');   // didn't have to
    default: {
      const d = koDeclOf(verb, formId);
      if (formId === 'continuous') return tail(d, '있다',   '있지 않다');
      if (formId === 'can')        return tail(d, '있다',   '없다');
      if (formId === 'wantTo')     return tail(d, '싶다',   '싶지 않다');
      if (formId === 'wantedTo')   return tail(d, '싶었다', '싶지 않았다');
      if (formId === 'enjoy')      return tail(d, '즐긴다', '즐기지 않는다');
      if (formId === 'enjoyed')    return tail(d, '즐겼다', '즐기지 않았다');
      return d;
    }
  }
}

/* --- 문형 ------------------------------------------------------------ */
const SENT_INFO = {
  dec: { id: 'dec', title: '평서문', sub: 'You ~ · 사실을 그대로 말한다' },
  neg: { id: 'neg', title: '부정문', sub: "You don't ~ · 아니라고 말한다" },
};

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

/* --- 동사 사전 (54개: 사물 36 · 사람 6 · 자동사 12) ----------------- */
/* base  : 동사원형,  ing : 진행형
   obj   : 기본 목적어 (타동사만). What/Who 단계에서는 안 쓰인다.
   objKo : 그 목적어의 한국어. 의문사 한국어와 동사 한국어 사이에 들어간다.
   ko    : 11개 한국어 변형 (의문사 없는 기본형, "(너)" 주어 생략)

   동사를 추가할 때:
     ① ing 는 철자 규칙대로 (run→running, make→making, travel→traveling)
     ② 타동사면 obj·objKo 를 반드시 채운다 — 없으면 목적어 없는 비문이 나온다
     ③ 상태동사(know·like·want…)는 넣지 않는다 — "Are you knowing?" 이 된다
     ④ 넣고 나서 `node audit/run.mjs` 로 검수 파이프라인을 돌린다        */
const VERBS = [
  {
    id: 'buy', base: 'buy', ing: 'buying', emoji: '🛒', meaning: '사다',
    past: 'bought', koDec: '산다', koNeg: '사지 않는다',
    obj: 'a ticket', objKo: '표를',
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
    past: 'ate', koDec: '먹는다', koNeg: '먹지 않는다',
    obj: 'lunch', objKo: '점심을',
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
    past: 'read', koDec: '읽는다', koNeg: '읽지 않는다',
    obj: 'a book', objKo: '책을',
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
    past: 'wrote', koDec: '쓴다', koNeg: '쓰지 않는다',
    obj: 'a letter', objKo: '편지를',
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
    past: 'made', koDec: '만든다', koNeg: '만들지 않는다',
    obj: 'a cake', objKo: '케이크를',
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
    past: 'studied', koDec: '공부한다', koNeg: '공부하지 않는다',
    obj: 'English', objKo: '영어를',
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
    past: 'drank', koDec: '마신다', koNeg: '마시지 않는다',
    obj: 'coffee', objKo: '커피를',
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
    past: 'learned', koDec: '배운다', koNeg: '배우지 않는다',
    obj: 'new words', objKo: '새 단어를',
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
    past: 'cooked', koDec: '요리한다', koNeg: '요리하지 않는다',
    obj: 'dinner', objKo: '저녁을',
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
    past: 'cleaned', koDec: '청소한다', koNeg: '청소하지 않는다',
    obj: 'your room', objKo: '방을',
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
    past: 'opened', koDec: '연다', koNeg: '열지 않는다',
    obj: 'the window', objKo: '창문을',
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
    past: 'closed', koDec: '닫는다', koNeg: '닫지 않는다',
    obj: 'the door', objKo: '문을',
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
    past: 'sent', koDec: '보낸다', koNeg: '보내지 않는다',
    obj: 'an email', objKo: '이메일을',
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
    past: 'taught', koDec: '가르친다', koNeg: '가르치지 않는다',
    obj: 'math', objKo: '수학을',
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
    past: 'sang', koDec: '노래한다', koNeg: '노래하지 않는다',
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
    past: 'drove', koDec: '운전한다', koNeg: '운전하지 않는다',
    obj: 'a car', objKo: '차를',
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
    past: 'drew', koDec: '그린다', koNeg: '그리지 않는다',
    obj: 'a picture', objKo: '그림을',
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
    past: 'washed', koDec: '씻는다', koNeg: '씻지 않는다',
    obj: 'the dishes', objKo: '접시를',
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
    past: 'watched', koDec: '본다', koNeg: '보지 않는다',
    obj: 'a movie', objKo: '영화를',
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
    past: 'caught', koDec: '잡는다', koNeg: '잡지 않는다',
    obj: 'the ball', objKo: '공을',
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
    past: 'fixed', koDec: '고친다', koNeg: '고치지 않는다',
    obj: 'a bike', objKo: '자전거를',
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
    past: 'built', koDec: '짓는다', koNeg: '짓지 않는다',
    obj: 'a house', objKo: '집을',
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
    past: 'sold', koDec: '판다', koNeg: '팔지 않는다',
    obj: 'flowers', objKo: '꽃을',
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
    past: 'threw', koDec: '던진다', koNeg: '던지지 않는다',
    obj: 'the ball', objKo: '공을',
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
    past: 'met', koDec: '만난다', koNeg: '만나지 않는다',
    obj: 'your friends', objKo: '친구들을',
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
    past: 'helped', koDec: '돕는다', koNeg: '돕지 않는다',
    obj: 'your mom', objKo: '엄마를',
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
    past: 'invited', koDec: '초대한다', koNeg: '초대하지 않는다',
    obj: 'your neighbors', objKo: '이웃을',
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

  /* ----- 확장 · 일상 동작 (사물 목적어) ----- */
  {
    id: 'use', base: 'use', ing: 'using', emoji: '💻', meaning: '사용하다',
    past: 'used', koDec: '사용한다', koNeg: '사용하지 않는다',
    obj: 'a computer', objKo: '컴퓨터를',
    ko: {
      present: '사용하니?', continuous: '사용하고 있니?', past: '사용했니?',
      future: '사용할 거니?', can: '사용할 수 있니?',
      haveTo: '사용해야 하니?', hadTo: '사용해야 했니?',
      wantTo: '사용하고 싶니?', wantedTo: '사용하고 싶었니?',
      enjoy: '사용하는 걸 즐기니?', enjoyed: '사용하는 걸 즐겼니?',
    },
  },
  {
    id: 'find', base: 'find', ing: 'finding', emoji: '🔍', meaning: '찾다',
    past: 'found', koDec: '찾는다', koNeg: '찾지 않는다',
    obj: 'your keys', objKo: '열쇠를',
    ko: {
      present: '찾니?', continuous: '찾고 있니?', past: '찾았니?',
      future: '찾을 거니?', can: '찾을 수 있니?',
      haveTo: '찾아야 하니?', hadTo: '찾아야 했니?',
      wantTo: '찾고 싶니?', wantedTo: '찾고 싶었니?',
      enjoy: '찾는 걸 즐기니?', enjoyed: '찾는 걸 즐겼니?',
    },
  },
  {
    id: 'bring', base: 'bring', ing: 'bringing', emoji: '🎒', meaning: '가져오다',
    past: 'brought', koDec: '가져온다', koNeg: '가져오지 않는다',
    obj: 'your lunch', objKo: '도시락을',
    ko: {
      present: '가져오니?', continuous: '가져오고 있니?', past: '가져왔니?',
      future: '가져올 거니?', can: '가져올 수 있니?',
      haveTo: '가져와야 하니?', hadTo: '가져와야 했니?',
      wantTo: '가져오고 싶니?', wantedTo: '가져오고 싶었니?',
      enjoy: '가져오는 걸 즐기니?', enjoyed: '가져오는 걸 즐겼니?',
    },
  },
  {
    id: 'wear', base: 'wear', ing: 'wearing', emoji: '👕', meaning: '입다',
    past: 'wore', koDec: '입는다', koNeg: '입지 않는다',
    obj: 'a uniform', objKo: '교복을',
    ko: {
      present: '입니?', continuous: '입고 있니?', past: '입었니?',
      future: '입을 거니?', can: '입을 수 있니?',
      haveTo: '입어야 하니?', hadTo: '입어야 했니?',
      wantTo: '입고 싶니?', wantedTo: '입고 싶었니?',
      enjoy: '입는 걸 즐기니?', enjoyed: '입는 걸 즐겼니?',
    },
  },
  {
    id: 'choose', base: 'choose', ing: 'choosing', emoji: '🎯', meaning: '고르다',
    past: 'chose', koDec: '고른다', koNeg: '고르지 않는다',
    obj: 'a gift', objKo: '선물을',
    ko: {
      present: '고르니?', continuous: '고르고 있니?', past: '골랐니?',
      future: '고를 거니?', can: '고를 수 있니?',
      haveTo: '골라야 하니?', hadTo: '골라야 했니?',
      wantTo: '고르고 싶니?', wantedTo: '고르고 싶었니?',
      enjoy: '고르는 걸 즐기니?', enjoyed: '고르는 걸 즐겼니?',
    },
  },
  {
    id: 'carry', base: 'carry', ing: 'carrying', emoji: '📦', meaning: '나르다',
    past: 'carried', koDec: '나른다', koNeg: '나르지 않는다',
    obj: 'a box', objKo: '상자를',
    ko: {
      present: '나르니?', continuous: '나르고 있니?', past: '날랐니?',
      future: '나를 거니?', can: '나를 수 있니?',
      haveTo: '날라야 하니?', hadTo: '날라야 했니?',
      wantTo: '나르고 싶니?', wantedTo: '나르고 싶었니?',
      enjoy: '나르는 걸 즐기니?', enjoyed: '나르는 걸 즐겼니?',
    },
  },
  {
    id: 'break', base: 'break', ing: 'breaking', emoji: '💥', meaning: '깨뜨리다',
    past: 'broke', koDec: '깨뜨린다', koNeg: '깨뜨리지 않는다',
    obj: 'a glass', objKo: '유리컵을',
    ko: {
      present: '깨뜨리니?', continuous: '깨뜨리고 있니?', past: '깨뜨렸니?',
      future: '깨뜨릴 거니?', can: '깨뜨릴 수 있니?',
      haveTo: '깨뜨려야 하니?', hadTo: '깨뜨려야 했니?',
      wantTo: '깨뜨리고 싶니?', wantedTo: '깨뜨리고 싶었니?',
      enjoy: '깨뜨리는 걸 즐기니?', enjoyed: '깨뜨리는 걸 즐겼니?',
    },
  },
  {
    id: 'paint', base: 'paint', ing: 'painting', emoji: '🖌', meaning: '칠하다',
    past: 'painted', koDec: '칠한다', koNeg: '칠하지 않는다',
    obj: 'the wall', objKo: '벽을',
    ko: {
      present: '칠하니?', continuous: '칠하고 있니?', past: '칠했니?',
      future: '칠할 거니?', can: '칠할 수 있니?',
      haveTo: '칠해야 하니?', hadTo: '칠해야 했니?',
      wantTo: '칠하고 싶니?', wantedTo: '칠하고 싶었니?',
      enjoy: '칠하는 걸 즐기니?', enjoyed: '칠하는 걸 즐겼니?',
    },
  },
  {
    id: 'plant', base: 'plant', ing: 'planting', emoji: '🌱', meaning: '심다',
    past: 'planted', koDec: '심는다', koNeg: '심지 않는다',
    obj: 'a tree', objKo: '나무를',
    ko: {
      present: '심니?', continuous: '심고 있니?', past: '심었니?',
      future: '심을 거니?', can: '심을 수 있니?',
      haveTo: '심어야 하니?', hadTo: '심어야 했니?',
      wantTo: '심고 싶니?', wantedTo: '심고 싶었니?',
      enjoy: '심는 걸 즐기니?', enjoyed: '심는 걸 즐겼니?',
    },
  },
  {
    id: 'order', base: 'order', ing: 'ordering', emoji: '🍕', meaning: '주문하다',
    past: 'ordered', koDec: '주문한다', koNeg: '주문하지 않는다',
    obj: 'pizza', objKo: '피자를',
    ko: {
      present: '주문하니?', continuous: '주문하고 있니?', past: '주문했니?',
      future: '주문할 거니?', can: '주문할 수 있니?',
      haveTo: '주문해야 하니?', hadTo: '주문해야 했니?',
      wantTo: '주문하고 싶니?', wantedTo: '주문하고 싶었니?',
      enjoy: '주문하는 걸 즐기니?', enjoyed: '주문하는 걸 즐겼니?',
    },
  },
  {
    id: 'save', base: 'save', ing: 'saving', emoji: '🐷', meaning: '모으다',
    past: 'saved', koDec: '모은다', koNeg: '모으지 않는다',
    obj: 'coins', objKo: '동전을',
    ko: {
      present: '모으니?', continuous: '모으고 있니?', past: '모았니?',
      future: '모을 거니?', can: '모을 수 있니?',
      haveTo: '모아야 하니?', hadTo: '모아야 했니?',
      wantTo: '모으고 싶니?', wantedTo: '모으고 싶었니?',
      enjoy: '모으는 걸 즐기니?', enjoyed: '모으는 걸 즐겼니?',
    },
  },
  {
    id: 'count', base: 'count', ing: 'counting', emoji: '🔢', meaning: '세다',
    past: 'counted', koDec: '센다', koNeg: '세지 않는다',
    obj: 'the stars', objKo: '별을',
    ko: {
      present: '세니?', continuous: '세고 있니?', past: '셌니?',
      future: '셀 거니?', can: '셀 수 있니?',
      haveTo: '세야 하니?', hadTo: '세야 했니?',
      wantTo: '세고 싶니?', wantedTo: '세고 싶었니?',
      enjoy: '세는 걸 즐기니?', enjoyed: '세는 걸 즐겼니?',
    },
  },

  /* ----- 확장 · 사람을 대하는 동작 (사람 목적어) ----- */
  {
    id: 'call', base: 'call', ing: 'calling', emoji: '📞', meaning: '부르다',
    past: 'called', koDec: '부른다', koNeg: '부르지 않는다',
    obj: 'your teacher', objKo: '선생님을',
    type: 'person',
    ko: {
      present: '부르니?', continuous: '부르고 있니?', past: '불렀니?',
      future: '부를 거니?', can: '부를 수 있니?',
      haveTo: '불러야 하니?', hadTo: '불러야 했니?',
      wantTo: '부르고 싶니?', wantedTo: '부르고 싶었니?',
      enjoy: '부르는 걸 즐기니?', enjoyed: '부르는 걸 즐겼니?',
    },
  },
  {
    id: 'visit', base: 'visit', ing: 'visiting', emoji: '🏡', meaning: '방문하다',
    past: 'visited', koDec: '방문한다', koNeg: '방문하지 않는다',
    obj: 'your grandma', objKo: '할머니를',
    type: 'person',
    ko: {
      present: '방문하니?', continuous: '방문하고 있니?', past: '방문했니?',
      future: '방문할 거니?', can: '방문할 수 있니?',
      haveTo: '방문해야 하니?', hadTo: '방문해야 했니?',
      wantTo: '방문하고 싶니?', wantedTo: '방문하고 싶었니?',
      enjoy: '방문하는 걸 즐기니?', enjoyed: '방문하는 걸 즐겼니?',
    },
  },
  {
    id: 'follow', base: 'follow', ing: 'following', emoji: '👣', meaning: '따라가다',
    past: 'followed', koDec: '따라간다', koNeg: '따라가지 않는다',
    obj: 'your brother', objKo: '형을',
    type: 'person',
    ko: {
      present: '따라가니?', continuous: '따라가고 있니?', past: '따라갔니?',
      future: '따라갈 거니?', can: '따라갈 수 있니?',
      haveTo: '따라가야 하니?', hadTo: '따라가야 했니?',
      wantTo: '따라가고 싶니?', wantedTo: '따라가고 싶었니?',
      enjoy: '따라가는 걸 즐기니?', enjoyed: '따라가는 걸 즐겼니?',
    },
  },

  {
    id: 'go', base: 'go', ing: 'going', emoji: '🚶', meaning: '가다',
    past: 'went', koDec: '간다', koNeg: '가지 않는다',
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
    past: 'came', koDec: '온다', koNeg: '오지 않는다',
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
    past: 'walked', koDec: '걷는다', koNeg: '걷지 않는다',
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
    past: 'ran', koDec: '달린다', koNeg: '달리지 않는다',
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
    past: 'swam', koDec: '수영한다', koNeg: '수영하지 않는다',
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
    past: 'played', koDec: '논다', koNeg: '놀지 않는다',
    type: 'intransitive',
    ko: {
      present: '노니?', continuous: '놀고 있니?', past: '놀았니?',
      future: '놀 거니?', can: '놀 수 있니?',
      haveTo: '놀아야 하니?', hadTo: '놀아야 했니?',
      wantTo: '놀고 싶니?', wantedTo: '놀고 싶었니?',
      enjoy: '노는 걸 즐기니?', enjoyed: '노는 걸 즐겼니?',
    },
  },

  /* ----- 확장 · 몸의 상태·이동 (자동사) ----- */
  {
    id: 'sleep', base: 'sleep', ing: 'sleeping', emoji: '😴', meaning: '자다',
    past: 'slept', koDec: '잔다', koNeg: '자지 않는다',
    type: 'intransitive',
    ko: {
      present: '자니?', continuous: '자고 있니?', past: '잤니?',
      future: '잘 거니?', can: '잘 수 있니?',
      haveTo: '자야 하니?', hadTo: '자야 했니?',
      wantTo: '자고 싶니?', wantedTo: '자고 싶었니?',
      enjoy: '자는 걸 즐기니?', enjoyed: '자는 걸 즐겼니?',
    },
  },
  {
    id: 'sit', base: 'sit', ing: 'sitting', emoji: '🪑', meaning: '앉다',
    past: 'sat', koDec: '앉는다', koNeg: '앉지 않는다',
    type: 'intransitive',
    ko: {
      present: '앉니?', continuous: '앉고 있니?', past: '앉았니?',
      future: '앉을 거니?', can: '앉을 수 있니?',
      haveTo: '앉아야 하니?', hadTo: '앉아야 했니?',
      wantTo: '앉고 싶니?', wantedTo: '앉고 싶었니?',
      enjoy: '앉는 걸 즐기니?', enjoyed: '앉는 걸 즐겼니?',
    },
  },
  {
    id: 'stand', base: 'stand', ing: 'standing', emoji: '🧍', meaning: '서다',
    past: 'stood', koDec: '선다', koNeg: '서지 않는다',
    type: 'intransitive',
    ko: {
      present: '서니?', continuous: '서고 있니?', past: '섰니?',
      future: '설 거니?', can: '설 수 있니?',
      haveTo: '서야 하니?', hadTo: '서야 했니?',
      wantTo: '서고 싶니?', wantedTo: '서고 싶었니?',
      enjoy: '서는 걸 즐기니?', enjoyed: '서는 걸 즐겼니?',
    },
  },
  {
    id: 'wait', base: 'wait', ing: 'waiting', emoji: '⏳', meaning: '기다리다',
    past: 'waited', koDec: '기다린다', koNeg: '기다리지 않는다',
    type: 'intransitive',
    ko: {
      present: '기다리니?', continuous: '기다리고 있니?', past: '기다렸니?',
      future: '기다릴 거니?', can: '기다릴 수 있니?',
      haveTo: '기다려야 하니?', hadTo: '기다려야 했니?',
      wantTo: '기다리고 싶니?', wantedTo: '기다리고 싶었니?',
      enjoy: '기다리는 걸 즐기니?', enjoyed: '기다리는 걸 즐겼니?',
    },
  },
  {
    id: 'dance', base: 'dance', ing: 'dancing', emoji: '💃', meaning: '춤추다',
    past: 'danced', koDec: '춤춘다', koNeg: '춤추지 않는다',
    type: 'intransitive',
    ko: {
      present: '춤추니?', continuous: '춤추고 있니?', past: '춤췄니?',
      future: '춤출 거니?', can: '춤출 수 있니?',
      haveTo: '춤춰야 하니?', hadTo: '춤춰야 했니?',
      wantTo: '춤추고 싶니?', wantedTo: '춤추고 싶었니?',
      enjoy: '춤추는 걸 즐기니?', enjoyed: '춤추는 걸 즐겼니?',
    },
  },
  {
    id: 'work', base: 'work', ing: 'working', emoji: '🏢', meaning: '일하다',
    past: 'worked', koDec: '일한다', koNeg: '일하지 않는다',
    type: 'intransitive',
    ko: {
      present: '일하니?', continuous: '일하고 있니?', past: '일했니?',
      future: '일할 거니?', can: '일할 수 있니?',
      haveTo: '일해야 하니?', hadTo: '일해야 했니?',
      wantTo: '일하고 싶니?', wantedTo: '일하고 싶었니?',
      enjoy: '일하는 걸 즐기니?', enjoyed: '일하는 걸 즐겼니?',
    },
  },
];

/* --- 단계 구성 ------------------------------------------------------ */
/* 동사 종류에 맞춰 단계 목록을 만든다.
   평서문 → 부정문 → 의문문(의문사별) → 종합 순.
   사물·사람 타동사 : 9단계,  자동사 : 8단계 (What/Who 단계 없음)     */
function stepsForVerb(verb) {
  const qids = TYPE_QWORDS[verb.type] || TYPE_QWORDS.thing;
  const steps = [
    { sent: 'dec', qword: 'none', title: SENT_INFO.dec.title, sub: SENT_INFO.dec.sub },
    { sent: 'neg', qword: 'none', title: SENT_INFO.neg.title, sub: SENT_INFO.neg.sub },
    ...qids.map(qid => ({
      sent: 'q', qword: qid,
      title: QWORD_INFO[qid].title,
      sub: QWORD_INFO[qid].sub,
    })),
  ];
  steps.push({ sent: '__all__', qword: '__all__', title: '종합 드릴', sub: '전체 문장 섞어서' });
  return steps;
}

/* --- 카드 생성 ------------------------------------------------------
   목적어 슬롯을 채울지 말지가 여기서 갈린다.

   영어는 타동사를 목적어 없이 못 쓴다. "Do you buy?" 는 비문이다.
   목적어를 대신 채워 주는 의문사는 What·Who 둘뿐이므로,
   나머지 단계(기본·Where·How·Why·When)에서는 동사가 들고 있는
   기본 목적어를 끼워 넣는다.

     기본   Do you buy a ticket?        표를 사니?
     Where  Where do you buy a ticket?  어디서 표를 사니?
     What   What do you buy?            뭘 사니?          ← 의문사가 목적어

   한국어는 목적어를 자유롭게 생략해서 "어디서 사니?" 도 자연스럽다.
   그래서 이 결함은 한국어만 보면 안 보인다.

   자동사(go·come…)와 절대용법이 표준인 동사(sing)는 obj 가 없다 —
   "Do you sing a song?" 은 군더더기다.                                */
function makeCard(verb, form, qword, sent) {
  const fillObj = verb.obj && qword.id !== 'what' && qword.id !== 'who';
  const obj     = fillObj ? ' ' + verb.obj : '';
  const objKo   = fillObj ? verb.objKo + ' ' : '';

  /* 평서문·부정문에는 의문사가 붙지 않는다. */
  if (sent === 'dec' || sent === 'neg') {
    return {
      ko: objKo + (sent === 'dec' ? koDeclOf(verb, form.id) : koNegOf(verb, form.id)),
      en: sent === 'dec' ? form.dec(verb, obj) : form.neg(verb, obj),
      hint: form.label,
      formId: form.id,
      qwordId: 'none',
      sentType: sent,
    };
  }

  const baseEn = form.q(verb, obj);        // 예: "Do you buy a ticket?"
  let en;
  if (qword.id === 'none') {
    en = baseEn;
  } else {
    // 의문사를 앞에 붙이고 첫 글자를 소문자로: "What" + "do you buy?"
    en = qword.en + ' ' + baseEn.charAt(0).toLowerCase() + baseEn.slice(1);
  }
  return {
    ko: qword.ko + objKo + form.ko(verb),  // 예: "어디서 표를 사니?"
    en: en,                                // 예: "Where do you buy a ticket?"
    hint: form.label,                      // 예: "현재진행"
    formId: form.id,
    qwordId: qword.id,
    sentType: 'q',
  };
}

/* 한 동사의 한 단계에 해당하는 카드 묶음을 만든다 (항상 정해진 순서).
   섞을지 여부는 드릴 시작 시 설정에 따라 app.js에서 결정한다. */
/* 의문사 × 시제형 조합 중, 문법은 맞지만 원어민이 쓰지 않는 것.
   영어 검수(audit A1)에서 awkward 판정을 받아 그리드에서 뺀다.
   그래서 How·Why 단계는 카드가 11개가 아니라 9개다 — 의도된 것이다.

     How  + have to / had to   "How do you have to buy it?"
                               수단을 묻는 how 와 의무의 have to 가 안 붙는다.
     Why  + will               "Why will you go?" → Why are you going?
     Why  + can                "Why can you go?"  → How come you can go?          */
const SKIP_COMBOS = {
  how: ['haveTo', 'hadTo'],
  why: ['future', 'can'],
};
function formsFor(qwordId) {
  const skip = SKIP_COMBOS[qwordId];
  return skip ? FORMS.filter(f => skip.indexOf(f.id) === -1) : FORMS;
}

function buildDeck(verb, stepIndex) {
  const step = stepsForVerb(verb)[stepIndex];
  if (step.sent === '__all__') {
    const all = [];
    ['dec', 'neg'].forEach(st =>
      FORMS.forEach(f => all.push(makeCard(verb, f, QWORDS.none, st))));
    (TYPE_QWORDS[verb.type] || TYPE_QWORDS.thing).forEach(qid =>
      formsFor(qid).forEach(f => all.push(makeCard(verb, f, QWORDS[qid], 'q'))));
    return all;
  }
  /* 평서문·부정문에는 의문사가 없으므로 제외 규칙도 적용되지 않는다. */
  if (step.sent !== 'q') return FORMS.map(f => makeCard(verb, f, QWORDS.none, step.sent));
  return formsFor(step.qword).map(f => makeCard(verb, f, QWORDS[step.qword], 'q'));
}

window.DRILL = { FORMS, QWORDS, SENT_INFO, VERBS, stepsForVerb, buildDeck };
