/* =====================================================================
   audit/report.mjs — 최종 보고서 생성

   1차(기계) + 2차(판정) 결과를 코퍼스에 다시 붙여
   "몇 개 중 몇 개를 실제로 봤고, 무엇이 틀렸는지"를 낸다.

   미검수 구간을 절대 숨기지 않는다 — 커버리지를 먼저 찍는다.

   판정 파일: audit/verdicts/<배치>.json   (.template.json 은 무시)
   출력:     audit/REPORT.md
   ===================================================================== */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AUDIT = dirname(fileURLToPath(import.meta.url));
const OUT   = join(AUDIT, 'out');
const VERD  = join(AUDIT, 'verdicts');

const { items, totals } = JSON.parse(readFileSync(join(OUT, 'corpus.json'), 'utf8'));
const prescreen         = JSON.parse(readFileSync(join(OUT, 'prescreen.json'), 'utf8'));
const queues = readdirSync(join(OUT, 'queue'))
  .map(f => JSON.parse(readFileSync(join(OUT, 'queue', f), 'utf8')));

/* --- 판정 수집 -------------------------------------------------------- */
const verdicts = new Map();
for (const f of readdirSync(VERD)) {
  if (!f.endsWith('.json') || f.endsWith('.template.json')) continue;
  for (const v of JSON.parse(readFileSync(join(VERD, f), 'utf8')).verdicts || [])
    if (v.verdict) verdicts.set(v.id, { ...v, batch: f.replace('.json', '') });
}

/* --- 커버리지 --------------------------------------------------------- */
/* 보조축(A2)은 주축과 같은 문장을 다시 보므로 문장 수 집계에서 뺀다.
   단위 수는 센다 — 판정해야 할 일감이 맞으니까. */
const cov = queues.map(q => {
  const done = q.rows.filter(r => verdicts.has(r.id));
  const sec  = q.axis === 'secondary';
  const n = (rows) => sec ? 0 : new Set(rows.flatMap(r => r.ids || [r.id])).size;
  return { batch: q.batch, axis: q.axis, units: q.rows.length, done: done.length,
           sentences: n(q.rows), covered: n(done) };
});
const sum = (k) => cov.reduce((a, c) => a + c[k], 0);

/* --- 결함 목록 -------------------------------------------------------- */
const rank = { error: 0, uk: 1, awkward: 2, ok: 3 };
const rowOf = new Map();
for (const q of queues) for (const r of q.rows) rowOf.set(r.id, r);

/* 대상이 사라진 판정은 결함이 아니다 — 그 문장은 앱에 더 이상 없다.
   아래 orphans 로 따로 경고하고, 결함 목록에서는 뺀다. */
const defects = [...verdicts.values()]
  .filter(v => v.verdict && v.verdict !== 'ok' && rowOf.has(v.id))
  .sort((a, b) => (rank[a.verdict] ?? 9) - (rank[b.verdict] ?? 9));

/* 판정은 있는데 대상이 큐에 없다 = 데이터가 바뀌어 그 문장이 사라졌다.
   옛 판정이 유령처럼 남아 보고서를 오염시키므로 반드시 드러낸다. */
const orphans = [...verdicts.keys()].filter(id => !rowOf.has(id));

/* 대상은 그대로인데 **문장이 바뀐** 경우. id 만 보면 안 걸린다.
   판정할 때 박아 둔 en 과 지금 en 을 대조해서, 고친 뒤 재판정을 안 한
   판정을 드러낸다 — 안 그러면 이미 고친 것이 계속 결함으로 잡힌다. */
const stale = [...verdicts.values()].filter(v => {
  const r = rowOf.get(v.id);
  return r && v.en !== undefined && r.en !== undefined && v.en !== r.en;
});

const md = [];
md.push('# 5차원 영어 — 영어 문장 전수 검수 보고서', '');
md.push('## 1. 코퍼스', '',
  `| 계층 | 항목 수 |`, `|---|---|`,
  ...Object.entries(totals.byTier).map(([k, n]) => `| ${k} | ${n} |`),
  `| **합계** | **${totals.items}** (고유 ${totals.uniqueEn}) |`, '');

md.push('## 2. 검수 커버리지', '',
  `| 배치 | 검수 단위 | 판정 완료 | 대상 문장 | 커버된 문장 |`, `|---|---|---|---|---|`,
  ...cov.map(c => `| ${c.batch}${c.axis === 'secondary' ? ' _(보조축)_' : ''} `
    + `| ${c.units} | ${c.done} | ${c.sentences || '—'} | ${c.covered || '—'} |`),
  `| **합계** | **${sum('units')}** | **${sum('done')}** | **${sum('sentences')}** | **${sum('covered')}** |`,
  '',
  '> 보조축(A2 동사)은 주축과 **같은 문장을 어휘 축에서** 다시 보는 배치라 문장 수 집계에서 뺀다.',
  '',
  sum('done') < sum('units')
    ? `> ⚠️ 미판정 ${sum('units') - sum('done')}단위 — 아직 전수 검수가 끝나지 않았다.`
    : '> 전 단위 판정 완료.',
  '',
  stale.length
    ? `> ⚠️ 문장이 바뀐 뒤 재판정 안 된 판정 ${stale.length}건: `
      + stale.slice(0, 6).map(v => v.id).join(', ')
      + (stale.length > 6 ? ` 외 ${stale.length - 6}건` : '')
    : '',
  '',
  orphans.length
    ? `> ⚠️ 대상이 사라진 판정 ${orphans.length}건 — 데이터가 바뀌었다. `
      + `\`audit/verdicts/\` 에서 정리할 것: ${orphans.slice(0, 8).join(', ')}`
      + (orphans.length > 8 ? ` 외 ${orphans.length - 8}건` : '')
    : '',
  '');

md.push('## 3. 1차 기계 검수', '',
  `- 검사 ${prescreen.scanned}건 · 지적 ${prescreen.findings.length}건 — ${JSON.stringify(prescreen.bySev)}`,
  '', '| 심각도 | 규칙 | 대상 | 영어 | 지적 |', '|---|---|---|---|---|',
  ...prescreen.findings.map(f => `| ${f.sev} | ${f.rule} | ${f.id} | \`${f.en}\` | ${f.msg} |`), '');

md.push('## 4. 2차 판정 결함', '');
if (!defects.length) {
  md.push(sum('done') === 0
    ? '_아직 판정 결과 없음. `audit/verdicts/<배치>.json` 을 채우고 다시 실행._'
    : '**결함 없음.** 판정한 전 단위가 `ok` 다. 다만 "봤다"는 것이지 '
      + '"모든 관점에서 봤다"는 뜻은 아니다 — `ARCHITECTURE.md` §8 의 미커버 축을 볼 것.', '');
} else {
  md.push('| 판정 | 대상 | 영어 | 문제 | 제안 | 영향 문장 |', '|---|---|---|---|---|---|',
    ...defects.map(d => {
      const r = rowOf.get(d.id) || {};
      return `| ${d.verdict} | ${d.id} | \`${r.en || ''}\` | ${d.issue} | ${d.fix} | ${(r.ids || [d.id]).length} |`;
    }), '');
  /* 두 축이 겹치므로 영향 범위는 합이 아니라 합집합 */
  const hit = (list) => new Set(list.flatMap(d => (rowOf.get(d.id) || {}).ids || [d.id]));
  const all = hit(defects);
  const err = hit(defects.filter(d => d.verdict === 'error'));
  md.push(`**결함 ${defects.length}건 — 서로 다른 문장 ${all.size}개에 영향** `
        + `(그중 \`error\` ${err.size}개 · 코퍼스의 ${(all.size / totals.items * 100).toFixed(1)}%).`, '');
}

/* --- 5. 참고 — ok 판정이지만 메모가 달린 것 --------------------------
   영어 문법 문제는 아니지만 알고 있어야 할 것들(수정 반영 기록, 패턴 라벨,
   학습자가 헷갈리는 지점, 한국어와의 어긋남). 결함 수에는 안 넣는다. */
const notes = [...verdicts.values()].filter(v => v.verdict === 'ok' && v.issue && rowOf.has(v.id));
md.push('## 5. 참고 — 결함은 아니지만 메모', '');
if (!notes.length) md.push('_없음._', '');
else md.push(`${notes.length}건.`, '', '| 대상 | 영어 | 메모 |', '|---|---|---|',
  ...notes.map(v => `| ${v.id} | \`${(rowOf.get(v.id) || {}).en || ''}\` | ${v.issue} |`), '');

writeFileSync(join(AUDIT, 'REPORT.md'), md.join('\n'));
console.log('보고서 생성 — audit/REPORT.md');
console.log(`  판정 ${sum('done')}/${sum('units')} 단위 · 결함 ${defects.length}건`);
