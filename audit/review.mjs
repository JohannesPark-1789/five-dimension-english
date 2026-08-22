/* =====================================================================
   audit/review.mjs — 2차 검수 큐 생성

   기계가 판정 못 하는 것(자연스러움·의미·미국 구어 여부)을
   사람/모델이 판정할 수 있게 "검수 단위"로 잘라 배치를 만든다.

   핵심: 2,112개 생성 문장을 다 보지 않는다.
     · 형태 배치(A1) — 187개 템플릿. 문법 적법성은 여기서 결정된다.
     · 어휘 배치(A2) — 동사 27개. 목적어 없이 쓸 수 있는 동사인지만 본다.
     · 문장 배치(B)  — patterns.js 207개. 하나하나 봐야 한다.
     · 단어 배치(C)  — roots.js 367개. 철자·형태소·뜻.
   배치 하나가 한 번의 판정 세션. 순서는 고정(재현 가능).

   출력: audit/out/queue/<배치>.json
        audit/verdicts/<배치>.template.json   (판정 채워 넣을 빈 양식)
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AUDIT = dirname(fileURLToPath(import.meta.url));
const OUT   = join(AUDIT, 'out');
const QUEUE = join(OUT, 'queue');
const VERD  = join(AUDIT, 'verdicts');
mkdirSync(QUEUE, { recursive: true });
mkdirSync(VERD,  { recursive: true });

const { items } = JSON.parse(readFileSync(join(OUT, 'corpus.json'), 'utf8'));
const shapes    = JSON.parse(readFileSync(join(OUT, 'shapes.json'), 'utf8'));
const verbs     = JSON.parse(readFileSync(join(OUT, 'verbs.json'), 'utf8'));

/* 판정 스키마 — 배치 파일 머리에 같이 넣어 둔다.
   verdict  ok      : 미국식으로 정상
            awkward : 문법은 맞지만 원어민이 그렇게 말하지 않음
            error   : 문법 오류 / 비문
            uk      : 문법은 맞으나 영국식
   scope    이 판정이 몇 개 문장에 적용되는지 (형태 배치는 1:N) */
const SCHEMA = {
  verdict: ['ok', 'awkward', 'error', 'uk'],
  fields: { id: '검수 단위 id', verdict: '판정', issue: '무엇이 문제인지(한국어)',
            fix: '고친 문장 / 제안', confidence: 'high|med|low' },
};

const batches = [];
/* axis  primary   : 코퍼스를 겹치지 않게 나눠 갖는 배치 (문장 수 집계 대상)
          secondary : 같은 문장을 다른 축에서 다시 보는 배치 (A2) */
const add = (name, kind, unit, rows, axis = 'primary') =>
  batches.push({ name, kind, unit, rows, axis });

/* 각 검수 단위는 자기가 덮는 코퍼스 id 를 들고 다닌다.
   두 축(A1 형태 · A2 어휘)이 같은 문장을 겹쳐 보므로,
   영향 범위는 합이 아니라 **id 합집합**으로 세야 한다. report.mjs 가 그렇게 센다. */
const gen = items.filter(i => i.tier === 'generated');

/* --- A1. 생성형 템플릿 187개 ---------------------------------------- */
add('A1-형태', 'shape', '템플릿 1개 = 문장 3~6개',
  shapes.map(s => ({
    id: `shape:${s.shape}`, en: s.example, template: s.template,
    sent: s.sent, qword: s.qword, form: s.form, verbType: s.verbType,
    verbs: s.verbs, ids: gen.filter(g => g.shape === s.shape).map(g => g.id),
  })));

/* --- A2. 동사 × 형태군 : 목적어 생략 가능성 ---------------------------
   목적어 자리를 주는 의문사는 what·who 뿐이다. 나머지 5단계
   (기본·where·how·why·when)는 타동사를 목적어 없이 내보낸다.
   목적어를 빼도 되는지는 동사만으로 정해지지 않고 형태에 따라 다르다.
     "Do you buy?"  ✗     "Are you buying?"  △(문맥 생략)
   그래서 11개 시제형을 뒤에 오는 꼴로 3군으로 묶고 동사 × 형태군 으로 본다. */
const OBJECTLESS_QWORDS = ['none', 'where', 'how', 'why', 'when'];
const FORM_FAMILIES = [
  { id: 'finite', label: '한정형 · 뒤가 동사원형',
    forms: ['present', 'past', 'future', 'can', 'haveTo', 'hadTo', 'wantTo', 'wantedTo'],
    sample: (b) => `Do you ${b}? / Where did you ${b}? / Why do you have to ${b}?` },
  { id: 'prog', label: '진행형', forms: ['continuous'],
    sample: (b, i) => `Are you ${i}? / Where are you ${i}?` },
  { id: 'enjoy', label: 'enjoy + -ing', forms: ['enjoy', 'enjoyed'],
    sample: (b, i) => `Do you enjoy ${i}? / Why do you enjoy ${i}?` },
];
/* obj 를 가진 동사는 목적어 문제가 해소됐다 — 검수 대상에서 빠진다. */
add('A2-동사', 'lexical', '동사×형태군 1개 = 목적어 없는 문장 5~40개',
  verbs.filter(v => v.type !== 'intransitive' && !v.obj).flatMap(v =>
    FORM_FAMILIES.map(f => ({
      id: `verb:${v.id}:${f.id}`, en: f.sample(v.base, v.ing),
      base: v.base, type: v.type, family: f.id, familyLabel: f.label,
      ask: '목적어 없이 이 동사가 미국식으로 성립하는가?',
      ids: gen.filter(g => g.meta.verb === v.id
                       && f.forms.includes(g.meta.form)
                       && OBJECTLESS_QWORDS.includes(g.meta.qword)).map(g => g.id),
    }))), 'secondary');

/* --- A3. 동사 × 목적어 결합 -------------------------------------------
   obj 를 도입하면서 새로 생긴 검수 축이다.
   "buy a ticket" 은 자연스럽지만 "buy a knowledge" 는 아니다 —
   기계가 판정할 수 없고, 동사를 늘릴 때마다 늘어난다.
   A1(형태)·A2(목적어 생략)와 같은 문장을 또 보므로 보조축.          */
add('A3-목적어', 'collocation', '동사 1개 = 목적어 들어간 문장 55개',
  verbs.filter(v => v.obj).map(v => ({
    id: `obj:${v.id}`, en: `${v.base} ${v.obj}`, base: v.base, obj: v.obj, objKo: v.objKo,
    ask: '이 동사와 목적어의 결합이 미국식으로 자연스러운가?',
    sample: `Do you ${v.base} ${v.obj}?`,
    ids: gen.filter(g => g.meta.verb === v.id && g.meta.hasObj).map(g => g.id),
  })), 'secondary');

/* --- B. PATTERN DRILL 207개 (25개씩) --------------------------------- */
const pats = items.filter(i => i.tier === 'pattern' || i.tier === 'phrase');
for (let i = 0; i < pats.length; i += 25) {
  add(`B-문장-${String(i / 25 + 1).padStart(2, '0')}`, 'sentence', '문장/구 1개',
    pats.slice(i, i + 25).map(p => ({
      id: p.id, en: p.en, ko: p.ko, kind: p.tier, pattern: p.meta.patternLabel, ids: [p.id],
    })));
}

/* --- C. ROOT DRILL 367개 (60개씩) ------------------------------------ */
const lex = items.filter(i => i.tier === 'lexeme');
for (let i = 0; i < lex.length; i += 60) {
  add(`C-단어-${String(i / 60 + 1).padStart(2, '0')}`, 'lexeme', '단어 1개',
    lex.slice(i, i + 60).map(l => ({
      id: l.id, en: l.en, ko: l.ko, morphemes: l.meta.morphemes,
      literal: l.meta.literal, level: l.meta.level, ids: [l.id],
    })));
}

/* --- D. 코드 하드코딩 ------------------------------------------------ */
const hard = items.filter(i => i.tier === 'hardcoded');
if (hard.length) add('D-코드', 'sentence', '문장 1개',
  hard.map(h => ({ id: h.id, en: h.en, src: h.src, ids: [h.id] })));

/* --- 출력 ------------------------------------------------------------ */
let totalUnits = 0;
const primaryIds = new Set();
for (const b of batches) {
  totalUnits += b.rows.length;
  if (b.axis === 'primary') b.rows.forEach(r => r.ids.forEach(i => primaryIds.add(i)));
  writeFileSync(join(QUEUE, `${b.name}.json`),
    JSON.stringify({ batch: b.name, kind: b.kind, unit: b.unit, axis: b.axis,
                     schema: SCHEMA, count: b.rows.length, rows: b.rows }, null, 1));
  const tpl = join(VERD, `${b.name}.template.json`);
  if (!existsSync(tpl))
    writeFileSync(tpl, JSON.stringify({ batch: b.name, verdicts: b.rows.map(r =>
      ({ id: r.id, verdict: null, issue: '', fix: '', confidence: '' })) }, null, 1));
}

console.log('검수 큐 생성 —', batches.length, '배치');
batches.forEach(b => console.log('  ', b.name.padEnd(12), String(b.rows.length).padStart(4),
  '단위 ·', b.axis === 'secondary' ? '[보조축] ' : '', b.unit));
console.log('  검수 단위 합계:', totalUnits, '→ 커버하는 코퍼스 항목:', primaryIds.size);
if (primaryIds.size !== items.length)
  console.error('  ⚠️ 코퍼스', items.length, '개 중', items.length - primaryIds.size, '개가 어느 배치에도 안 들어갔다');
