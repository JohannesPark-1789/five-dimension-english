/* =====================================================================
   voice/generate.mjs — 문장을 ElevenLabs 음성 파일로 변환

   ELEVENLABS_API_KEY=... node voice/generate.mjs [옵션]

     --tier=pattern,lexeme   일부 계층만 (기본: 전부)
     --voice=female          한쪽 목소리만
     --limit=20              앞에서 N개만 — 소리 확인용 시험 변환
     --dry                   호출 없이 계획만
     --force                 남은 크레딧이 부족해도 진행

   이미 있는 파일은 건너뛴다. 중간에 끊겨도 다시 실행하면 이어서 한다.
   ===================================================================== */
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { loadCorpus, filterTiers, clipPath, ROOT } from './corpus.mjs';
import { MODEL, CREDITS_PER_CHAR, FORMAT, VOICES, VOICE_SETTINGS, API } from './config.mjs';

const argv = process.argv.slice(2);
const flag = k => argv.includes(`--${k}`);
const opt  = k => (argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];

const DRY   = flag('dry');
const KEY   = process.env.ELEVENLABS_API_KEY;
if (!KEY && !DRY) {
  console.error('ELEVENLABS_API_KEY 가 없다. voice/README.md 의 「키 넘기는 법」 참조.');
  process.exit(1);
}

const H = { 'xi-api-key': KEY, 'Content-Type': 'application/json' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(path) {
  const r = await fetch(API + path, { headers: H });
  if (!r.ok) {
    const e = new Error(`GET ${path} → ${r.status} ${await r.text()}`);
    e.status = r.status;
    throw e;
  }
  return r.json();
}
/* 오류에서 사람이 읽을 한 줄만 뽑는다 — ElevenLabs 는 detail.message 에 담는다.
   Error 든 저장해 둔 문자열이든 받는다(문자열은 "400 {...}" 꼴로 앞에 코드가 있다). */
function why(e) {
  const raw    = String((e && e.message) || e || '');
  const status = (e && e.status) || (/^(\d{3})\s/.exec(raw) || [])[1] || '';
  let msg = raw.slice(0, 200);
  const m = /\{[\s\S]*\}/.exec(raw);
  if (m) {
    try {
      const d = JSON.parse(m[0]).detail;
      if (d && d.message) msg = d.message;
    } catch (_) { /* JSON 이 아니면 원문을 그대로 */ }
  }
  return status ? `${status} ${msg}` : msg;
}

/* --- 대상 정리 ------------------------------------------------------- */
const rate   = CREDITS_PER_CHAR[MODEL];
if (!rate) throw new Error(`크레딧 단가를 모르는 모델: ${MODEL}`);
let voices   = VOICES;
if (opt('voice')) {
  voices = VOICES.filter(v => v.slot === opt('voice'));
  if (!voices.length) throw new Error(`목소리 slot 은 ${VOICES.map(v => v.slot).join(' 또는 ')}`);
}
let list = filterTiers(loadCorpus(), opt('tier'));
if (opt('limit')) list = list.slice(0, Number(opt('limit')));

/* 만들 것만 남긴다 — 이미 있는 파일은 크레딧을 쓰지 않는다. */
const jobs = [];
for (const v of voices) for (const x of list) {
  const rel = clipPath(v.slot, x.id);
  if (existsSync(join(ROOT, rel))) continue;
  jobs.push({ ...x, slot: v.slot, voiceId: v.id, voiceName: v.name, rel });
}
const needChars   = jobs.reduce((n, j) => n + j.text.length, 0);
const needCredits = Math.round(needChars * rate);

console.log(`대상 ${list.length}개 문장 × 목소리 ${voices.length} = ${(list.length * voices.length).toLocaleString()}`);
console.log(`만들 것 ${jobs.length.toLocaleString()}개 · ${needChars.toLocaleString()}자 → 약 ${needCredits.toLocaleString()} 크레딧 (${MODEL})`);
if (!jobs.length) { console.log('다 만들어져 있다.'); process.exit(0); }

/* --- 계정 확인 ------------------------------------------------------- */
/* 아래 둘은 안전장치일 뿐이다. 권한이 좁은 키(텍스트 음성 변환만)로는 애초에
   막히므로, 실패해도 이유만 알리고 진행한다 — 어떤 상태 코드가 오는지 열거하지
   않는다(키 길이가 틀리면 401 이 아니라 400 이 온다). 키가 정말 잘못됐으면
   첫 변환 다섯 번에서 같은 오류를 보고 멈춘다.                          */
if (!DRY) {
  try {
    const sub  = await api('/user/subscription');
    const left = (sub.character_limit ?? 0) - (sub.character_count ?? 0);
    console.log(`계정 ${sub.tier} · 남은 크레딧 ${left.toLocaleString()} / ${(sub.character_limit ?? 0).toLocaleString()}`);
    if (left < needCredits && !flag('force')) {
      console.error(`\n크레딧이 ${(needCredits - left).toLocaleString()} 부족하다.`);
      console.error('--tier= 나 --limit= 로 나눠 하거나, 다음 결제일에 이어서 하거나, --force 로 강행한다.');
      process.exit(1);
    }
  } catch (e) {
    console.warn(`알림: 남은 크레딧을 확인하지 못했다 — ${why(e)}`);
    console.warn('      키에 「사용자 읽기」 권한이 없으면 정상이다. 확인 없이 진행한다.');
  }

  try {
    const avail = new Set((await api('/voices')).voices.map(v => v.voice_id));
    for (const v of voices) {
      if (!avail.has(v.id)) {
        console.error(`계정에 목소리 ${v.name}(${v.id}) 이 없다. voice/config.mjs 에서 바꿀 것.`);
        process.exit(1);
      }
    }
  } catch (e) {
    console.warn(`알림: 목소리를 확인하지 못했다 — ${why(e)}`);
    console.warn('      키에 「목소리 읽기」 권한이 없으면 정상이다. 확인 없이 진행한다.');
  }
}
if (DRY) { console.log('--dry — 호출하지 않고 끝낸다.'); process.exit(0); }

/* --- 변환 ----------------------------------------------------------- */
async function tts(job) {
  const url  = `${API}/text-to-speech/${job.voiceId}?output_format=${FORMAT}`;
  const body = JSON.stringify({ text: job.text, model_id: MODEL, voice_settings: VOICE_SETTINGS });
  /* 429(속도 제한)·5xx 는 기다리면 풀린다. 4xx 는 고쳐야 할 문제라 바로 던진다. */
  for (let attempt = 0; attempt < 5; attempt++) {
    let r;
    try { r = await fetch(url, { method: 'POST', headers: H, body }); }
    catch (e) { if (attempt === 4) throw e; await sleep(2000 * 2 ** attempt); continue; }
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if (r.status !== 429 && r.status < 500) throw new Error(`${r.status} ${await r.text()}`);
    await sleep(2000 * 2 ** attempt);
  }
  throw new Error('재시도 5회 실패');
}

const t0 = Date.now();
let ok = 0, bytes = 0, spent = 0;
const failed = [];
const CONC = Number(opt('conc') || 4);

/* 키의 크레딧 상한에 걸렸거나 권한이 없으면 전부 실패한다. 그때 9,900번을
   끝까지 두드리지 않고 멈춘다 — 무엇이 잘못됐는지 바로 보여주는 게 낫다. */
const ABORT_AFTER = 5;
let streak = 0, aborted = false;

async function worker() {
  for (;;) {
    if (aborted) return;
    const job = jobs.shift();
    if (!job) return;
    try {
      const buf = await tts(job);
      const abs = join(ROOT, job.rel);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, buf);
      ok++; bytes += buf.length; spent += Math.round(job.text.length * rate);
      streak = 0;
    } catch (e) {
      failed.push({ ...job, error: String(e.message || e) });
      if (++streak >= ABORT_AFTER) aborted = true;
    }
    const n = ok + failed.length;
    if (n % 25 === 0 || !jobs.length) {
      const per = (Date.now() - t0) / n;
      const eta = Math.round(per * jobs.length / 1000);
      process.stdout.write(`\r  ${n.toLocaleString()} 처리 · 성공 ${ok.toLocaleString()} · 실패 ${failed.length} · ` +
        `${(bytes / 1024 / 1024).toFixed(1)} MB · 크레딧 ${spent.toLocaleString()} · 남은 시간 약 ${Math.floor(eta / 60)}분  `);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
process.stdout.write('\n');
if (aborted) {
  console.error(`\n연속 ${ABORT_AFTER}회 실패해서 멈췄다 —`);
  console.error('  ' + why({ message: (failed[failed.length - 1] || {}).error }));
  console.error('키의 「텍스트 음성 변환」 권한과 크레딧 상한을 확인할 것.');
}

/* --- 매니페스트 ------------------------------------------------------ */
/* 앱은 문장 해시로 파일 경로를 스스로 계산하므로 문장 목록은 넣지 않는다.
   여기 담는 것은 "어떤 목소리가 준비됐는가" 뿐이다.                    */
const everything = loadCorpus();
const counted = VOICES.map(v => {
  let n = 0, size = 0;
  for (const x of everything) {
    const p = join(ROOT, clipPath(v.slot, x.id));
    if (existsSync(p)) { n++; size += statSync(p).size; }
  }
  return { slot: v.slot, name: v.name, clips: n, bytes: size };
}).filter(v => v.clips > 0);

/* 만들어진 것이 하나도 없으면 매니페스트를 쓰지 않는다. 빈 매니페스트는
   앱에게 "준비된 목소리 없음"과 같은 뜻이라 파일만 늘리는 셈이다.       */
if (counted.length) {
  writeFileSync(join(ROOT, 'voice', 'manifest.json'), JSON.stringify({
    model: MODEL, format: FORMAT, hash: 'sha1-20',
    path: 'voice/audio/{slot}/{id0:2}/{id}.mp3',
    voices: counted,
    total: everything.length,
  }, null, 2) + '\n');
}

console.log(`\n완료 ${ok.toLocaleString()} · 실패 ${failed.length} · ${(bytes / 1024 / 1024).toFixed(1)} MB · 크레딧 약 ${spent.toLocaleString()} 소비`);
for (const v of counted) {
  console.log(`  ${v.slot.padEnd(7)} ${v.name.padEnd(8)} ${v.clips.toLocaleString()} / ${everything.length.toLocaleString()} 개 · ${(v.bytes / 1024 / 1024).toFixed(1)} MB`);
}
if (failed.length) {
  writeFileSync(join(ROOT, 'voice', 'failed.json'), JSON.stringify(failed, null, 2) + '\n');
  console.log('실패 목록 → voice/failed.json · 다시 실행하면 실패한 것만 재시도한다');
}
