/* =====================================================================
   audit/prescreen.mjs — 1차 기계 검수 (결정론적 규칙)

   판단이 필요 없는 것만 여기서 걸러낸다.
   "미국식이냐"가 문자열만 보고 판정되는 항목 — 영국식 철자, 문장부호,
   대소문자, 형태소 규칙, 중복. 의미·자연스러움 판정은 2차(review)로 넘긴다.

   출력: audit/out/prescreen.json · audit/out/prescreen.md
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'out');
const { items } = JSON.parse(readFileSync(join(OUT, 'corpus.json'), 'utf8'));
const shapes    = JSON.parse(readFileSync(join(OUT, 'shapes.json'), 'utf8'));

const findings = [];
const flag = (rule, sev, item, msg, fix) =>
  findings.push({ rule, sev, id: item.id, src: item.src, en: item.en, msg, fix: fix || null });

/* --- R1. 영국식 철자 ------------------------------------------------- */
const BRITISH = [
  [/\bcolour/i, 'color'], [/\bfavourite/i, 'favorite'], [/\bhonour/i, 'honor'],
  [/\bbehaviour/i, 'behavior'], [/\blabour/i, 'labor'], [/\bneighbour/i, 'neighbor'],
  [/\bcentre\b/i, 'center'], [/\btheatre\b/i, 'theater'], [/\blitre/i, 'liter'],
  [/\bmetre\b/i, 'meter'], [/\bfibre\b/i, 'fiber'], [/\bdefence\b/i, 'defense'],
  [/\boffence\b/i, 'offense'], [/\bpractise\b/i, 'practice'], [/\banalyse/i, 'analyze'],
  [/\bparalyse/i, 'paralyze'], [/\borganis(e|ation|ing|ed)/i, 'organiz-'],
  [/\brealis(e|ing|ed)/i, 'realiz-'], [/\brecognis(e|ing|ed)/i, 'recogniz-'],
  [/\bapologis(e|ing|ed)/i, 'apologiz-'], [/\bcatalogue\b/i, 'catalog'],
  [/\btravell(ed|ing|er)/i, 'travel- (l 하나)'], [/\bcancell(ed|ing)/i, 'cancel- (l 하나)'],
  [/\blabell(ed|ing)/i, 'label- (l 하나)'], [/\bgrey\b/i, 'gray'],
  [/\baluminium\b/i, 'aluminum'], [/\bprogramme\b/i, 'program'],
  [/\bwhilst\b/i, 'while'], [/\bamongst\b/i, 'among'], [/\bmaths\b/i, 'math'],
  [/\blearnt\b/i, 'learned'], [/\bspelt\b/i, 'spelled'], [/\bdreamt\b/i, 'dreamed'],
  [/\bburnt\b/i, 'burned'], [/\bjewellery\b/i, 'jewelry'], [/\bcounsellor\b/i, 'counselor'],
  [/\bmarvellous\b/i, 'marvelous'], [/\bjudgement\b/i, 'judgment'], [/\bageing\b/i, 'aging'],
  [/\bartefact\b/i, 'artifact'], [/\bsceptic/i, 'skeptic'], [/\bfoetus\b/i, 'fetus'],
  [/\bpaediatric/i, 'pediatric'], [/\bencyclopaedia\b/i, 'encyclopedia'],
  [/\banaesthe/i, 'anesthe-'], [/\bmould\b/i, 'mold'], [/\bplough\b/i, 'plow'],
  [/\btyre\b/i, 'tire'], [/\bpyjamas\b/i, 'pajamas'], [/\bcheque\b/i, 'check'],
  [/\bstorey\b/i, 'story'], [/\baeroplane\b/i, 'airplane'], [/\bkerb\b/i, 'curb'],
];

/* --- R2. 영국식 관용·전치사 ------------------------------------------ */
const BRIT_IDIOM = [
  [/\bdifferent to\b/i, 'different from'], [/\bin hospital\b/i, 'in the hospital'],
  [/\bat the weekend\b/i, 'on the weekend'], [/\bat university\b/i, 'in college'],
  [/\bhave got to\b/i, 'have to'], [/\bin the team\b/i, 'on the team'],
  [/\bgo to hospital\b/i, 'go to the hospital'], [/\bat the back of\b/i, 'in back of / behind'],
];

for (const it of items) {
  const en = it.en;
  for (const [re, fix] of BRITISH)
    if (re.test(en)) flag('R1-영국식철자', 'error', it, `영국식 철자 (${re.source})`, fix);
  for (const [re, fix] of BRIT_IDIOM)
    if (re.test(en)) flag('R2-영국식관용', 'warn', it, `영국식 표현 (${re.source})`, fix);

  /* --- R3. 문장부호 · 공백 ------------------------------------------ */
  if (/\s{2,}/.test(en))    flag('R3-공백', 'error', it, '연속 공백');
  if (en !== en.trim())     flag('R3-공백', 'error', it, '앞뒤 공백');
  if (/\s+[.,?!]/.test(en)) flag('R3-문장부호', 'error', it, '구두점 앞 공백');
  if (/[‘’“”]/.test(en))
    flag('R3-문장부호', 'warn', it, '둥근 따옴표 — 직선 따옴표로 통일 권장');
  if (/[^\x20-\x7E]/.test(en) && it.tier !== 'lexeme')
    flag('R3-비ASCII', 'warn', it, '영어 필드에 비ASCII 문자');

  /* --- R4. 대소문자 · 종결부호 (완전한 문장만) ---------------------- */
  if (it.tier === 'generated' || it.tier === 'pattern') {
    if (!/^[A-Z"']/.test(en)) flag('R4-대문자', 'error', it, '문장이 소문자로 시작');
    if (!/[.?!]$/.test(en))   flag('R4-종결부호', 'error', it, '종결 부호 없음');
    if (/^(Do|Does|Did|Are|Is|Will|Can|What|Where|How|Why|When|Who)\b/.test(en) && !/\?$/.test(en))
      flag('R4-종결부호', 'error', it, '의문문인데 물음표 없음');
  }

  /* --- R5. 어원 카드: 형태소 결합이 표제어와 맞는지 ------------------
     형태소를 이어 붙였을 때 나오는 문자열을 표제어와 대조한다.
       완전 일치            → 정상
       표제어가 그걸로 시작 → 접미사만 생략한 것 (psych+logy 아님, e+vid 같은 것). 정상.
       그 외                → 결합 실패. 연결모음이 빠졌거나(psycho→psych)
                              철자 변화를 반영 안 했다(rely→reli).                */
  if (it.tier === 'lexeme') {
    const joined = it.meta.morphemes.replace(/\+/g, '').toLowerCase();
    const word   = en.toLowerCase();
    if (joined !== word && !word.startsWith(joined))
      flag('R5-형태소', 'error', it,
        `형태소를 이어 붙이면 "${joined}" 인데 표제어는 "${word}"`,
        '연결모음·철자 변화 반영');
    if (/[^a-z-]/.test(word)) flag('R5-표제어', 'warn', it, '표제어에 영문자 외 문자');
  }
}

/* --- R6. 중복: 같은 영어인데 한국어가 다름 --------------------------- */
const byEn = new Map();
for (const it of items) {
  if (it.tier === 'lexeme') continue;
  if (!byEn.has(it.en)) byEn.set(it.en, []);
  byEn.get(it.en).push(it);
}
for (const [, group] of byEn) {
  if (group.length < 2) continue;
  const kos = new Set(group.map(g => g.ko));
  flag('R6-중복', kos.size > 1 ? 'warn' : 'info', group[0],
    `동일 영어 ${group.length}회 (${group.map(g => g.id).join(', ')})`
    + (kos.size > 1 ? ` · 한국어 불일치: ${[...kos].join(' / ')}` : ''));
}

/* --- R7. 생성형 템플릿의 구조적 위험 ---------------------------------
   목적어를 채워 주는 의문사는 what·who 둘뿐이다.
   나머지 단계(기본·where·how·why·when)는 타동사를 목적어 없이 내보낸다.
     What do you buy?   ← 목적어 = what
     Where do you buy?  ← 목적어 없음. "Where do you buy it?" 이어야 한다.
   한국어는 목적어를 자유롭게 생략하므로 대응 한국어("어디서 사니?")는
   멀쩡하다. 그래서 눈으로는 잘 안 걸린다.                             */
for (const s of shapes) {
  /* 템플릿 구조가 아니라 **실제로 목적어가 들어갔는지**로 본다.
     동사에 obj 를 붙인 뒤로는 남는 것이 곧 진짜 문제다. */
  if (s.objless.length)
    flag('R7-목적어없음', 'review', { id: `shape:${s.shape}`, src: 'data.js', en: s.example },
      `타동사인데 목적어가 없는 동사 ${s.objless.length}개: ${[...new Set(s.objless)].join(', ')}`,
      'data.js 의 해당 동사에 obj·objKo 추가');
  /* 목적격 who — 미국 구어에서는 who 가 표준, 격식체는 whom */
  if (s.qword === 'who')
    flag('R7-whom', 'review', { id: `shape:${s.shape}`, src: 'data.js', en: s.example },
      `목적격 의문사 who · 인스턴스 ${s.count}개`,
      '구어 미국영어는 who 로 정상. 격식 표기가 목표면 whom');
}

/* --- R8. 동사 사전의 -ing 파생이 철자 규칙과 맞는지 ------------------
   data.js 는 ing 형을 손으로 적어 둔다. 자음 중복·묵음 e 탈락 규칙을
   기계로 재현해 대조한다. 규칙 예외(관용)는 화이트리스트로 뺀다.     */
const ingOf = (b) => {
  if (/[^aeiou]e$/.test(b))                       return b.slice(0, -1) + 'ing';   // make → making
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(b))    return b + b.slice(-1) + 'ing';  // run → running
  return b + 'ing';
};
const ING_OK = new Set(['opening', 'listening']);   // 2음절·비강세 — 중복 안 함
for (const v of (JSON.parse(readFileSync(join(OUT, 'verbs.json'), 'utf8')) || [])) {
  const expect = ingOf(v.base);
  if (expect !== v.ing && !ING_OK.has(v.ing))
    flag('R8-ing철자', 'warn', { id: `verb:${v.id}`, src: 'data.js', en: v.ing },
      `${v.base} → ${v.ing} · 규칙 예측은 ${expect}`, expect);
}

/* --- R9. 상태동사 금지 -----------------------------------------------
   드릴은 모든 동사를 진행형(Are you ~ing?)으로 굴린다.
   상태동사는 진행형이 안 되므로 동사 사전에 들어오면 안 된다.
   동사를 늘릴 때 제일 밟기 쉬운 지뢰라 기계로 막는다.                */
const STATIVE = new Set([
  'know', 'believe', 'like', 'love', 'hate', 'want', 'need', 'own', 'belong',
  'seem', 'understand', 'remember', 'forget', 'prefer', 'contain', 'consist',
  'resemble', 'suppose', 'mean', 'matter', 'deserve', 'exist', 'possess',
]);
for (const v of JSON.parse(readFileSync(join(OUT, 'verbs.json'), 'utf8'))) {
  if (STATIVE.has(v.base))
    flag('R9-상태동사', 'error', { id: `verb:${v.id}`, src: 'data.js', en: `Are you ${v.ing}?` },
      `상태동사 ${v.base} — 진행형이 성립하지 않는다`, '동사 사전에서 제외');
}

/* --- 출력 ------------------------------------------------------------ */
const order = { error: 0, warn: 1, review: 2, info: 3 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.rule.localeCompare(b.rule));
const byRule = findings.reduce((a, f) => (a[f.rule] = (a[f.rule] || 0) + 1, a), {});
const bySev  = findings.reduce((a, f) => (a[f.sev]  = (a[f.sev]  || 0) + 1, a), {});

writeFileSync(join(OUT, 'prescreen.json'),
  JSON.stringify({ scanned: items.length, bySev, byRule, findings }, null, 1));

const md = ['# 1차 기계 검수 결과', '',
  `- 검사 항목: **${items.length}**`,
  `- 지적 사항: **${findings.length}** — ${JSON.stringify(bySev)}`, '',
  '| 규칙 | 건수 |', '|---|---|',
  ...Object.entries(byRule).map(([r, n]) => `| ${r} | ${n} |`), '',
  '## 상세', '',
  '| 심각도 | 규칙 | 출처 | 영어 | 지적 | 제안 |', '|---|---|---|---|---|---|',
  ...findings.map(f => `| ${f.sev} | ${f.rule} | ${f.id} | \`${f.en}\` | ${f.msg} | ${f.fix || ''} |`),
].join('\n');
writeFileSync(join(OUT, 'prescreen.md'), md);

console.log('1차 검수 완료 —', findings.length, '건');
console.log('  심각도:', JSON.stringify(bySev));
console.log('  규칙별:', JSON.stringify(byRule, null, 1));
