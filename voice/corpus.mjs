/* =====================================================================
   voice/corpus.mjs — 발음할 영어 문자열 전수 수집

   앱 문장 대부분은 data.js 가 화면에서 "생성"하므로 소스에 없다.
   이미 그 문제를 푼 도구가 있다 — audit/extract.mjs 는 데이터 모듈을
   실제로 실행해 화면에 뜨는 문자열을 그대로 뽑는다. 다시 만들지 않고 쓴다.
   ===================================================================== */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORPUS = join(ROOT, 'audit', 'out', 'corpus.json');

/* 텍스트 → 파일 이름. 앱(app.js)도 crypto.subtle 로 같은 값을 만든다.
   둘이 어긋나면 오디오를 못 찾고 기기 음성으로 조용히 되돌아간다.  */
export function clipId(text) {
  return createHash('sha1').update(text, 'utf8').digest('hex').slice(0, 20);
}

export function clipPath(slot, id) {
  return join('voice', 'audio', slot, id.slice(0, 2), id + '.mp3');
}

/* 발화 대상 목록. 화면에서 실제로 소리내어 읽는 문자열만 — 어원 카드는
   단어 하나(card.speak)를 읽고, 나머지는 영어 문장(card.en)을 읽는다.
   코퍼스의 en 필드가 둘 다 담고 있다.                                  */
export function loadCorpus({ refresh = false } = {}) {
  if (refresh || !existsSync(CORPUS)) {
    const r = spawnSync(process.execPath, [join(ROOT, 'audit', 'extract.mjs')],
                        { stdio: ['ignore', 'ignore', 'inherit'] });
    if (r.status !== 0) throw new Error('audit/extract.mjs 실패 — 코퍼스를 뽑지 못했다');
  }
  const raw = JSON.parse(readFileSync(CORPUS, 'utf8'));
  const items = Array.isArray(raw) ? raw : (raw.items || raw.corpus);

  /* 같은 영어는 한 번만 변환한다 (고유 4,950 / 전체 4,979).
     tier 는 먼저 만난 것으로 잡는다 — 부분 변환 필터에만 쓰인다. */
  const seen = new Map();
  for (const it of items) {
    const text = String(it.en || '').trim();
    if (!text) continue;
    if (!seen.has(text)) seen.set(text, { text, tier: it.tier, id: clipId(text) });
  }
  return [...seen.values()];
}

export const TIERS = ['generated', 'pattern', 'phrase', 'lexeme', 'hardcoded'];

/* --tier=pattern,lexeme 처리. 없으면 전부.  */
export function filterTiers(list, spec) {
  if (!spec) return list;
  const want = new Set(spec.split(',').map(s => s.trim()).filter(Boolean));
  for (const t of want) {
    if (!TIERS.includes(t)) throw new Error(`모르는 계층: ${t} (가능: ${TIERS.join(', ')})`);
  }
  return list.filter(x => want.has(x.tier));
}
