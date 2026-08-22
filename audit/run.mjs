/* =====================================================================
   audit/run.mjs — 파이프라인 일괄 실행

   node audit/run.mjs        추출 → 1차 검수 → 큐 생성 → 보고서
   node audit/run.mjs report 보고서만 다시 생성 (판정을 채운 뒤)
   ===================================================================== */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AUDIT = dirname(fileURLToPath(import.meta.url));
const only  = process.argv[2];
const steps = only === 'report'
  ? ['report.mjs']
  : ['extract.mjs', 'prescreen.mjs', 'review.mjs', 'report.mjs'];

for (const s of steps) {
  console.log(`\n── ${s} ${'─'.repeat(Math.max(0, 50 - s.length))}`);
  const r = spawnSync(process.execPath, [join(AUDIT, s)], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`실패: ${s}`); process.exit(r.status ?? 1); }
}
console.log('\n완료 → audit/REPORT.md');
