/* =====================================================================
   5차원 영어 — app.js
   BASIC DRILL(동사 변형) + PATTERN DRILL(문장 패턴) 두 트랙
   플래시카드 흐름 · TTS 발음 · 진도 저장
   ===================================================================== */
(function () {
  'use strict';

  const { VERBS, stepsForVerb, buildDeck } = window.DRILL;
  const { PATTERN_GROUPS, PATTERNS, buildPatternDeck, patternCount } = window.PATTERN;
  const { ROOT_GROUPS, ROOTS, buildRootDeck, rootWordCount } = window.ROOT;
  const STORAGE_KEY = 'fivedim:v1';

  /* ---------- 진도 저장/불러오기 ---------------------------------- */
  function loadProgress() {
    let p;
    try { p = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { p = {}; }
    if (!p.verbs) p.verbs = {};
    if (!p.patterns) p.patterns = {};
    if (!p.roots) p.roots = {};
    /* BASIC 단계 구성이 바뀌면 저장된 단계 번호가 다른 단계를 가리키게 된다.
       (평서문·부정문이 앞에 붙으면서 전체가 두 칸씩 밀렸다)
       그래서 구성이 바뀔 때마다 BASIC 진도만 비운다 — 패턴·어원 진도는 그대로. */
    if (p.basicVer !== 2) { p.verbs = {}; p.basicVer = 2; }
    return p;
  }
  let progress = loadProgress();
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch (e) { /* 무시 */ }
  }

  /* BASIC 진도 */
  function completedSteps(verbId) {
    const v = progress.verbs[verbId];
    return v && Array.isArray(v.completed) ? v.completed : [];
  }
  function isStepUnlocked(verbId, i) {
    return i === 0 || completedSteps(verbId).indexOf(i - 1) !== -1;
  }
  function markStepComplete(verbId, i) {
    if (!progress.verbs[verbId]) progress.verbs[verbId] = { completed: [] };
    const d = progress.verbs[verbId].completed;
    if (d.indexOf(i) === -1) d.push(i);
    saveProgress();
  }
  /* PATTERN 진도 */
  function isPatternDone(pid) { return !!progress.patterns[pid]; }
  function markPatternDone(pid) { progress.patterns[pid] = true; saveProgress(); }
  /* ROOT 진도 */
  function isRootDone(rid) { return !!progress.roots[rid]; }
  function markRootDone(rid) { progress.roots[rid] = true; saveProgress(); }

  /* ---------- 카드 순서 설정 -------------------------------------- */
  const ORDER_KEY = 'fivedim:order';
  function getOrder() {
    return localStorage.getItem(ORDER_KEY) === 'inorder' ? 'inorder' : 'shuffle';
  }
  function setOrder(v) {
    try { localStorage.setItem(ORDER_KEY, v); } catch (e) { /* 무시 */ }
    renderOrderToggle();
  }
  function renderOrderToggle() {
    const o = getOrder();
    document.querySelectorAll('.order-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-order') === o);
    });
  }
  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- 발음 --------------------------------------------------
     ElevenLabs 로 미리 만들어 둔 음성 파일(voice/audio/)을 재생한다.
     파일이 없거나(아직 변환 안 한 문장) 브라우저가 재생을 막으면 기기
     내장 음성으로 되돌아간다 — 발음이 아예 안 나오는 경우는 없다.
     목소리는 여성·남성 둘뿐이다. 기기 음성 목록은 노출하지 않는다.
     -------------------------------------------------------------------- */
  const VOICE_KEY = 'fivedim:voice';
  let voiceSlot = localStorage.getItem(VOICE_KEY) === 'male' ? 'male' : 'female';
  let readyVoices = [];      /* 음성 파일이 준비된 slot — manifest 가 알려준다 */

  const manifestReady = fetch('voice/manifest.json?v=15')
    .then(r => (r.ok ? r.json() : null))
    .then(m => { readyVoices = m && m.voices ? m.voices.map(v => v.slot) : []; })
    .catch(() => { readyVoices = []; })
    .then(updateVoiceTip);

  /* 문장 -> 파일 이름. voice/corpus.mjs 의 clipId 와 같은 규칙이어야 한다
     (sha1 앞 20자). 어긋나면 파일을 못 찾고 기기 음성으로 조용히 내려간다. */
  const idCache = new Map();
  function clipId(text) {
    if (!idCache.has(text)) {
      idCache.set(text, crypto.subtle
        .digest('SHA-1', new TextEncoder().encode(text))
        .then(buf => Array.prototype.map
          .call(new Uint8Array(buf), b => b.toString(16).padStart(2, '0'))
          .join('').slice(0, 20)));
    }
    return idCache.get(text);
  }
  function clipUrl(id, slot) {
    return 'voice/audio/' + slot + '/' + id.slice(0, 2) + '/' + id + '.mp3';
  }
  const canPlayFiles = () => !!(window.crypto && crypto.subtle && window.TextEncoder);

  /* --- 기기 내장 음성 (되돌아갈 자리) --- */
  let enVoices = [];

  function voiceScore(v) {
    const n = (v.name || '').toLowerCase();
    let s = 0;
    if (v.lang === 'en-US') s += 5;
    if (/natural|neural/.test(n)) s += 40;
    if (/google/.test(n)) s += 30;
    if (/online/.test(n)) s += 15;
    return s;
  }

  /* 이름으로 성별을 짐작한다. 여성 먼저 보므로 'Female' 이 'male' 에 걸리지 않는다. */
  const FEMALE_NAME = /female|여성|aria|jenny|emma|libby|michelle|ava|samantha|zira|susan|karen|serena|moira|tessa|fiona|allison|joanna/;
  const MALE_NAME   = /male|남성|guy|david|mark|christopher|eric|roger|steffan|brian|alex|daniel|fred|aaron|arthur|oliver|ryan|matthew/;
  function genderScore(v, slot) {
    const n = (v.name || '').toLowerCase();
    if (FEMALE_NAME.test(n)) return slot === 'female' ? 25 : -25;
    if (MALE_NAME.test(n))   return slot === 'male'   ? 25 : -25;
    return 0;
  }

  function refreshVoices() {
    if (!window.speechSynthesis) return;
    enVoices = (speechSynthesis.getVoices() || []).filter(v => /^en/i.test(v.lang));
    updateVoiceTip();
  }
  function deviceVoice() {
    if (!enVoices.length) return null;
    return enVoices.slice().sort((a, b) =>
      (voiceScore(b) + genderScore(b, voiceSlot)) -
      (voiceScore(a) + genderScore(a, voiceSlot)))[0];
  }

  function updateVoiceTip() {
    const tip = document.getElementById('voice-tip');
    if (!tip) return;
    if (readyVoices.indexOf(voiceSlot) !== -1) {
      tip.textContent = 'ElevenLabs 음성으로 읽습니다. 한 번 들은 문장은 오프라인에서도 나옵니다.';
    } else if (readyVoices.length) {
      tip.textContent = '이 목소리는 아직 변환되지 않았습니다 — 기기 음성으로 읽습니다.';
    } else if (enVoices.length) {
      tip.textContent = '기기 음성으로 읽습니다.';
    } else {
      tip.textContent = '이 기기에서는 영어 발음을 낼 수 없습니다.';
    }
  }

  /* --- 재생 --- */
  let player = null;
  let speakSeq = 0;          /* 카드를 빨리 넘길 때 옛 재생이 끼어들지 않게 */

  function stopSpeak() {
    speakSeq++;
    if (player) { player.pause(); player = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  function deviceSpeak(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = deviceVoice();
    u.lang = (v && v.lang) || 'en-US';
    u.rate = rate;
    u.pitch = 1;
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  /* 느리게 듣기는 파일을 따로 만들지 않고 재생 속도를 낮춘다 —
     변환 비용이 두 배가 되지 않고, 음높이는 브라우저가 유지해 준다. */
  function speak(text, slow) {
    stopSpeak();
    const seq = speakSeq;
    const fallback = () => { if (seq === speakSeq) deviceSpeak(text, slow ? 0.6 : 0.95); };
    if (!canPlayFiles()) { fallback(); return; }
    manifestReady.then(() => {
      if (readyVoices.indexOf(voiceSlot) === -1) { fallback(); return; }
      return clipId(text).then(id => {
        if (seq !== speakSeq) return;
        const a = new Audio(clipUrl(id, voiceSlot));
        a.preservesPitch = true;
        a.playbackRate = slow ? 0.7 : 1;
        player = a;
        return a.play().catch(fallback);
      });
    }).catch(fallback);
  }

  /* 카드가 뜰 때 미리 받아 둔다 — 뒤집는 순간 지체 없이 소리가 나온다.
     서비스워커가 받은 것을 캐시에 넣으므로 두 번째부터는 오프라인에서도 된다. */
  function prefetchClip(text) {
    if (!canPlayFiles()) return;
    manifestReady.then(() => {
      if (readyVoices.indexOf(voiceSlot) === -1) return;
      return clipId(text).then(id => fetch(clipUrl(id, voiceSlot)).catch(() => {}));
    }).catch(() => {});
  }

  /* --- 여성·남성 토글 --- */
  function renderVoiceToggle() {
    document.querySelectorAll('.voice-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-voice') === voiceSlot);
    });
  }
  function setVoiceSlot(v) {
    voiceSlot = v === 'male' ? 'male' : 'female';
    try { localStorage.setItem(VOICE_KEY, voiceSlot); } catch (e) { /* 무시 */ }
    renderVoiceToggle();
    updateVoiceTip();
  }
  document.querySelectorAll('.voice-btn').forEach(b => {
    b.addEventListener('click', () => setVoiceSlot(b.getAttribute('data-voice')));
  });
  renderVoiceToggle();

  if (window.speechSynthesis) {
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }
  document.getElementById('btn-voice-test').addEventListener('click', () => {
    speak('What do you want to buy?');
  });

  /* ---------- 화면 전환 ------------------------------------------- */
  const screens = {
    home:  document.getElementById('screen-home'),
    verb:  document.getElementById('screen-verb'),
    drill: document.getElementById('screen-drill'),
    done:  document.getElementById('screen-done'),
  };
  function showScreen(name) {
    Object.keys(screens).forEach(k => {
      screens[k].classList.toggle('hidden', k !== name);
    });
    window.scrollTo(0, 0);
  }

  /* ---------- 홈 화면 · 트랙 전환 --------------------------------- */
  let currentTrack = 'basic';

  function setTrack(track) {
    currentTrack = track;
    document.querySelectorAll('.track-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-track') === track);
    });
    document.getElementById('track-basic')
      .classList.toggle('hidden', track !== 'basic');
    document.getElementById('track-pattern')
      .classList.toggle('hidden', track !== 'pattern');
    document.getElementById('track-root')
      .classList.toggle('hidden', track !== 'root');
    renderOverall();
  }

  function renderOverall() {
    const box = document.getElementById('overall-progress');
    let done, total, label;
    if (currentTrack === 'basic') {
      total = VERBS.reduce((s, v) => s + stepsForVerb(v).length, 0);
      done = VERBS.reduce((s, v) => s + completedSteps(v.id).length, 0);
      label = '동사 변형 ' + done + ' / ' + total + ' 단계';
    } else if (currentTrack === 'pattern') {
      total = PATTERNS.length;
      done = PATTERNS.reduce((s, p) => s + (isPatternDone(p.id) ? 1 : 0), 0);
      label = '문장 패턴 ' + done + ' / ' + total + ' 개';
    } else {
      total = ROOTS.length;
      done = ROOTS.reduce((s, r) => s + (isRootDone(r.id) ? 1 : 0), 0);
      label = '어근 ' + done + ' / ' + total + ' 개';
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    box.innerHTML =
      '<div class="overall-bar"><div style="width:' + pct + '%"></div></div>' +
      '<span>' + label + '</span>';
  }

  function renderHome() {
    renderOverall();
    renderBasicTrack();
    renderPatternTrack();
    renderRootTrack();
  }

  /* BASIC 트랙: 동사 목록 */
  function renderBasicTrack() {
    const list = document.getElementById('verb-list');
    list.innerHTML = '';
    VERBS.forEach(v => {
      const done = completedSteps(v.id).length;
      const li = document.createElement('li');
      li.className = 'verb-card';
      li.innerHTML =
        '<span class="verb-emoji">' + v.emoji + '</span>' +
        '<span class="verb-text"><strong>' + v.base + '</strong>' +
        '<span class="verb-meaning">' + v.meaning + '</span></span>' +
        '<span class="verb-prog">' + done + '/' + stepsForVerb(v).length + '</span>';
      li.addEventListener('click', () => openVerb(v.id));
      list.appendChild(li);
    });
  }

  /* PATTERN 트랙: 4그룹 22패턴 */
  function renderPatternTrack() {
    const wrap = document.getElementById('pattern-list');
    wrap.innerHTML = '';
    PATTERN_GROUPS.forEach(g => {
      const head = document.createElement('div');
      head.className = 'pgroup-head';
      head.innerHTML =
        '<span class="pgroup-emoji">' + g.emoji + '</span>' +
        '<span><strong>' + g.title + '</strong>' +
        '<span class="pgroup-desc">' + g.desc + '</span></span>';
      wrap.appendChild(head);

      const ul = document.createElement('ul');
      ul.className = 'step-list';
      PATTERNS.filter(p => p.group === g.id).forEach(p => {
        const done = isPatternDone(p.id);
        const li = document.createElement('li');
        li.className = 'step-card' + (done ? ' done' : '');
        li.innerHTML =
          '<span class="pat-note">' + p.note + '</span>' +
          '<span class="step-text"><strong>' + p.label + '</strong>' +
          '<span class="step-sub">예문 ' + patternCount(p.id) + '개</span></span>' +
          '<span class="step-state">' + (done ? '완료' : '학습') + '</span>';
        li.addEventListener('click', () => startPatternDrill(p.id));
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    });
  }

  /* ROOT 트랙: 3그룹 40어근 */
  function renderRootTrack() {
    const wrap = document.getElementById('root-list');
    wrap.innerHTML = '';
    ROOT_GROUPS.forEach(g => {
      const head = document.createElement('div');
      head.className = 'pgroup-head';
      head.innerHTML =
        '<span class="pgroup-emoji">' + g.emoji + '</span>' +
        '<span><strong>' + g.title + '</strong>' +
        '<span class="pgroup-desc">' + g.desc + '</span></span>';
      wrap.appendChild(head);

      const ul = document.createElement('ul');
      ul.className = 'step-list';
      ROOTS.filter(r => r.group === g.id).forEach(r => {
        const done = isRootDone(r.id);
        const li = document.createElement('li');
        li.className = 'step-card' + (done ? ' done' : '');
        li.innerHTML =
          '<span class="root-chip">' + r.root + '</span>' +
          '<span class="step-text"><strong>' + r.meaning + '</strong>' +
          '<span class="step-sub">' + r.origin + ' · 단어 ' +
            rootWordCount(r.id) + '개</span></span>' +
          '<span class="step-state">' + (done ? '완료' : '학습') + '</span>';
        li.addEventListener('click', () => startRootDrill(r.id));
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    });
  }

  /* ---------- 동사 → 단계 화면 (BASIC) ---------------------------- */
  let currentVerb = null;
  function openVerb(verbId) {
    currentVerb = VERBS.find(v => v.id === verbId);
    renderVerb();
    showScreen('verb');
  }
  function renderVerb() {
    const v = currentVerb;
    document.getElementById('verb-hero').innerHTML =
      '<span class="verb-emoji big">' + v.emoji + '</span>' +
      '<div><h2>' + v.base + '</h2><p>' + v.meaning + '</p></div>';
    const list = document.getElementById('step-list');
    list.innerHTML = '';
    stepsForVerb(v).forEach((step, i) => {
      const unlocked = isStepUnlocked(v.id, i);
      const done = completedSteps(v.id).indexOf(i) !== -1;
      const li = document.createElement('li');
      li.className = 'step-card' + (unlocked ? '' : ' locked') + (done ? ' done' : '');
      li.innerHTML =
        '<span class="step-num">' + (done ? '✓' : (i + 1)) + '</span>' +
        '<span class="step-text"><strong>' + step.title + '</strong>' +
        '<span class="step-sub">' + step.sub + '</span></span>' +
        '<span class="step-state">' +
        (unlocked ? (done ? '완료' : '학습') : '🔒') + '</span>';
      if (unlocked) li.addEventListener('click', () => startBasicDrill(v, i));
      list.appendChild(li);
    });
  }

  /* ---------- 드릴(플래시카드) — 공용 ---------------------------- */
  const drill = {
    queue: [], total: 0, revealed: false, mode: 'sentence', unit: '문장',
    onComplete: null, restart: null, nextFn: null, exitFn: null,
    doneTitle: '', doneSub: '',
  };
  const elCard       = document.getElementById('card');
  const elCardKo     = document.getElementById('card-ko');
  const elCardEn     = document.getElementById('card-en');
  const elCardHint   = document.getElementById('card-hint');
  const elCardBackHint = document.getElementById('card-back-hint');
  const elActions    = document.getElementById('drill-actions');
  const elRevealHint = document.getElementById('reveal-hint');
  const elFill       = document.getElementById('progress-fill');
  const elProgText   = document.getElementById('progress-text');

  function runDrill(opts) {
    // 설정이 '무작위'면 카드 순서를 섞는다
    const cards = getOrder() === 'shuffle' ? shuffleArr(opts.cards) : opts.cards;
    drill.queue = cards.slice();
    drill.total = cards.length;
    drill.mode = opts.mode || 'sentence';
    drill.unit = opts.unit || '문장';
    drill.onComplete = opts.onComplete;
    drill.restart    = opts.restart;
    drill.nextFn     = opts.nextFn || null;
    drill.exitFn     = opts.exitFn;
    drill.doneTitle  = opts.doneTitle;
    drill.doneSub    = opts.doneSub;
    document.getElementById('drill-main').textContent = opts.main;
    document.getElementById('drill-sub').textContent = opts.sub;
    showScreen('drill');
    nextCard();
  }

  function updateProgress() {
    const done = drill.total - drill.queue.length;
    const pct = drill.total ? Math.round((done / drill.total) * 100) : 0;
    elFill.style.width = pct + '%';
    elProgText.textContent = done + ' / ' + drill.total + ' ' + drill.unit;
  }

  function cardSpeakText(card) {
    return drill.mode === 'root' ? card.speak : card.en;
  }

  function nextCard() {
    if (drill.queue.length === 0) { finishDrill(); return; }
    const card = drill.queue[0];
    drill.revealed = false;
    elCard.classList.remove('flipped');
    elCardHint.textContent = card.hint;
    if (drill.mode === 'root') {
      elCard.classList.add('root-card');
      elCardKo.innerHTML = card.front;
      elCardEn.innerHTML = card.back;
      elCardBackHint.textContent = '어원 분해';
    } else {
      elCard.classList.remove('root-card');
      elCardKo.textContent = card.ko;
      elCardEn.textContent = card.en;
      elCardBackHint.textContent = 'English';
    }
    elActions.classList.add('hidden');
    elRevealHint.classList.remove('hidden');
    prefetchClip(cardSpeakText(card));
    updateProgress();
  }

  function revealCard() {
    if (drill.revealed || drill.queue.length === 0) return;
    drill.revealed = true;
    elCard.classList.add('flipped');
    elActions.classList.remove('hidden');
    elRevealHint.classList.add('hidden');
    speak(cardSpeakText(drill.queue[0]));
  }

  function answer(known) {
    if (!drill.revealed) return;
    const card = drill.queue.shift();
    if (!known) drill.queue.push(card);   // 모르면 맨 뒤로
    nextCard();
  }

  function finishDrill() {
    if (drill.onComplete) drill.onComplete();
    document.getElementById('done-title').textContent = drill.doneTitle;
    document.getElementById('done-sub').textContent =
      drill.doneSub + ' (' + drill.total + drill.unit + ')';
    document.getElementById('btn-next-step').classList.toggle('hidden', !drill.nextFn);
    showScreen('done');
  }

  /* BASIC 드릴 시작 */
  function startBasicDrill(verb, stepIndex) {
    const steps = stepsForVerb(verb);
    runDrill({
      main: verb.emoji + ' ' + verb.base,
      sub: (stepIndex + 1) + '단계 · ' + steps[stepIndex].title,
      cards: buildDeck(verb, stepIndex),
      onComplete: () => markStepComplete(verb.id, stepIndex),
      restart: () => startBasicDrill(verb, stepIndex),
      nextFn: stepIndex < steps.length - 1
        ? () => startBasicDrill(verb, stepIndex + 1) : null,
      exitFn: () => openVerb(verb.id),
      doneTitle: (stepIndex + 1) + '단계 완료!',
      doneSub: verb.base + ' · ' + steps[stepIndex].title,
    });
  }

  /* PATTERN 드릴 시작 */
  function startPatternDrill(patternId) {
    const pat = PATTERNS.find(p => p.id === patternId);
    const grp = PATTERN_GROUPS.find(g => g.id === pat.group);
    const inGroup = PATTERNS.filter(p => p.group === pat.group);
    const next = inGroup[inGroup.indexOf(pat) + 1];
    runDrill({
      main: grp.emoji + ' ' + pat.label,
      sub: pat.note + ' · ' + grp.title,
      cards: buildPatternDeck(patternId),
      onComplete: () => markPatternDone(patternId),
      restart: () => startPatternDrill(patternId),
      nextFn: next ? () => startPatternDrill(next.id) : null,
      exitFn: () => { setTrack('pattern'); renderHome(); showScreen('home'); },
      doneTitle: '패턴 완료!',
      doneSub: pat.label,
    });
  }

  /* ROOT 드릴 시작 */
  function startRootDrill(rootId) {
    const r = ROOTS.find(x => x.id === rootId);
    const grp = ROOT_GROUPS.find(g => g.id === r.group);
    const inGroup = ROOTS.filter(x => x.group === r.group);
    const next = inGroup[inGroup.indexOf(r) + 1];
    runDrill({
      mode: 'root',
      unit: '단어',
      main: grp.emoji + ' ' + r.root,
      sub: r.meaning + ' · ' + r.origin,
      cards: buildRootDeck(rootId),
      onComplete: () => markRootDone(rootId),
      restart: () => startRootDrill(rootId),
      nextFn: next ? () => startRootDrill(next.id) : null,
      exitFn: () => { setTrack('root'); renderHome(); showScreen('home'); },
      doneTitle: '어근 완료!',
      doneSub: r.root + ' · ' + r.meaning,
    });
  }

  /* ---------- 이벤트 연결 ----------------------------------------- */
  document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', () => setTrack(btn.getAttribute('data-track')));
  });
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => setOrder(btn.getAttribute('data-order')));
  });

  elCard.addEventListener('click', revealCard);
  document.getElementById('btn-speak').addEventListener('click', e => {
    e.stopPropagation();
    if (drill.queue.length) speak(cardSpeakText(drill.queue[0]));
  });
  document.getElementById('btn-speak-slow').addEventListener('click', e => {
    e.stopPropagation();
    if (drill.queue.length) speak(cardSpeakText(drill.queue[0]), true);
  });
  document.getElementById('btn-again').addEventListener('click', () => answer(false));
  document.getElementById('btn-known').addEventListener('click', () => answer(true));

  document.addEventListener('keydown', e => {
    if (screens.drill.classList.contains('hidden')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!drill.revealed) revealCard(); else answer(true);
    } else if (e.code === 'ArrowLeft' && drill.revealed) {
      answer(false);
    }
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      stopSpeak();
      const dest = btn.getAttribute('data-back');
      if (dest === 'home') { renderHome(); showScreen('home'); }
      else if (dest === 'drill-exit') { drill.exitFn(); }
    });
  });

  document.getElementById('btn-again-step').addEventListener('click', () => drill.restart());
  document.getElementById('btn-next-step').addEventListener('click', () => drill.nextFn());
  document.getElementById('btn-done-home').addEventListener('click', () => drill.exitFn());

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('모든 학습 기록을 지울까요?')) {
      progress = { verbs: {}, patterns: {}, roots: {} };
      saveProgress();
      renderHome();
    }
  });

  /* ---------- PWA 설치 + 서비스워커 ------------------------------- */
  let deferredPrompt = null;
  const installBtn = document.getElementById('btn-install');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add('hidden');
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  /* ---------- 시작 ------------------------------------------------- */
  renderHome();
  setTrack('basic');
  renderOrderToggle();
  showScreen('home');
})();
