/* =====================================================================
   voice/compare.mjs — 같은 문장을 두 모델로 만들어 귀로 비교한다

   ELEVENLABS_API_KEY=... node voice/compare.mjs

   전체 변환에 253,594 크레딧을 쓰기 전에, 값이 절반인 Flash 로 충분한지
   직접 들어보고 정하기 위한 것. 표본 여덟 문장이라 600 크레딧쯤 든다.

   결과: voice/compare/{female,male}/01-...__v2.mp3 · 01-...__flash.mp3
        이름이 나란히 정렬되므로 파일 관리자에서 번갈아 들으면 된다.
   ===================================================================== */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCorpus, ROOT } from './corpus.mjs';
import { FORMAT, VOICES, VOICE_SETTINGS, API, CREDITS_PER_CHAR } from './config.mjs';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('ELEVENLABS_API_KEY 가 없다. voice/README.md 참조.'); process.exit(1); }
const H = { 'xi-api-key': KEY, 'Content-Type': 'application/json' };

const MODELS = [
  { id: 'eleven_multilingual_v2', tag: 'v2'    },
  { id: 'eleven_flash_v2_5',      tag: 'flash' },
];

/* 계층마다 골라 담는다 — 짧은 드릴 문장부터 긴 교재 문장, 단어까지.
   발음 판단이 갈리는 것들이 섞여야 비교에 뜻이 있다.                  */
const corpus = loadCorpus();
const pick = (tier, n) => corpus.filter(x => x.tier === tier).slice(0, n);
const sample = [
  ...pick('generated', 3),
  ...pick('pattern', 2),
  ...pick('phrase', 1),
  ...pick('lexeme', 2),
];

const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

async function tts(text, voiceId, modelId) {
  const r = await fetch(`${API}/text-to-speech/${voiceId}?output_format=${FORMAT}`, {
    method: 'POST', headers: H,
    body: JSON.stringify({ text, model_id: modelId, voice_settings: VOICE_SETTINGS }),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

const chars   = sample.reduce((n, x) => n + x.text.length, 0);
const credits = MODELS.reduce((n, m) => n + chars * CREDITS_PER_CHAR[m.id], 0) * VOICES.length;
console.log(`표본 ${sample.length}문장 · ${chars}자 × 모델 ${MODELS.length} × 목소리 ${VOICES.length}`);
console.log(`→ 약 ${Math.round(credits).toLocaleString()} 크레딧\n`);

let n = 0;
for (const v of VOICES) {
  const dir = join(ROOT, 'voice', 'compare', v.slot);
  mkdirSync(dir, { recursive: true });
  for (const [i, item] of sample.entries()) {
    for (const m of MODELS) {
      const name = `${String(i + 1).padStart(2, '0')}-${slug(item.text)}__${m.tag}.mp3`;
      writeFileSync(join(dir, name), await tts(item.text, v.id, m.id));
      n++;
      process.stdout.write(`\r  ${n} / ${sample.length * MODELS.length * VOICES.length} 만듦  `);
    }
  }
}
process.stdout.write('\n');

console.log('\n들어볼 파일 → voice/compare/');
for (const [i, item] of sample.entries()) {
  console.log(`  ${String(i + 1).padStart(2, '0')}  [${item.tier}] ${item.text}`);
}
console.log(`
__v2 와 __flash 를 번갈아 들어보고 정한다.
  차이가 들리지 않으면  → EL_MODEL=eleven_flash_v2_5 (Creator 플랜에서 추가 약 $2)
  v2 가 확실히 낫다면    → 기본값 그대로 (3개월에 나눠 하면 추가 $0)`);
