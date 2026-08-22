/* =====================================================================
   audit/extract.mjs — 영어 코퍼스 전수 추출기

   앱의 영어 문장은 대부분 "저장"되어 있지 않고 "생성"된다.
   (data.js: 동사 × 시제형 × 의문사 조합)
   따라서 grep 으로는 전수 추출이 불가능하다 —
   실제 데이터 모듈을 실행해서 카드 생성 함수를 전부 돌린다.

   출력: audit/out/corpus.json  (모든 영어 문자열 + 출처)
        audit/out/shapes.json  (생성형 문장의 고유 템플릿 = 실제 검수 단위)
        audit/out/corpus.tsv   (사람이 훑어보기용)
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'audit', 'out');
mkdirSync(OUT, { recursive: true });   // out/ 은 gitignore 대상 — 새로 클론하면 없다

/* --- 데이터 모듈을 브라우저 흉내 샌드박스에서 실행 ------------------ */
function loadModules(files) {
  const win = {};
  const ctx = createContext({ window: win, console });
  for (const f of files) {
    runInContext(readFileSync(join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  return win;
}

const win = loadModules(['data.js', 'patterns.js', 'roots.js']);
const { FORMS, QWORDS, VERBS, stepsForVerb, buildDeck } = win.DRILL;
const { PATTERNS, SENTENCES }                           = win.PATTERN;
const { ROOTS }                                         = win.ROOT;

const corpus = [];
const pad = (n, w = 4) => String(n).padStart(w, '0');

/* --- ① BASIC DRILL : 생성형 문장 ------------------------------------
   buildDeck 를 모든 (동사 × 단계) 조합으로 돌려 실제 화면에 뜨는
   카드를 그대로 재현한다. '종합' 단계는 재조합일 뿐이라 중복 제거.   */
const seenGen = new Set();
for (const verb of VERBS) {
  const steps = stepsForVerb(verb);
  steps.forEach((step, i) => {
    if (step.sent === '__all__') return;               // 재조합 단계 — 새 문장 없음
    for (const card of buildDeck(verb, i)) {
      /* 문형 축이 붙었다. 의문문 id 는 예전 그대로 두어(의문사 이름) 기존 판정이
         계속 붙게 하고, 평서·부정만 새 이름(dec·neg)을 쓴다. 충돌하지 않는다. */
      const axis = card.sentType === 'q' ? card.qwordId : card.sentType;
      const id = `gen:${verb.id}:${axis}:${card.formId}`;
      if (seenGen.has(id)) continue;
      seenGen.add(id);
      corpus.push({
        id, tier: 'generated', src: 'data.js',
        en: card.en, ko: card.ko,
        shape: `${axis}|${card.formId}|${verb.type || 'thing'}`,
        meta: { verb: verb.id, verbType: verb.type || 'thing',
                form: card.formId, qword: card.qwordId, sent: card.sentType,
                step: step.title,
                /* 이 문장에 목적어가 들어갔는지. 의문사가 목적어인 단계(what·who)와
                   목적어가 없는 동사(자동사·sing)는 false 다. */
                hasObj: Boolean(verb.obj) && card.qwordId !== 'what' && card.qwordId !== 'who' },
      });
    }
  });
}

/* --- ② PATTERN DRILL : 고정 문장/구 ---------------------------------
   완전한 문장과 명사구·부사구가 섞여 있다.
   구(fragment)는 문장부호가 없고 소문자로 시작하는 것으로 판별.      */
const patLabel = Object.fromEntries(PATTERNS.map(p => [p.id, p.label]));
SENTENCES.forEach((s, i) => {
  const isFragment = !/[.?!]$/.test(s.en.trim());
  corpus.push({
    id: `pat:${pad(i)}`, tier: isFragment ? 'phrase' : 'pattern', src: 'patterns.js',
    en: s.en, ko: s.ko, shape: s.p,
    meta: { pattern: s.p, patternLabel: patLabel[s.p] || '?', index: i },
  });
});

/* --- ③ ROOT DRILL : 단어 · 형태소 -----------------------------------
   문장은 아니지만 철자(미/영)·형태소 분해가 검수 대상이다.           */
for (const r of ROOTS) {
  for (const w of r.words) {
    corpus.push({
      id: `root:${r.id}:${w.w}`, tier: 'lexeme', src: 'roots.js',
      en: w.w, ko: w.m, shape: r.id,
      meta: { root: r.root, rootGroup: r.group, origin: r.origin,
              morphemes: w.p.map(x => x[0]).join('+'), literal: w.b, level: w.lv },
    });
  }
}

/* --- ④ 코드에 박힌 영어 (TTS 워밍업 등) ----------------------------- */
for (const f of ['app.js', 'index.html']) {
  const text = readFileSync(join(ROOT, f), 'utf8');
  const re = /speak\(\s*'([^']+)'\s*\)/g;
  let m, n = 0;
  while ((m = re.exec(text))) {
    corpus.push({ id: `code:${f}:${n++}`, tier: 'hardcoded', src: f,
                  en: m[1], ko: '', shape: 'literal', meta: {} });
  }
}

/* --- 생성형 템플릿(=실제 검수 단위) 집계 ----------------------------
   2,000개 인스턴스를 다 볼 필요가 없다.
   문법적 적법성은 (의문사 × 시제형 × 동사종류) 형태에서 결정되고,
   동사는 슬롯일 뿐이다. 형태를 먼저 판정하고 어휘는 따로 본다.       */
const shapes = new Map();
for (const c of corpus) {
  if (c.tier !== 'generated') continue;
  if (!shapes.has(c.shape)) {
    shapes.set(c.shape, {
      shape: c.shape, qword: c.meta.qword, sent: c.meta.sent,
      form: c.meta.form, verbType: c.meta.verbType,
      template: c.en.replace(new RegExp(`\\b${c.meta.verb}(ing)?\\b`), m => `{${m}}`),
      example: c.en, count: 0, verbs: [], objless: [],
    });
  }
  const s = shapes.get(c.shape);
  s.count++; s.verbs.push(c.meta.verb);
  /* what·who 단계는 의문사가 곧 목적어다 — 목적어 없음으로 세면 안 된다. */
  if (!c.meta.hasObj && c.meta.verbType !== 'intransitive'
      && c.meta.qword !== 'what' && c.meta.qword !== 'who') s.objless.push(c.meta.verb);
}

/* --- 출력 ----------------------------------------------------------- */
const byTier = corpus.reduce((a, c) => (a[c.tier] = (a[c.tier] || 0) + 1, a), {});
const uniqueEn = new Set(corpus.map(c => c.en)).size;

writeFileSync(join(OUT, 'corpus.json'),
  JSON.stringify({ generatedAt: null, totals: { items: corpus.length, uniqueEn, byTier,
                   generatedShapes: shapes.size }, items: corpus }, null, 1));
writeFileSync(join(OUT, 'shapes.json'),
  JSON.stringify([...shapes.values()].sort((a, b) => a.shape.localeCompare(b.shape)), null, 1));
writeFileSync(join(OUT, 'verbs.json'),
  JSON.stringify(VERBS.map(v => ({ id: v.id, base: v.base, ing: v.ing,
                                   type: v.type || 'thing', meaning: v.meaning,
                                   obj: v.obj || null, objKo: v.objKo || null })), null, 1));
writeFileSync(join(OUT, 'corpus.tsv'),
  ['id\ttier\tsrc\ten\tko',
   ...corpus.map(c => [c.id, c.tier, c.src, c.en, c.ko].join('\t'))].join('\n'));

console.log('추출 완료');
console.log('  총 항목        :', corpus.length);
console.log('  고유 영어 문자열:', uniqueEn);
console.log('  계층별         :', JSON.stringify(byTier));
console.log('  생성형 템플릿  :', shapes.size, '(→ 실제 형태 검수 단위)');
