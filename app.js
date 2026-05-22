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

  /* ---------- TTS (발음 듣기) ------------------------------------- */
  const VOICE_KEY = 'fivedim:voice';
  let enVoices = [];
  let chosenVoice = null;

  function voiceScore(v) {
    const n = (v.name || '').toLowerCase();
    let s = 0;
    if (/^en/i.test(v.lang)) s += 10;
    if (v.lang === 'en-US') s += 5;
    if (/natural|neural/.test(n)) s += 40;
    if (/google/.test(n)) s += 30;
    if (/online/.test(n)) s += 15;
    if (/aria|jenny|emma|libby|michelle|ava|samantha/.test(n)) s += 5;
    if (/david|mark/.test(n)) s -= 5;
    return s;
  }

  function refreshVoices() {
    if (!window.speechSynthesis) return;
    const all = speechSynthesis.getVoices() || [];
    enVoices = all.filter(v => /^en/i.test(v.lang))
                  .sort((a, b) => voiceScore(b) - voiceScore(a));
    const sel = document.getElementById('voice-select');
    if (!sel) return;
    const saved = localStorage.getItem(VOICE_KEY);
    sel.innerHTML = '';
    if (enVoices.length === 0) {
      sel.innerHTML = '<option>기기에 영어 음성이 없습니다</option>';
      chosenVoice = null;
    } else {
      enVoices.forEach(v => {
        const o = document.createElement('option');
        o.value = v.name;
        o.textContent = v.name + ' · ' + v.lang;
        sel.appendChild(o);
      });
      chosenVoice = enVoices.find(v => v.name === saved) || enVoices[0];
      sel.value = chosenVoice.name;
    }
    updateVoiceTip();
  }

  function updateVoiceTip() {
    const tip = document.getElementById('voice-tip');
    if (!tip) return;
    if (!chosenVoice) { tip.textContent = '발음 음성을 찾지 못했습니다.'; return; }
    const n = chosenVoice.name.toLowerCase();
    tip.textContent = /natural|neural|google/.test(n)
      ? '고품질 음성이 선택되었어요 👍'
      : '더 자연스러운 발음을 원하면 Microsoft Edge에서 열어 "Natural" 음성을 고르세요.';
  }

  function speak(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (chosenVoice && chosenVoice.lang) || 'en-US';
    u.rate = rate || 0.95;
    u.pitch = 1;
    if (chosenVoice) u.voice = chosenVoice;
    speechSynthesis.speak(u);
  }

  if (window.speechSynthesis) {
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }
  document.getElementById('voice-select').addEventListener('change', e => {
    chosenVoice = enVoices.find(v => v.name === e.target.value) || null;
    if (chosenVoice) localStorage.setItem(VOICE_KEY, chosenVoice.name);
    updateVoiceTip();
  });
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
    if (drill.queue.length) speak(cardSpeakText(drill.queue[0]), 0.95);
  });
  document.getElementById('btn-speak-slow').addEventListener('click', e => {
    e.stopPropagation();
    if (drill.queue.length) speak(cardSpeakText(drill.queue[0]), 0.6);
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
      if (window.speechSynthesis) speechSynthesis.cancel();
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
