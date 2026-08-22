/* =====================================================================
   voice/estimate.mjs — 변환 비용·용량 추정 (API 호출 없음)

   node voice/estimate.mjs                     전체
   node voice/estimate.mjs --tier=pattern      교재 문장만
   EL_MODEL=eleven_flash_v2_5 node voice/estimate.mjs
   ===================================================================== */
import { existsSync, statSync } from 'node:fs';
import { loadCorpus, filterTiers, clipPath, ROOT } from './corpus.mjs';
import { MODEL, CREDITS_PER_CHAR, FORMAT, BYTES_PER_SEC, VOICES } from './config.mjs';
import { join } from 'node:path';

const arg = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];

/* 플랜별 월 크레딧 · 초과분 단가.
   월 요금과 크레딧은 공식 요금표, 초과 단가는 공개된 추정치다 (플랜 화면에서 확인 필요). */
const PLANS = [
  { name: 'Free',     usd: 0,   credits: 10_000,    over: null  },
  { name: 'Starter',  usd: 6,   credits: 30_000,    over: 0.30  },
  { name: 'Creator',  usd: 22,  credits: 121_000,   over: 0.30  },
  { name: 'Pro',      usd: 99,  credits: 600_000,   over: 0.24  },
  { name: 'Scale',    usd: 299, credits: 1_800_000, over: 0.18  },
  { name: 'Business', usd: 990, credits: 6_000_000, over: 0.12  },
];

const all   = loadCorpus();
const list  = filterTiers(all, arg('tier'));
const rate  = CREDITS_PER_CHAR[MODEL];
if (!rate) throw new Error(`크레딧 단가를 모르는 모델: ${MODEL}`);

const chars    = list.reduce((n, x) => n + x.text.length, 0);
const perVoice = Math.round(chars * rate);
const credits  = perVoice * VOICES.length;

/* 이미 만들어 둔 것은 다시 안 만든다 — 남은 비용도 같이 보여준다. */
let done = 0, doneBytes = 0;
for (const v of VOICES) for (const x of list) {
  const p = join(ROOT, clipPath(v.slot, x.id));
  if (existsSync(p)) { done++; doneBytes += statSync(p).size; }
}
const todo        = VOICES.length * list.length - done;
const todoCredits = Math.round(credits * (todo / (VOICES.length * list.length || 1)));

/* 용량 — 영어는 대략 초당 15자로 읽는다. 앞뒤 여백 0.3초를 더한다. */
const secs  = chars / 15 + list.length * 0.3;
const bytes = secs * (BYTES_PER_SEC[FORMAT] || 4000) * VOICES.length;
const mb    = n => (n / 1024 / 1024).toFixed(1) + ' MB';

const byTier = {};
for (const x of list) {
  const t = byTier[x.tier] || (byTier[x.tier] = { n: 0, chars: 0 });
  t.n++; t.chars += x.text.length;
}

console.log(`
문장 ────────────────────────────────────────────────`);
for (const [t, v] of Object.entries(byTier)) {
  console.log(`  ${t.padEnd(10)} ${String(v.n).padStart(5)}개   ${String(v.chars).padStart(7)}자`);
}
console.log(`  ${'합계'.padEnd(9)} ${String(list.length).padStart(5)}개   ${String(chars).padStart(7)}자   (고유 문자열만, 중복 제외)`);

console.log(`
변환 ────────────────────────────────────────────────
  모델        ${MODEL}  (${rate} 크레딧/문자)
  목소리      ${VOICES.map(v => `${v.name}(${v.slot})`).join(' · ')}  → ${VOICES.length}배
  포맷        ${FORMAT}

  크레딧      목소리당 ${perVoice.toLocaleString()}  ·  전체 ${credits.toLocaleString()}
  파일        ${(VOICES.length * list.length).toLocaleString()}개   약 ${mb(bytes)}   (재생 시간 약 ${Math.round(secs / 60)}분)
  진행        완료 ${done.toLocaleString()} / 남음 ${todo.toLocaleString()}  → 남은 크레딧 ${todoCredits.toLocaleString()}${done ? `   (내려받은 용량 ${mb(doneBytes)})` : ''}

플랜별 추가 비용 ────────────────────────────────────`);
for (const p of PLANS) {
  const over = Math.max(0, credits - p.credits);
  let note;
  if (over === 0) note = '월 할당량 안에서 끝 → 추가 $0';
  else if (p.over == null) note = `${over.toLocaleString()} 초과 · 무료 플랜은 초과 결제가 없어 불가`;
  else {
    const extra = (over / 1000) * p.over;
    const months = Math.ceil(credits / p.credits);
    note = `${over.toLocaleString()} 초과 → 약 $${extra.toFixed(2)}` +
           (months > 1 ? `  또는 ${months}개월에 나눠 하면 $0` : '');
  }
  console.log(`  ${p.name.padEnd(9)} $${String(p.usd).padStart(4)}/월  ${String(p.credits.toLocaleString()).padStart(9)} 크레딧   ${note}`);
}
console.log(`
  초과 단가는 $/1,000크레딧 기준 공개 추정치다. 결제 전 ElevenLabs
  플랜 화면에서 실제 단가를 확인할 것. 월 할당량은 매달 초기화되므로
  큰 변환은 달을 걸쳐 나누면 추가 비용 없이 끝난다.
`);
