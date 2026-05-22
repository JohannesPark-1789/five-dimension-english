/* =====================================================================
   5차원 영어 · ROOT DRILL
   roots.js — 어원(접두사·어근) 학습 데이터

   원리: "어근 하나 → 수십 개 단어".
   라틴어·그리스어에서 온 어근을 알면 처음 보는 단어도 분해해서 읽는다.
   카드: 영어 단어 → 어근 분해 + 직역 + 실제 뜻 (인식형)

   단어 항목 { w, p, b, m, lv }
     w  : 영어 단어
     p  : 형태소 분해  [[형태소, 뜻], ...]
     b  : 직역 (기억고리)
     m  : 실제 뜻
     lv : 난이도  '기초' | '수능' | '고급'
   ===================================================================== */

/* --- 3개 그룹 ------------------------------------------------------- */
const ROOT_GROUPS = [
  { id: 'prefix', emoji: '🔑', title: '접두사',       desc: '단어 앞에 붙어 방향·부정·강조를 더한다' },
  { id: 'suffix', emoji: '🧩', title: '접미사',       desc: '단어 끝에 붙어 품사와 뜻을 정한다' },
  { id: 'latin',  emoji: '🏛️', title: '라틴어 어근',  desc: '일상·추상 어휘의 뿌리' },
  { id: 'greek',  emoji: '🏺', title: '그리스어 어근', desc: '학문·과학 어휘의 뿌리' },
];

/* --- 어근 사전 ------------------------------------------------------ */
const ROOTS = [

  /* ===== 접두사 ===== */
  {
    id: 're', group: 'prefix', root: 're-', meaning: '다시 · 뒤로',
    origin: '라틴어', originWord: 'red- (다시)',
    words: [
      { w: 'return',  p: [['re','다시'],['turn','돌다']],     b: '다시 돌다',     m: '돌아오다',   lv: '기초' },
      { w: 'rebuild', p: [['re','다시'],['build','짓다']],    b: '다시 짓다',     m: '재건하다',   lv: '기초' },
      { w: 'recall',  p: [['re','다시'],['call','부르다']],   b: '다시 불러내다', m: '상기하다',   lv: '수능' },
      { w: 'recover', p: [['re','다시'],['cover','덮다']],    b: '다시 덮다',     m: '회복하다',   lv: '수능' },
      { w: 'recycle', p: [['re','다시'],['cycle','순환']],    b: '다시 순환시키다', m: '재활용하다', lv: '기초' },
    ],
  },
  {
    id: 'un', group: 'prefix', root: 'un-', meaning: '부정 · 반대',
    origin: '고대 영어', originWord: 'un- (~아닌)',
    words: [
      { w: 'unhappy', p: [['un','아닌'],['happy','행복한']], b: '행복하지 않은', m: '불행한',   lv: '기초' },
      { w: 'unlock',  p: [['un','반대'],['lock','잠그다']],  b: '잠금을 반대로',  m: '열다',     lv: '기초' },
      { w: 'unfair',  p: [['un','아닌'],['fair','공정한']],  b: '공정하지 않은',  m: '불공평한', lv: '수능' },
      { w: 'unknown', p: [['un','아닌'],['known','알려진']], b: '알려지지 않은',  m: '미지의',   lv: '수능' },
      { w: 'undo',    p: [['un','반대'],['do','하다']],      b: '한 것을 되돌리다', m: '취소하다', lv: '기초' },
    ],
  },
  {
    id: 'dis', group: 'prefix', root: 'dis-', meaning: '부정 · 분리',
    origin: '라틴어', originWord: 'dis- (떨어져)',
    words: [
      { w: 'dislike',    p: [['dis','부정'],['like','좋아하다']],   b: '좋아하지 않다',  m: '싫어하다',   lv: '기초' },
      { w: 'disagree',   p: [['dis','부정'],['agree','동의하다']],  b: '동의하지 않다',  m: '반대하다',   lv: '기초' },
      { w: 'disappear',  p: [['dis','부정'],['appear','나타나다']], b: '나타나지 않게 되다', m: '사라지다', lv: '수능' },
      { w: 'disorder',   p: [['dis','분리'],['order','질서']],      b: '질서가 흩어짐',  m: '무질서·장애', lv: '고급' },
      { w: 'discount',   p: [['dis','떼어내다'],['count','셈']],    b: '셈에서 떼어내다', m: '할인',      lv: '기초' },
    ],
  },
  {
    id: 'in-not', group: 'prefix', root: 'in- · im- · ir- · il-', meaning: '부정 (~아닌)',
    origin: '라틴어', originWord: 'in- (~아닌)',
    words: [
      { w: 'incorrect',   p: [['in','아닌'],['correct','맞는']],     b: '맞지 않은',   m: '틀린',       lv: '기초' },
      { w: 'invisible',   p: [['in','아닌'],['visible','보이는']],   b: '보이지 않는', m: '보이지 않는', lv: '수능' },
      { w: 'impossible',  p: [['im','아닌'],['possible','가능한']],  b: '가능하지 않은', m: '불가능한',  lv: '기초' },
      { w: 'informal',    p: [['in','아닌'],['formal','격식의']],    b: '격식이 아닌', m: '비격식의',   lv: '수능' },
      { w: 'independent', p: [['in','아닌'],['dependent','의존하는']], b: '의존하지 않는', m: '독립적인', lv: '수능' },
    ],
  },
  {
    id: 'in-into', group: 'prefix', root: 'in- · im-', meaning: '안으로',
    origin: '라틴어', originWord: 'in- (안에)',
    words: [
      { w: 'include', p: [['in','안'],['clude','닫다']],     b: '안에 가두다',   m: '포함하다',   lv: '수능' },
      { w: 'import',  p: [['im','안'],['port','나르다']],    b: '안으로 나르다', m: '수입하다',   lv: '기초' },
      { w: 'inject',  p: [['in','안'],['ject','던지다']],    b: '안으로 던져넣다', m: '주사하다', lv: '수능' },
      { w: 'invade',  p: [['in','안'],['vade','가다']],      b: '안으로 쳐들어가다', m: '침입하다', lv: '고급' },
      { w: 'input',   p: [['in','안'],['put','놓다']],       b: '안에 넣다',     m: '입력',       lv: '기초' },
    ],
  },
  {
    id: 'pre', group: 'prefix', root: 'pre-', meaning: '미리 · 앞',
    origin: '라틴어', originWord: 'prae- (앞에)',
    words: [
      { w: 'prepare',     p: [['pre','미리'],['pare','준비하다']],  b: '미리 갖추다',   m: '준비하다',   lv: '기초' },
      { w: 'preview',     p: [['pre','미리'],['view','보다']],      b: '미리 보다',     m: '미리보기',   lv: '기초' },
      { w: 'predict',     p: [['pre','미리'],['dict','말하다']],    b: '미리 말하다',   m: '예측하다',   lv: '수능' },
      { w: 'prevent',     p: [['pre','미리'],['vent','오다']],      b: '미리 와서 막다', m: '예방하다',  lv: '수능' },
      { w: 'prehistoric', p: [['pre','앞'],['historic','역사의']],  b: '역사 이전의',   m: '선사시대의', lv: '고급' },
    ],
  },
  {
    id: 'pro', group: 'prefix', root: 'pro-', meaning: '앞으로',
    origin: '라틴어', originWord: 'pro- (앞으로)',
    words: [
      { w: 'progress', p: [['pro','앞으로'],['gress','걷다']],  b: '앞으로 걸어가다', m: '진보·발전', lv: '수능' },
      { w: 'project',  p: [['pro','앞으로'],['ject','던지다']], b: '앞으로 던지다',   m: '계획·기획',  lv: '기초' },
      { w: 'promote',  p: [['pro','앞으로'],['mote','움직이다']], b: '앞으로 밀어주다', m: '촉진·승진', lv: '수능' },
      { w: 'propose',  p: [['pro','앞으로'],['pose','놓다']],   b: '앞에 내놓다',     m: '제안하다',  lv: '수능' },
      { w: 'produce',  p: [['pro','앞으로'],['duce','이끌다']], b: '앞으로 끌어내다', m: '생산하다',  lv: '기초' },
    ],
  },
  {
    id: 'ex', group: 'prefix', root: 'ex- · e-', meaning: '밖으로',
    origin: '라틴어', originWord: 'ex- (밖으로)',
    words: [
      { w: 'exit',    p: [['ex','밖으로'],['it','가다']],     b: '밖으로 나가다',   m: '출구',     lv: '기초' },
      { w: 'export',  p: [['ex','밖으로'],['port','나르다']], b: '밖으로 나르다',   m: '수출하다', lv: '기초' },
      { w: 'expand',  p: [['ex','밖으로'],['pand','펼치다']], b: '밖으로 펼치다',   m: '확장하다', lv: '수능' },
      { w: 'exclude', p: [['ex','밖으로'],['clude','닫다']],  b: '밖에 가두다',     m: '제외하다', lv: '수능' },
      { w: 'extract', p: [['ex','밖으로'],['tract','끌다']],  b: '밖으로 끌어내다', m: '추출하다', lv: '고급' },
    ],
  },
  {
    id: 'sub', group: 'prefix', root: 'sub-', meaning: '아래 · 하위',
    origin: '라틴어', originWord: 'sub- (아래)',
    words: [
      { w: 'subway',    p: [['sub','아래'],['way','길']],          b: '아래의 길',     m: '지하철',   lv: '기초' },
      { w: 'submarine', p: [['sub','아래'],['marine','바다의']],   b: '바다 아래의 것', m: '잠수함',  lv: '수능' },
      { w: 'subtitle',  p: [['sub','아래'],['title','제목']],      b: '아래에 다는 글', m: '자막',    lv: '기초' },
      { w: 'subject',   p: [['sub','아래'],['ject','던지다']],     b: '아래에 놓인 것', m: '주제·과목', lv: '기초' },
      { w: 'suburb',    p: [['sub','하위'],['urb','도시']],        b: '도시에 딸린 곳', m: '교외',    lv: '고급' },
    ],
  },
  {
    id: 'inter', group: 'prefix', root: 'inter-', meaning: '사이 · 상호',
    origin: '라틴어', originWord: 'inter- (사이에)',
    words: [
      { w: 'internet',      p: [['inter','사이'],['net','망']],        b: '사이를 잇는 망',  m: '인터넷',   lv: '기초' },
      { w: 'international', p: [['inter','사이'],['national','국가의']], b: '국가 사이의',    m: '국제적인', lv: '기초' },
      { w: 'interview',     p: [['inter','상호'],['view','보다']],     b: '서로 마주 보다', m: '면접·인터뷰', lv: '기초' },
      { w: 'interact',      p: [['inter','상호'],['act','행동']],      b: '서로 행동하다',  m: '상호작용하다', lv: '수능' },
      { w: 'interrupt',     p: [['inter','사이'],['rupt','깨다']],     b: '사이를 깨고 들다', m: '방해하다', lv: '수능' },
    ],
  },
  {
    id: 'trans', group: 'prefix', root: 'trans-', meaning: '가로질러 · 변화',
    origin: '라틴어', originWord: 'trans- (가로질러)',
    words: [
      { w: 'transport', p: [['trans','가로질러'],['port','나르다']], b: '가로질러 나르다', m: '운송하다', lv: '수능' },
      { w: 'transfer',  p: [['trans','가로질러'],['fer','나르다']],  b: '가로질러 옮기다', m: '옮기다·이동', lv: '수능' },
      { w: 'translate', p: [['trans','가로질러'],['late','옮기다']], b: '말을 가로질러 옮기다', m: '번역하다', lv: '기초' },
      { w: 'transform', p: [['trans','변화'],['form','모양']],       b: '모양을 바꾸다',   m: '변형시키다', lv: '수능' },
      { w: 'transmit',  p: [['trans','가로질러'],['mit','보내다']],  b: '가로질러 보내다', m: '전송하다', lv: '고급' },
    ],
  },
  {
    id: 'com', group: 'prefix', root: 'com- · con- · co-', meaning: '함께',
    origin: '라틴어', originWord: 'cum (함께)',
    words: [
      { w: 'connect',   p: [['con','함께'],['nect','묶다']],      b: '함께 묶다',   m: '연결하다',  lv: '기초' },
      { w: 'combine',   p: [['com','함께'],['bine','둘씩']],      b: '둘을 함께 하다', m: '결합하다', lv: '수능' },
      { w: 'contact',   p: [['con','함께'],['tact','닿다']],      b: '함께 닿다',   m: '접촉·연락', lv: '기초' },
      { w: 'company',   p: [['com','함께'],['pany','빵']],        b: '빵을 함께 먹는 사이', m: '동료·회사', lv: '기초' },
      { w: 'cooperate', p: [['co','함께'],['operate','일하다']],  b: '함께 일하다', m: '협력하다',  lv: '수능' },
    ],
  },

  /* ===== 라틴어 어근 ===== */
  {
    id: 'spect', group: 'latin', root: 'spect · spic', meaning: '보다',
    origin: '라틴어', originWord: 'spectāre (바라보다)',
    words: [
      { w: 'respect',     p: [['re','다시'],['spect','보다']],   b: '거듭 돌아보다',   m: '존경하다', lv: '기초' },
      { w: 'inspect',     p: [['in','안'],['spect','보다']],     b: '안을 들여다보다', m: '점검하다', lv: '수능' },
      { w: 'suspect',     p: [['su','아래'],['spect','보다']],   b: '아래에서 몰래 보다', m: '의심하다', lv: '수능' },
      { w: 'prospect',    p: [['pro','앞'],['spect','보다']],    b: '앞을 내다봄',     m: '전망',     lv: '수능' },
      { w: 'spectator',   p: [['spect','보다'],['ator','사람']], b: '보는 사람',       m: '관중',     lv: '수능' },
      { w: 'perspective', p: [['per','통하여'],['spect','보다']], b: '꿰뚫어 보는 방식', m: '관점',    lv: '고급' },
    ],
  },
  {
    id: 'vis', group: 'latin', root: 'vis · vid', meaning: '보다',
    origin: '라틴어', originWord: 'vidēre (보다)',
    words: [
      { w: 'visible',  p: [['vis','보다'],['ible','할 수 있는']], b: '볼 수 있는',    m: '눈에 보이는', lv: '수능' },
      { w: 'vision',   p: [['vis','보다'],['ion','것']],          b: '보는 것',       m: '시력·시야',  lv: '수능' },
      { w: 'visit',    p: [['vis','보다'],['it','가다']],         b: '보러 가다',     m: '방문하다',   lv: '기초' },
      { w: 'evidence', p: [['e','밖으로'],['vid','보다']],        b: '밖으로 드러나 보이는 것', m: '증거', lv: '수능' },
      { w: 'supervise',p: [['super','위'],['vis','보다']],        b: '위에서 내려다보다', m: '감독하다', lv: '고급' },
    ],
  },
  {
    id: 'dict', group: 'latin', root: 'dict', meaning: '말하다',
    origin: '라틴어', originWord: 'dīcere (말하다)',
    words: [
      { w: 'dictionary', p: [['dict','말'],['ionary','모음']],   b: '말을 모은 것',    m: '사전',     lv: '기초' },
      { w: 'predict',    p: [['pre','미리'],['dict','말하다']],  b: '미리 말하다',     m: '예측하다', lv: '수능' },
      { w: 'contradict', p: [['contra','반대'],['dict','말하다']], b: '반대로 말하다',  m: '반박하다', lv: '고급' },
      { w: 'dictator',   p: [['dict','말하다'],['ator','사람']], b: '말로 다 정하는 사람', m: '독재자', lv: '수능' },
      { w: 'dictation',  p: [['dict','말하다'],['ation','것']],  b: '말한 것을 받아쓰기', m: '받아쓰기', lv: '수능' },
    ],
  },
  {
    id: 'voc', group: 'latin', root: 'voc · vok', meaning: '부르다 · 목소리',
    origin: '라틴어', originWord: 'vocāre (부르다)',
    words: [
      { w: 'voice',      p: [['voc','목소리']],                   b: '목소리',        m: '목소리',   lv: '기초' },
      { w: 'vocal',      p: [['voc','목소리'],['al','~의']],      b: '목소리의',      m: '목소리의', lv: '수능' },
      { w: 'vocabulary', p: [['voc','부르다'],['ulary','모음']],  b: '이름 불러 모은 것', m: '어휘',  lv: '기초' },
      { w: 'invoke',     p: [['in','안으로'],['voke','부르다']],  b: '안으로 불러들이다', m: '불러내다', lv: '고급' },
      { w: 'provoke',    p: [['pro','앞으로'],['voke','부르다']], b: '앞으로 불러내다', m: '자극하다', lv: '고급' },
    ],
  },
  {
    id: 'script', group: 'latin', root: 'scrib · script', meaning: '쓰다',
    origin: '라틴어', originWord: 'scrībere (쓰다)',
    words: [
      { w: 'describe',   p: [['de','아래로'],['scribe','쓰다']],  b: '죽 적어 내려가다', m: '묘사하다', lv: '수능' },
      { w: 'subscribe',  p: [['sub','아래'],['scribe','쓰다']],   b: '아래에 서명하다', m: '구독하다', lv: '수능' },
      { w: 'prescribe',  p: [['pre','미리'],['scribe','쓰다']],   b: '미리 써 주다',    m: '처방하다', lv: '고급' },
      { w: 'manuscript', p: [['manu','손'],['script','쓴 것']],   b: '손으로 쓴 것',    m: '원고',     lv: '고급' },
      { w: 'script',     p: [['script','쓴 것']],                 b: '쓰여진 것',       m: '대본',     lv: '수능' },
    ],
  },
  {
    id: 'port', group: 'latin', root: 'port', meaning: '나르다 · 항구',
    origin: '라틴어', originWord: 'portāre (나르다)',
    words: [
      { w: 'import',    p: [['im','안'],['port','나르다']],     b: '안으로 나르다',   m: '수입하다', lv: '기초' },
      { w: 'export',    p: [['ex','밖'],['port','나르다']],     b: '밖으로 나르다',   m: '수출하다', lv: '기초' },
      { w: 'transport', p: [['trans','가로질러'],['port','나르다']], b: '가로질러 나르다', m: '운송하다', lv: '수능' },
      { w: 'support',   p: [['sup','아래'],['port','나르다']],  b: '아래서 받쳐 나르다', m: '지지하다', lv: '기초' },
      { w: 'portable',  p: [['port','나르다'],['able','할 수 있는']], b: '나를 수 있는', m: '휴대용의', lv: '수능' },
    ],
  },
  {
    id: 'fer', group: 'latin', root: 'fer', meaning: '나르다 · 가져오다',
    origin: '라틴어', originWord: 'ferre (나르다)',
    words: [
      { w: 'transfer', p: [['trans','가로질러'],['fer','나르다']], b: '가로질러 옮기다', m: '옮기다·이동', lv: '수능' },
      { w: 'refer',    p: [['re','뒤로'],['fer','나르다']],       b: '뒤로 가져가 대다', m: '참조하다', lv: '수능' },
      { w: 'prefer',   p: [['pre','먼저'],['fer','나르다']],      b: '먼저 가져오다',   m: '선호하다', lv: '기초' },
      { w: 'offer',    p: [['of','향하여'],['fer','나르다']],     b: '~에게 가져다주다', m: '제안하다', lv: '기초' },
      { w: 'suffer',   p: [['suf','아래'],['fer','나르다']],      b: '아래에서 떠받치다', m: '겪다·고통받다', lv: '수능' },
    ],
  },
  {
    id: 'miss', group: 'latin', root: 'mit · miss', meaning: '보내다',
    origin: '라틴어', originWord: 'mittere (보내다)',
    words: [
      { w: 'submit',   p: [['sub','아래'],['mit','보내다']],   b: '아래로 보내다',   m: '제출하다', lv: '수능' },
      { w: 'admit',    p: [['ad','~로'],['mit','보내다']],     b: '안으로 들여보내다', m: '인정·입장 허가', lv: '수능' },
      { w: 'permit',   p: [['per','통하여'],['mit','보내다']], b: '통과시켜 보내다', m: '허락하다', lv: '수능' },
      { w: 'mission',  p: [['miss','보내다'],['ion','것']],    b: '보내진 일',       m: '임무',     lv: '기초' },
      { w: 'transmit', p: [['trans','가로질러'],['mit','보내다']], b: '가로질러 보내다', m: '전송하다', lv: '고급' },
    ],
  },
  {
    id: 'duct', group: 'latin', root: 'duc · duct', meaning: '이끌다',
    origin: '라틴어', originWord: 'dūcere (이끌다)',
    words: [
      { w: 'introduce', p: [['intro','안으로'],['duce','이끌다']], b: '안으로 이끌어들이다', m: '소개하다', lv: '기초' },
      { w: 'produce',   p: [['pro','앞으로'],['duce','이끌다']],  b: '앞으로 끌어내다',  m: '생산하다', lv: '기초' },
      { w: 'reduce',    p: [['re','뒤로'],['duce','이끌다']],     b: '뒤로 끌어내리다',  m: '줄이다',   lv: '수능' },
      { w: 'conduct',   p: [['con','함께'],['duct','이끌다']],    b: '함께 이끌다',      m: '수행·지휘하다', lv: '수능' },
      { w: 'educate',   p: [['e','밖으로'],['duc','이끌다']],     b: '잠재력을 밖으로 끌어내다', m: '교육하다', lv: '수능' },
    ],
  },
  {
    id: 'tract', group: 'latin', root: 'tract', meaning: '끌다',
    origin: '라틴어', originWord: 'trahere (끌다)',
    words: [
      { w: 'attract',  p: [['at','~쪽으로'],['tract','끌다']], b: '~쪽으로 끌어당기다', m: '매혹하다', lv: '수능' },
      { w: 'extract',  p: [['ex','밖으로'],['tract','끌다']],  b: '밖으로 끌어내다',   m: '추출하다', lv: '고급' },
      { w: 'subtract', p: [['sub','아래'],['tract','끌다']],   b: '아래로 끌어내리다', m: '빼다',     lv: '수능' },
      { w: 'contract', p: [['con','함께'],['tract','끌다']],   b: '서로 끌어당겨 묶다', m: '계약·수축', lv: '수능' },
      { w: 'tractor',  p: [['tract','끌다'],['or','기계']],    b: '끄는 기계',         m: '트랙터',   lv: '기초' },
    ],
  },
  {
    id: 'ject', group: 'latin', root: 'ject', meaning: '던지다',
    origin: '라틴어', originWord: 'iacere (던지다)',
    words: [
      { w: 'inject',  p: [['in','안으로'],['ject','던지다']],  b: '안으로 던져넣다',  m: '주사하다', lv: '수능' },
      { w: 'reject',  p: [['re','뒤로'],['ject','던지다']],    b: '뒤로 던져버리다',  m: '거절하다', lv: '수능' },
      { w: 'project', p: [['pro','앞으로'],['ject','던지다']], b: '앞으로 던지다',    m: '계획·기획', lv: '기초' },
      { w: 'eject',   p: [['e','밖으로'],['ject','던지다']],   b: '밖으로 던져내다',  m: '내쫓다·배출', lv: '고급' },
      { w: 'object',  p: [['ob','맞서'],['ject','던지다']],    b: '맞서 던지다',      m: '반대하다·물체', lv: '수능' },
    ],
  },
  {
    id: 'pos', group: 'latin', root: 'pos · pon', meaning: '놓다',
    origin: '라틴어', originWord: 'pōnere (놓다)',
    words: [
      { w: 'position', p: [['pos','놓다'],['ition','것']],     b: '놓여 있는 자리',  m: '위치',     lv: '기초' },
      { w: 'expose',   p: [['ex','밖으로'],['pose','놓다']],   b: '밖에 내놓다',     m: '드러내다', lv: '수능' },
      { w: 'compose',  p: [['com','함께'],['pose','놓다']],    b: '함께 놓아 짜다',  m: '구성·작곡하다', lv: '수능' },
      { w: 'propose',  p: [['pro','앞으로'],['pose','놓다']],  b: '앞에 내놓다',     m: '제안하다', lv: '수능' },
      { w: 'deposit',  p: [['de','아래로'],['posit','놓다']],  b: '아래에 놓아두다', m: '예금·보증금', lv: '고급' },
    ],
  },
  {
    id: 'tain', group: 'latin', root: 'ten · tain', meaning: '잡다 · 유지하다',
    origin: '라틴어', originWord: 'tenēre (잡고 있다)',
    words: [
      { w: 'contain',  p: [['con','함께'],['tain','잡다']],    b: '함께 붙잡고 있다', m: '담고 있다', lv: '수능' },
      { w: 'maintain', p: [['main','손'],['tain','잡다']],     b: '손에 계속 쥐고 있다', m: '유지하다', lv: '수능' },
      { w: 'obtain',   p: [['ob','향하여'],['tain','잡다']],   b: '~을 향해 붙잡다', m: '얻다',     lv: '고급' },
      { w: 'retain',   p: [['re','뒤로'],['tain','잡다']],     b: '뒤로 계속 쥐다',  m: '보유하다', lv: '고급' },
      { w: 'continue', p: [['con','함께'],['tinue','잡다']],   b: '계속 붙잡고 가다', m: '계속하다', lv: '기초' },
    ],
  },
  {
    id: 'cept', group: 'latin', root: 'cap · cept · cip', meaning: '잡다 · 받다',
    origin: '라틴어', originWord: 'capere (잡다)',
    words: [
      { w: 'capture',  p: [['cap','잡다'],['ture','것']],      b: '붙잡는 것',     m: '포획하다', lv: '수능' },
      { w: 'accept',   p: [['ac','~쪽으로'],['cept','받다']],  b: '~쪽으로 받아들이다', m: '받아들이다', lv: '기초' },
      { w: 'except',   p: [['ex','밖으로'],['cept','잡다']],   b: '밖으로 집어내다', m: '~을 제외하고', lv: '수능' },
      { w: 'capable',  p: [['cap','잡다'],['able','할 수 있는']], b: '붙잡을 수 있는', m: '능력 있는', lv: '수능' },
      { w: 'receive',  p: [['re','뒤로'],['ceive','받다']],    b: '받아 들이다',   m: '받다',     lv: '기초' },
    ],
  },
  {
    id: 'fact', group: 'latin', root: 'fac · fic · fect', meaning: '만들다 · 하다',
    origin: '라틴어', originWord: 'facere (만들다)',
    words: [
      { w: 'factory', p: [['fact','만들다'],['ory','장소']],   b: '만드는 장소',   m: '공장',     lv: '기초' },
      { w: 'fact',    p: [['fact','만들어진 것']],             b: '실제로 일어난 것', m: '사실',    lv: '기초' },
      { w: 'effect',  p: [['ef','밖으로'],['fect','만들다']],  b: '밖으로 만들어낸 것', m: '효과·결과', lv: '수능' },
      { w: 'perfect', p: [['per','완전히'],['fect','만들다']], b: '완전하게 만든',  m: '완벽한',   lv: '기초' },
      { w: 'fiction', p: [['fic','만들다'],['tion','것']],     b: '지어낸 것',     m: '소설·허구', lv: '수능' },
    ],
  },
  {
    id: 'mot', group: 'latin', root: 'mov · mot', meaning: '움직이다',
    origin: '라틴어', originWord: 'movēre (움직이다)',
    words: [
      { w: 'move',    p: [['mov','움직이다']],                 b: '움직이다',      m: '움직이다', lv: '기초' },
      { w: 'motion',  p: [['mot','움직이다'],['ion','것']],    b: '움직이는 것',   m: '움직임',   lv: '수능' },
      { w: 'motor',   p: [['mot','움직이다'],['or','기계']],   b: '움직이게 하는 기계', m: '모터', lv: '기초' },
      { w: 'remove',  p: [['re','뒤로'],['move','움직이다']],  b: '뒤로 옮겨버리다', m: '제거하다', lv: '수능' },
      { w: 'emotion', p: [['e','밖으로'],['motion','움직임']], b: '마음이 밖으로 움직임', m: '감정', lv: '수능' },
    ],
  },
  {
    id: 'vert', group: 'latin', root: 'vert · vers', meaning: '돌다 · 바꾸다',
    origin: '라틴어', originWord: 'vertere (돌리다)',
    words: [
      { w: 'convert',     p: [['con','완전히'],['vert','돌리다']], b: '완전히 돌려놓다', m: '전환하다', lv: '고급' },
      { w: 'reverse',     p: [['re','뒤로'],['vers','돌리다']],    b: '뒤로 돌리다',     m: '뒤집다·역',  lv: '수능' },
      { w: 'version',     p: [['vers','돌다'],['ion','것']],       b: '돌려서 바뀐 것',  m: '~판·버전',   lv: '기초' },
      { w: 'universe',    p: [['uni','하나'],['verse','돌다']],    b: '하나로 돌아가는 전체', m: '우주', lv: '수능' },
      { w: 'advertise',   p: [['ad','~쪽으로'],['vert','돌리다']], b: '마음을 ~쪽으로 돌리다', m: '광고하다', lv: '수능' },
    ],
  },
  {
    id: 'spir', group: 'latin', root: 'spir', meaning: '숨쉬다',
    origin: '라틴어', originWord: 'spīrāre (숨쉬다)',
    words: [
      { w: 'spirit',  p: [['spir','숨'],['it','것']],         b: '숨, 곧 생명의 기운', m: '정신·영혼', lv: '수능' },
      { w: 'inspire', p: [['in','안으로'],['spire','숨쉬다']], b: '안으로 숨을 불어넣다', m: '영감을 주다', lv: '수능' },
      { w: 'expire',  p: [['ex','밖으로'],['spire','숨쉬다']], b: '숨을 다 내쉬다', m: '만료되다', lv: '고급' },
      { w: 'perspire',p: [['per','통하여'],['spire','숨쉬다']],b: '피부로 숨을 내보내다', m: '땀 흘리다', lv: '고급' },
      { w: 'conspire',p: [['con','함께'],['spire','숨쉬다']], b: '함께 숨죽여 모의하다', m: '음모를 꾸미다', lv: '고급' },
    ],
  },

  /* ===== 그리스어 어근 ===== */
  {
    id: 'bio', group: 'greek', root: 'bio', meaning: '생명',
    origin: '그리스어', originWord: 'bíos (생명)',
    words: [
      { w: 'biology',     p: [['bio','생명'],['logy','학문']],     b: '생명에 관한 학문', m: '생물학',   lv: '기초' },
      { w: 'biography',   p: [['bio','생명'],['graphy','기록']],   b: '한 사람의 삶을 기록한 것', m: '전기', lv: '수능' },
      { w: 'antibiotic',  p: [['anti','반대'],['bio','생명']],     b: '미생물에 맞서는 것', m: '항생제', lv: '고급' },
      { w: 'biorhythm',   p: [['bio','생명'],['rhythm','리듬']],   b: '생명의 리듬',     m: '생체리듬', lv: '고급' },
    ],
  },
  {
    id: 'geo', group: 'greek', root: 'geo', meaning: '땅 · 지구',
    origin: '그리스어', originWord: 'gê (땅)',
    words: [
      { w: 'geography', p: [['geo','땅'],['graphy','기록']], b: '땅을 기록한 것', m: '지리학',   lv: '기초' },
      { w: 'geology',   p: [['geo','땅'],['logy','학문']],   b: '땅에 관한 학문', m: '지질학',   lv: '수능' },
      { w: 'geometry',  p: [['geo','땅'],['metry','측정']],  b: '땅을 재는 법',   m: '기하학',   lv: '수능' },
      { w: 'geothermal',p: [['geo','땅'],['thermal','열의']],b: '땅의 열의',     m: '지열의',   lv: '고급' },
    ],
  },
  {
    id: 'graph', group: 'greek', root: 'graph · gram', meaning: '쓰다 · 그리다',
    origin: '그리스어', originWord: 'gráphein (쓰다)',
    words: [
      { w: 'photograph', p: [['photo','빛'],['graph','그리다']], b: '빛으로 그린 것', m: '사진',   lv: '기초' },
      { w: 'autograph',  p: [['auto','스스로'],['graph','쓰다']], b: '스스로 쓴 글씨', m: '서명',   lv: '수능' },
      { w: 'paragraph',  p: [['para','옆에'],['graph','쓰다']],  b: '옆에 따로 쓴 덩어리', m: '단락', lv: '수능' },
      { w: 'telegram',   p: [['tele','멀리'],['gram','쓴 것']],  b: '멀리 보내는 글',  m: '전보',   lv: '고급' },
      { w: 'diagram',    p: [['dia','가로질러'],['gram','그린 것']], b: '죽 가로질러 그린 것', m: '도표', lv: '수능' },
    ],
  },
  {
    id: 'logy', group: 'greek', root: 'log · logy', meaning: '말 · 학문',
    origin: '그리스어', originWord: 'lógos (말·이치)',
    words: [
      { w: 'dialogue',   p: [['dia','사이'],['logue','말']],     b: '사이에 오가는 말', m: '대화',   lv: '수능' },
      { w: 'logic',      p: [['log','이치'],['ic','~의']],       b: '말의 이치',     m: '논리',     lv: '수능' },
      { w: 'apology',    p: [['apo','벗어나'],['logy','말']],    b: '벗어나려 하는 말', m: '사과',   lv: '수능' },
      { w: 'technology', p: [['techno','기술'],['logy','학문']], b: '기술에 관한 학문', m: '기술',   lv: '기초' },
      { w: 'catalog',    p: [['cata','아래로'],['log','말']],    b: '죽 아래로 적은 말', m: '목록',   lv: '고급' },
    ],
  },
  {
    id: 'phon', group: 'greek', root: 'phon', meaning: '소리',
    origin: '그리스어', originWord: 'phōnḗ (소리)',
    words: [
      { w: 'telephone',  p: [['tele','멀리'],['phone','소리']],  b: '소리를 멀리 보내는 것', m: '전화', lv: '기초' },
      { w: 'microphone', p: [['micro','작은'],['phone','소리']], b: '작은 소리를 키우는 것', m: '마이크', lv: '기초' },
      { w: 'symphony',   p: [['sym','함께'],['phony','소리']],   b: '소리가 함께 어우러짐', m: '교향곡', lv: '고급' },
      { w: 'phonics',    p: [['phon','소리'],['ics','학']],      b: '소리로 글자 익히기', m: '파닉스', lv: '수능' },
    ],
  },
  {
    id: 'tele', group: 'greek', root: 'tele', meaning: '멀리',
    origin: '그리스어', originWord: 'têle (멀리)',
    words: [
      { w: 'telephone',  p: [['tele','멀리'],['phone','소리']],  b: '소리를 멀리 보내는 것', m: '전화', lv: '기초' },
      { w: 'television', p: [['tele','멀리'],['vision','보다']], b: '멀리 있는 것을 보다', m: '텔레비전', lv: '기초' },
      { w: 'telescope',  p: [['tele','멀리'],['scope','보다']],  b: '멀리 있는 것을 보는 기구', m: '망원경', lv: '수능' },
      { w: 'telepathy',  p: [['tele','멀리'],['pathy','느낌']],  b: '멀리서도 느낌이 통함', m: '텔레파시', lv: '고급' },
    ],
  },
  {
    id: 'photo', group: 'greek', root: 'photo', meaning: '빛',
    origin: '그리스어', originWord: 'phôs (빛)',
    words: [
      { w: 'photo',         p: [['photo','빛']],                       b: '빛으로 담은 것', m: '사진',   lv: '기초' },
      { w: 'photograph',    p: [['photo','빛'],['graph','그리다']],    b: '빛으로 그린 것', m: '사진',   lv: '기초' },
      { w: 'photosynthesis',p: [['photo','빛'],['synthesis','합성']],  b: '빛으로 양분을 합성함', m: '광합성', lv: '고급' },
      { w: 'photogenic',    p: [['photo','빛'],['genic','잘 받는']],   b: '빛을 잘 받는',   m: '사진이 잘 받는', lv: '고급' },
    ],
  },
  {
    id: 'scope', group: 'greek', root: 'scope · scop', meaning: '보다 · 관찰하다',
    origin: '그리스어', originWord: 'skopeîn (살펴보다)',
    words: [
      { w: 'telescope',  p: [['tele','멀리'],['scope','보다']],  b: '멀리 보는 기구',   m: '망원경',   lv: '수능' },
      { w: 'microscope', p: [['micro','작은'],['scope','보다']], b: '작은 것을 보는 기구', m: '현미경', lv: '수능' },
      { w: 'periscope',  p: [['peri','둘레'],['scope','보다']],  b: '둘레를 살펴보는 기구', m: '잠망경', lv: '고급' },
    ],
  },
  {
    id: 'auto', group: 'greek', root: 'auto', meaning: '스스로',
    origin: '그리스어', originWord: 'autós (스스로)',
    words: [
      { w: 'automatic',     p: [['auto','스스로'],['matic','움직이는']], b: '스스로 움직이는', m: '자동의', lv: '수능' },
      { w: 'automobile',    p: [['auto','스스로'],['mobile','움직이는']], b: '스스로 움직이는 것', m: '자동차', lv: '수능' },
      { w: 'autograph',     p: [['auto','스스로'],['graph','쓰다']],     b: '스스로 쓴 글씨',  m: '서명',   lv: '수능' },
      { w: 'autobiography', p: [['auto','스스로'],['bio','생명'],['graphy','기록']], b: '스스로 쓴 인생 기록', m: '자서전', lv: '고급' },
    ],
  },
  {
    id: 'psych', group: 'greek', root: 'psych', meaning: '마음 · 정신',
    origin: '그리스어', originWord: 'psūkhḗ (영혼)',
    words: [
      { w: 'psychology',   p: [['psych','마음'],['logy','학문']],   b: '마음에 관한 학문', m: '심리학',   lv: '수능' },
      { w: 'psychologist', p: [['psych','마음'],['logist','학자']], b: '마음을 연구하는 사람', m: '심리학자', lv: '수능' },
      { w: 'psychic',      p: [['psych','마음'],['ic','~의']],      b: '마음·정신의',     m: '초자연적인', lv: '고급' },
    ],
  },

  /* ===== 접두사 (GRE 확장) ===== */
  {
    id: 'ab', group: 'prefix', root: 'ab- · abs-', meaning: '떨어져 · 벗어나',
    origin: '라틴어', originWord: 'ab (~로부터)',
    words: [
      { w: 'absent',   p: [['ab','떨어져'],['sent','있다']],    b: '떨어져 있는',     m: '결석한',     lv: '기초' },
      { w: 'absorb',   p: [['ab','~로부터'],['sorb','빨아들이다']], b: '빨아들이다',   m: '흡수하다',   lv: '수능' },
      { w: 'abnormal', p: [['ab','벗어난'],['normal','정상']],  b: '정상에서 벗어난', m: '비정상의',   lv: '수능' },
      { w: 'abstract', p: [['abs','떨어져'],['tract','끌다']],  b: '끌어내어 떼어낸', m: '추상적인',   lv: '고급' },
      { w: 'abstain',  p: [['abs','떨어져'],['tain','잡다']],   b: '손을 떼고 있다',  m: '삼가다',     lv: 'GRE' },
    ],
  },
  {
    id: 'circum', group: 'prefix', root: 'circum-', meaning: '둘레에',
    origin: '라틴어', originWord: 'circum (둘레)',
    words: [
      { w: 'circulate',     p: [['circul','둘레로 돌다'],['ate','~하다']], b: '둘레로 돌다',       m: '순환하다',     lv: '수능' },
      { w: 'circumstance',  p: [['circum','둘레'],['stance','서 있음']],   b: '둘레에 서 있는 것', m: '상황',         lv: '수능' },
      { w: 'circumference', p: [['circum','둘레'],['fer','나르다'],['ence','것']], b: '둘레를 한 바퀴 돈 것', m: '원주', lv: '고급' },
      { w: 'circumspect',   p: [['circum','둘레'],['spect','보다']],       b: '둘레를 살피는',     m: '신중한',       lv: 'GRE' },
      { w: 'circumvent',    p: [['circum','둘레'],['vent','가다']],        b: '둘레로 돌아가다',   m: '우회하다·교묘히 피하다', lv: 'GRE' },
    ],
  },
  {
    id: 'per', group: 'prefix', root: 'per-', meaning: '완전히 · 통하여',
    origin: '라틴어', originWord: 'per (통과하여)',
    words: [
      { w: 'perform',   p: [['per','완전히'],['form','갖추다']],         b: '끝까지 갖추다',     m: '수행하다·공연하다', lv: '기초' },
      { w: 'persuade',  p: [['per','완전히'],['suade','권하다']],        b: '완전히 마음을 돌리도록 권하다', m: '설득하다', lv: '수능' },
      { w: 'persist',   p: [['per','끝까지'],['sist','서다']],           b: '끝까지 서 있다',    m: '고집·지속하다', lv: '수능' },
      { w: 'pervade',   p: [['per','통하여'],['vade','가다']],           b: '구석구석 퍼져 가다', m: '만연하다',     lv: 'GRE' },
      { w: 'perennial', p: [['per','내내'],['enn','해'],['ial','~의']],  b: '여러 해 내내 가는', m: '다년생의·끊임없는', lv: 'GRE' },
    ],
  },
  {
    id: 'super', group: 'prefix', root: 'super- · sur-', meaning: '위 · 초과',
    origin: '라틴어', originWord: 'super (위에)',
    words: [
      { w: 'surface',   p: [['sur','위'],['face','면']],            b: '위쪽 면',          m: '표면',     lv: '기초' },
      { w: 'superior',  p: [['super','위'],['ior','더한']],         b: '더 위에 있는',     m: '우월한',   lv: '수능' },
      { w: 'surpass',   p: [['sur','넘어'],['pass','지나가다']],    b: '넘어 지나가다',    m: '능가하다', lv: '수능' },
      { w: 'surplus',   p: [['sur','초과'],['plus','더한']],        b: '넘쳐 더해진 것',   m: '잉여',     lv: '고급' },
      { w: 'supersede', p: [['super','위'],['sede','앉다']],        b: '위에 앉아 밀어내다', m: '대체하다', lv: 'GRE' },
    ],
  },
  {
    id: 'contra', group: 'prefix', root: 'contra- · counter-', meaning: '반대 · 맞서',
    origin: '라틴어', originWord: 'contra (맞서)',
    words: [
      { w: 'contrast',     p: [['contra','반대'],['st','서다']],            b: '반대로 세워 둠',     m: '대조',     lv: '수능' },
      { w: 'contrary',     p: [['contra','반대'],['ary','~되는']],          b: '반대되는',          m: '정반대의', lv: '수능' },
      { w: 'contradict',   p: [['contra','반대'],['dict','말하다']],        b: '반대로 말하다',      m: '모순되다·반박하다', lv: '고급' },
      { w: 'controversy',  p: [['contro','반대'],['vers','돌다'],['y','것']], b: '의견이 반대로 도는 것', m: '논쟁',  lv: '고급' },
      { w: 'counterfeit',  p: [['counter','반대로'],['feit','만들다']],     b: '진짜에 맞서 만든',   m: '위조의',   lv: 'GRE' },
    ],
  },
  {
    id: 'mal', group: 'prefix', root: 'mal-', meaning: '나쁜',
    origin: '라틴어', originWord: 'malus (나쁜)',
    words: [
      { w: 'malfunction', p: [['mal','나쁜'],['function','작동']],          b: '나쁘게 작동함',   m: '오작동',   lv: '수능' },
      { w: 'malice',      p: [['mal','나쁜'],['ice','마음']],               b: '나쁜 마음',       m: '악의',     lv: '고급' },
      { w: 'malady',      p: [['mal','나쁜'],['ady','상태']],               b: '나쁜 상태',       m: '질병',     lv: 'GRE' },
      { w: 'malignant',   p: [['malign','해를 끼치다'],['ant','~하는']],    b: '해를 끼치는',     m: '악성의',   lv: 'GRE' },
      { w: 'malevolent',  p: [['mal','나쁜'],['vol','바라다'],['ent','~한']], b: '나쁘게 되길 바라는', m: '악의적인', lv: 'GRE' },
    ],
  },
  {
    id: 'bene', group: 'prefix', root: 'bene-', meaning: '좋은 · 잘',
    origin: '라틴어', originWord: 'bene (잘·좋게)',
    words: [
      { w: 'benefit',     p: [['bene','좋게'],['fit','하다']],              b: '좋게 해 주는 것', m: '이익',     lv: '기초' },
      { w: 'beneficial',  p: [['bene','좋게'],['fic','만들다'],['ial','~한']], b: '좋게 만들어 주는', m: '유익한', lv: '수능' },
      { w: 'benefactor',  p: [['bene','좋게'],['factor','행하는 사람']],    b: '좋은 일을 하는 사람', m: '후원자', lv: '고급' },
      { w: 'benign',      p: [['ben','좋은'],['ign','성질의']],             b: '좋은 성질의',     m: '양성의·온화한', lv: 'GRE' },
      { w: 'benevolent',  p: [['bene','좋게'],['vol','바라다'],['ent','~한']], b: '잘되길 바라는', m: '자비로운', lv: 'GRE' },
    ],
  },
  {
    id: 'syn', group: 'prefix', root: 'syn- · sym-', meaning: '함께 · 같이',
    origin: '그리스어', originWord: 'syn (함께)',
    words: [
      { w: 'symbol',      p: [['sym','함께'],['bol','던지다']],             b: '뜻을 함께 던져 놓은 것', m: '상징', lv: '수능' },
      { w: 'sympathy',    p: [['sym','함께'],['pathy','느낌']],             b: '함께 느낌',       m: '동정·공감', lv: '수능' },
      { w: 'synonym',     p: [['syn','같이'],['onym','이름']],              b: '같은 이름',       m: '동의어',   lv: '수능' },
      { w: 'synthesis',   p: [['syn','함께'],['thesis','놓다']],            b: '함께 놓아 합침',  m: '종합·합성', lv: '고급' },
      { w: 'synchronize', p: [['syn','함께'],['chron','시간'],['ize','~하다']], b: '시간을 함께 맞추다', m: '동시에 움직이다', lv: '고급' },
    ],
  },

  /* ===== 접미사 ===== */
  {
    id: 'suf-able', group: 'suffix', root: '-able · -ible', meaning: '~할 수 있는',
    origin: '라틴어', originWord: '-abilis (~할 만한)',
    words: [
      { w: 'reliable',   p: [['rely','의지하다'],['able','할 수 있는']],         b: '의지할 수 있는', m: '믿을 만한',   lv: '수능' },
      { w: 'flexible',   p: [['flex','구부리다'],['ible','할 수 있는']],         b: '구부릴 수 있는', m: '유연한',     lv: '수능' },
      { w: 'feasible',   p: [['feas','해내다'],['ible','할 수 있는']],           b: '해낼 수 있는',   m: '실현 가능한', lv: '고급' },
      { w: 'inevitable', p: [['in','아닌'],['evit','피하다'],['able','할 수 있는']], b: '피할 수 없는', m: '불가피한', lv: 'GRE' },
      { w: 'plausible',  p: [['plaus','박수치다'],['ible','할 만한']],           b: '박수받을 만한', m: '그럴듯한',   lv: 'GRE' },
    ],
  },
  {
    id: 'suf-ous', group: 'suffix', root: '-ous', meaning: '~이 많은 · ~한',
    origin: '라틴어', originWord: '-osus (~이 가득한)',
    words: [
      { w: 'famous',     p: [['fam','명성'],['ous','~이 많은']],               b: '명성이 많은',     m: '유명한',   lv: '기초' },
      { w: 'generous',   p: [['gener','넉넉함'],['ous','~한']],                b: '넉넉한',          m: '관대한',   lv: '수능' },
      { w: 'anonymous',  p: [['an','없는'],['onym','이름'],['ous','~한']],     b: '이름이 없는',     m: '익명의',   lv: '고급' },
      { w: 'ambiguous',  p: [['ambi','양쪽'],['gu','몰다'],['ous','~한']],     b: '양쪽으로 몰리는', m: '애매한',   lv: 'GRE' },
      { w: 'meticulous', p: [['meticul','두려움'],['ous','~한']],              b: '두려울 만큼 꼼꼼한', m: '세심한', lv: 'GRE' },
    ],
  },
  {
    id: 'suf-ize', group: 'suffix', root: '-ize', meaning: '~화하다 · ~하게 만들다',
    origin: '그리스어', originWord: '-izein (~하게 하다)',
    words: [
      { w: 'realize',    p: [['real','실제'],['ize','~화하다']],               b: '실제가 되게 하다', m: '실현·깨닫다', lv: '기초' },
      { w: 'criticize',  p: [['critic','비평'],['ize','~하다']],               b: '비평하다',         m: '비판하다',   lv: '수능' },
      { w: 'emphasize',  p: [['emphas','강조'],['ize','~하다']],               b: '강조하다',         m: '강조하다',   lv: '수능' },
      { w: 'jeopardize', p: [['jeopard','위험'],['ize','~화하다']],            b: '위험에 빠뜨리다',  m: '위태롭게 하다', lv: 'GRE' },
      { w: 'scrutinize', p: [['scrutin','자세히 살핌'],['ize','~하다']],       b: '샅샅이 살피다',    m: '면밀히 조사하다', lv: 'GRE' },
    ],
  },
  {
    id: 'suf-ify', group: 'suffix', root: '-ify · -fy', meaning: '~하게 만들다',
    origin: '라틴어', originWord: '-ficare (~로 만들다)',
    words: [
      { w: 'clarify',    p: [['clar','맑은'],['ify','~하게 만들다']],          b: '맑게 만들다',     m: '명확히 하다', lv: '수능' },
      { w: 'justify',    p: [['just','옳은'],['ify','~하게 만들다']],          b: '옳게 만들다',     m: '정당화하다', lv: '수능' },
      { w: 'magnify',    p: [['magn','큰'],['ify','~하게 만들다']],            b: '크게 만들다',     m: '확대하다',   lv: '수능' },
      { w: 'intensify',  p: [['intens','강한'],['ify','~하게 만들다']],        b: '강하게 만들다',   m: '강화하다',   lv: '고급' },
      { w: 'exemplify',  p: [['exempl','본보기'],['ify','~로 만들다']],        b: '본보기로 만들다', m: '예시하다',   lv: 'GRE' },
    ],
  },
  {
    id: 'suf-ism', group: 'suffix', root: '-ism', meaning: '~주의 · ~한 태도',
    origin: '그리스어', originWord: '-ismos (~상태·주의)',
    words: [
      { w: 'criticism',  p: [['critic','비평'],['ism','~하는 태도']],          b: '비평하는 태도',   m: '비판',     lv: '수능' },
      { w: 'optimism',   p: [['optim','가장 좋은'],['ism','~주의']],           b: '가장 좋게 보는 태도', m: '낙관주의', lv: '수능' },
      { w: 'skepticism', p: [['skeptic','의심하는'],['ism','~주의']],          b: '의심하는 태도',   m: '회의주의', lv: 'GRE' },
      { w: 'altruism',   p: [['altru','남'],['ism','~주의']],                  b: '남을 위하는 태도', m: '이타주의', lv: 'GRE' },
      { w: 'plagiarism', p: [['plagiar','납치자'],['ism','~하는 짓']],         b: '남의 글을 훔치는 짓', m: '표절',  lv: 'GRE' },
    ],
  },
  {
    id: 'suf-ity', group: 'suffix', root: '-ity · -ty', meaning: '~성질 · ~상태',
    origin: '라틴어', originWord: '-itas (~성질)',
    words: [
      { w: 'ability',   p: [['abil','할 수 있는'],['ity','~성질']],           b: '할 수 있는 성질', m: '능력',     lv: '기초' },
      { w: 'adversity', p: [['advers','맞서는'],['ity','~상황']],             b: '맞서는 상황',     m: '역경',     lv: '고급' },
      { w: 'proximity', p: [['proxim','가까운'],['ity','~상태']],             b: '가까운 상태',     m: '근접',     lv: '고급' },
      { w: 'integrity', p: [['integr','온전한'],['ity','~상태']],             b: '온전한 상태',     m: '진실성·청렴', lv: 'GRE' },
      { w: 'austerity', p: [['auster','엄격한'],['ity','~상태']],             b: '엄격한 상태',     m: '긴축·내핍', lv: 'GRE' },
    ],
  },
  {
    id: 'suf-cide', group: 'suffix', root: '-cide', meaning: '죽이다 · 베다',
    origin: '라틴어', originWord: 'caedere (베다·죽이다)',
    words: [
      { w: 'suicide',    p: [['sui','자기'],['cide','죽이다']],                b: '자기를 죽임',     m: '자살',     lv: '수능' },
      { w: 'pesticide',  p: [['pest','해충'],['cide','죽이다']],               b: '해충을 죽이는 것', m: '살충제',   lv: '수능' },
      { w: 'herbicide',  p: [['herb','풀'],['cide','죽이다']],                 b: '풀을 죽이는 것',  m: '제초제',   lv: '고급' },
      { w: 'homicide',   p: [['homi','사람'],['cide','죽이다']],               b: '사람을 죽임',     m: '살인',     lv: '고급' },
      { w: 'genocide',   p: [['geno','종족'],['cide','죽이다']],               b: '종족을 죽임',     m: '대량 학살', lv: 'GRE' },
    ],
  },
  {
    id: 'suf-ant', group: 'suffix', root: '-ant · -ent', meaning: '~하는 (성질·사람)',
    origin: '라틴어', originWord: '-ans / -ens (~하는)',
    words: [
      { w: 'persistent',  p: [['persist','버티다'],['ent','~하는']],           b: '끝까지 버티는',   m: '끈질긴',   lv: '수능' },
      { w: 'arrogant',    p: [['arrog','요구하다'],['ant','~하는']],           b: '제 것인 양 요구하는', m: '거만한', lv: '고급' },
      { w: 'vigilant',    p: [['vigil','깨어 있는'],['ant','~한']],            b: '깨어 지켜보는',   m: '경계하는', lv: '고급' },
      { w: 'complacent',  p: [['com','완전히'],['plac','기쁜'],['ent','~한']], b: '스스로 만족한',   m: '안주하는', lv: 'GRE' },
      { w: 'belligerent', p: [['belli','전쟁'],['ger','일으키다'],['ent','~하는']], b: '전쟁을 일으키는', m: '호전적인', lv: 'GRE' },
    ],
  },

  /* ===== 라틴어 어근 (GRE 확장) ===== */
  {
    id: 'cred', group: 'latin', root: 'cred', meaning: '믿다',
    origin: '라틴어', originWord: 'credere (믿다)',
    words: [
      { w: 'credit',      p: [['cred','믿다'],['it','것']],                    b: '믿어 주는 것',    m: '신용',     lv: '기초' },
      { w: 'incredible',  p: [['in','아닌'],['cred','믿다'],['ible','할 수 있는']], b: '믿을 수 없는', m: '놀라운', lv: '기초' },
      { w: 'credible',    p: [['cred','믿다'],['ible','할 수 있는']],           b: '믿을 수 있는',    m: '믿을 만한', lv: '수능' },
      { w: 'credentials', p: [['cred','믿다'],['ential','~하게 하는 것']],      b: '믿게 해 주는 것', m: '자격 증명', lv: '고급' },
      { w: 'credulous',   p: [['cred','믿다'],['ulous','잘 ~하는']],            b: '잘 믿는',         m: '잘 속는',   lv: 'GRE' },
    ],
  },
  {
    id: 'loqu', group: 'latin', root: 'loqu · locu', meaning: '말하다',
    origin: '라틴어', originWord: 'loqui (말하다)',
    words: [
      { w: 'eloquent',   p: [['e','밖으로'],['loqu','말하다'],['ent','~하는']], b: '말이 술술 나오는', m: '웅변의',   lv: '고급' },
      { w: 'elocution',  p: [['e','밖으로'],['locu','말하다'],['tion','법']],   b: '말을 밖으로 내는 법', m: '발성·웅변술', lv: '고급' },
      { w: 'colloquial', p: [['col','함께'],['loqu','말하다'],['ial','~의']],   b: '함께 나누는 말투의', m: '구어체의', lv: 'GRE' },
      { w: 'soliloquy',  p: [['soli','혼자'],['loqu','말하다'],['y','것']],     b: '혼자 하는 말',    m: '독백',     lv: 'GRE' },
      { w: 'loquacious', p: [['loqu','말하다'],['acious','~이 많은']],          b: '말이 많은',       m: '수다스러운', lv: 'GRE' },
    ],
  },
  {
    id: 'greg', group: 'latin', root: 'greg', meaning: '무리 · 떼',
    origin: '라틴어', originWord: 'grex (무리)',
    words: [
      { w: 'congregate', p: [['con','함께'],['greg','무리'],['ate','~하다']],   b: '함께 무리 짓다',  m: '모이다',   lv: '고급' },
      { w: 'segregate',  p: [['se','따로'],['greg','무리'],['ate','~하다']],    b: '무리에서 따로 떼다', m: '분리하다', lv: '고급' },
      { w: 'gregarious', p: [['greg','무리'],['arious','~을 좋아하는']],        b: '무리 짓길 좋아하는', m: '사교적인', lv: 'GRE' },
      { w: 'aggregate',  p: [['ag','~쪽으로'],['greg','무리'],['ate','~하다']], b: '무리로 끌어모으다', m: '모으다·총계', lv: 'GRE' },
      { w: 'egregious',  p: [['e','밖으로'],['greg','무리'],['ious','~한']],    b: '무리 밖으로 튄',  m: '지독한',   lv: 'GRE' },
    ],
  },
  {
    id: 'plac', group: 'latin', root: 'plac', meaning: '달래다 · 기쁘게 하다',
    origin: '라틴어', originWord: 'placare (달래다)',
    words: [
      { w: 'placid',     p: [['plac','달래다'],['id','~한']],                  b: '잔잔히 달래진',   m: '차분한',   lv: '고급' },
      { w: 'placebo',    p: [['plac','기쁘게 하다'],['ebo','~할 것']],         b: '마음을 기쁘게 할 것', m: '위약',  lv: '고급' },
      { w: 'placate',    p: [['plac','달래다'],['ate','~하다']],               b: '달래다',          m: '달래어 진정시키다', lv: 'GRE' },
      { w: 'complacent', p: [['com','완전히'],['plac','기쁜'],['ent','~한']],  b: '스스로 만족한',   m: '안주하는', lv: 'GRE' },
      { w: 'implacable', p: [['im','아닌'],['plac','달래다'],['able','할 수 있는']], b: '달랠 수 없는', m: '누그러지지 않는', lv: 'GRE' },
    ],
  },
  {
    id: 'sequ', group: 'latin', root: 'sequ · secu', meaning: '따르다',
    origin: '라틴어', originWord: 'sequi (따르다)',
    words: [
      { w: 'sequence',    p: [['sequ','따르다'],['ence','것']],                b: '줄줄이 따라옴',   m: '순서·연속', lv: '수능' },
      { w: 'consequence', p: [['con','함께'],['sequ','따르다'],['ence','것']],  b: '뒤따라오는 것',   m: '결과',     lv: '수능' },
      { w: 'subsequent',  p: [['sub','뒤'],['sequ','따르다'],['ent','~하는']],  b: '뒤따르는',        m: '그 다음의', lv: '고급' },
      { w: 'consecutive', p: [['con','함께'],['secu','따르다'],['tive','~하는']], b: '줄줄이 이어 따르는', m: '연속적인', lv: '고급' },
      { w: 'obsequious',  p: [['ob','~향해'],['sequ','따르다'],['ious','~한']], b: '굽실대며 따르는', m: '아첨하는', lv: 'GRE' },
    ],
  },
  {
    id: 'flu', group: 'latin', root: 'flu · flux', meaning: '흐르다',
    origin: '라틴어', originWord: 'fluere (흐르다)',
    words: [
      { w: 'fluent',      p: [['flu','흐르다'],['ent','~하는']],               b: '술술 흐르는',     m: '유창한',   lv: '기초' },
      { w: 'influence',   p: [['in','안으로'],['flu','흐르다'],['ence','것']],  b: '안으로 흘러듦',   m: '영향',     lv: '수능' },
      { w: 'fluctuate',   p: [['fluctu','물결치다'],['ate','~하다']],           b: '물결처럼 흐르다', m: '변동하다', lv: '고급' },
      { w: 'affluent',    p: [['af','~로'],['flu','흐르다'],['ent','~하는']],   b: '풍족하게 흘러드는', m: '부유한', lv: 'GRE' },
      { w: 'superfluous', p: [['super','넘쳐'],['flu','흐르다'],['ous','~한']], b: '넘쳐흐르는',      m: '불필요한', lv: 'GRE' },
    ],
  },
  {
    id: 'pend', group: 'latin', root: 'pend · pens', meaning: '매달다 · 달아 보다',
    origin: '라틴어', originWord: 'pendere (매달다)',
    words: [
      { w: 'depend',        p: [['de','아래로'],['pend','매달리다']],          b: '아래에 매달리다', m: '의존하다', lv: '기초' },
      { w: 'suspend',       p: [['sus','아래'],['pend','매달다']],             b: '매달아 멈추다',   m: '중단·정지하다', lv: '수능' },
      { w: 'indispensable', p: [['in','아닌'],['dis','떼다'],['pens','달다'],['able','할 수 있는']], b: '떼어낼 수 없는', m: '필수적인', lv: '고급' },
      { w: 'impending',     p: [['im','위에'],['pend','매달리다'],['ing','~하는']], b: '머리 위에 매달려 있는', m: '임박한', lv: 'GRE' },
      { w: 'pensive',       p: [['pens','달아 보다'],['ive','~한']],           b: '마음을 저울질하는', m: '생각에 잠긴', lv: 'GRE' },
    ],
  },
  {
    id: 'magn', group: 'latin', root: 'magn', meaning: '큰',
    origin: '라틴어', originWord: 'magnus (큰)',
    words: [
      { w: 'magnify',      p: [['magn','큰'],['ify','~하게 만들다']],          b: '크게 만들다',     m: '확대하다', lv: '수능' },
      { w: 'magnificent',  p: [['magn','큰'],['fic','만들다'],['ent','~한']],  b: '크게 만들어진',   m: '웅장한',   lv: '고급' },
      { w: 'magnitude',    p: [['magn','큰'],['itude','정도']],                b: '큰 정도',         m: '규모·크기', lv: '고급' },
      { w: 'magnate',      p: [['magn','큰'],['ate','사람']],                  b: '크게 된 사람',    m: '거물',     lv: 'GRE' },
      { w: 'magnanimous',  p: [['magn','큰'],['anim','마음'],['ous','~한']],   b: '마음이 큰',       m: '도량이 넓은', lv: 'GRE' },
    ],
  },
  {
    id: 'sol', group: 'latin', root: 'sol', meaning: '홀로',
    origin: '라틴어', originWord: 'solus (홀로)',
    words: [
      { w: 'solo',      p: [['sol','홀로'],['o','것']],                        b: '홀로 하는 것',    m: '독주·단독', lv: '기초' },
      { w: 'sole',      p: [['sol','홀로']],                                   b: '홀로인',          m: '유일한',   lv: '수능' },
      { w: 'solitary',  p: [['sol','홀로'],['itary','~한']],                   b: '홀로 있는',       m: '혼자의·외딴', lv: '고급' },
      { w: 'desolate',  p: [['de','완전히'],['sol','홀로'],['ate','~한']],     b: '완전히 홀로 남은', m: '황량한',   lv: 'GRE' },
      { w: 'soliloquy', p: [['soli','홀로'],['loqu','말하다'],['y','것']],     b: '혼자 하는 말',    m: '독백',     lv: 'GRE' },
    ],
  },
  {
    id: 'mut', group: 'latin', root: 'mut', meaning: '바꾸다',
    origin: '라틴어', originWord: 'mutare (바꾸다)',
    words: [
      { w: 'mutual',    p: [['mut','바꾸다'],['ual','~하는']],                 b: '서로 바꾸는',     m: '상호 간의', lv: '수능' },
      { w: 'commute',   p: [['com','함께'],['mut','바꾸다']],                  b: '차례로 바꿔 오가다', m: '통근하다', lv: '수능' },
      { w: 'mutate',    p: [['mut','바꾸다'],['ate','~하다']],                 b: '바뀌다',          m: '변이하다', lv: '고급' },
      { w: 'immutable', p: [['im','아닌'],['mut','바꾸다'],['able','할 수 있는']], b: '바꿀 수 없는', m: '불변의', lv: 'GRE' },
      { w: 'transmute', p: [['trans','가로질러'],['mut','바꾸다']],            b: '완전히 다른 것으로 바꾸다', m: '변환하다', lv: 'GRE' },
    ],
  },

  /* ===== 그리스어 어근 (GRE 확장) ===== */
  {
    id: 'anthrop', group: 'greek', root: 'anthrop', meaning: '인간',
    origin: '그리스어', originWord: 'ánthrōpos (인간)',
    words: [
      { w: 'anthropology',    p: [['anthrop','인간'],['logy','학문']],         b: '인간을 연구하는 학문', m: '인류학', lv: '고급' },
      { w: 'philanthropy',    p: [['phil','사랑'],['anthrop','인간'],['y','것']], b: '인간을 사랑함',   m: '자선',   lv: 'GRE' },
      { w: 'misanthrope',     p: [['mis','싫어함'],['anthrop','인간'],['e','사람']], b: '인간을 싫어하는 사람', m: '인간 혐오자', lv: 'GRE' },
      { w: 'anthropomorphic', p: [['anthropo','인간'],['morph','형태'],['ic','~한']], b: '인간 모습을 한', m: '의인화된', lv: 'GRE' },
    ],
  },
  {
    id: 'chron', group: 'greek', root: 'chron', meaning: '시간',
    origin: '그리스어', originWord: 'khrónos (시간)',
    words: [
      { w: 'chronic',        p: [['chron','시간'],['ic','~의']],               b: '오랜 시간 이어지는', m: '만성의', lv: '수능' },
      { w: 'chronological',  p: [['chrono','시간'],['logical','~순의']],        b: '시간 순서대로의', m: '연대순의', lv: '수능' },
      { w: 'chronicle',      p: [['chron','시간'],['icle','기록']],             b: '시간 순으로 적은 것', m: '연대기', lv: '고급' },
      { w: 'synchronize',    p: [['syn','함께'],['chron','시간'],['ize','~하다']], b: '시간을 함께 맞추다', m: '동시에 움직이다', lv: '고급' },
      { w: 'anachronism',    p: [['ana','거슬러'],['chron','시간'],['ism','~한 것']], b: '시대를 거스른 것', m: '시대착오', lv: 'GRE' },
    ],
  },
  {
    id: 'dem', group: 'greek', root: 'dem', meaning: '사람들 · 백성',
    origin: '그리스어', originWord: 'dêmos (백성)',
    words: [
      { w: 'democracy',   p: [['dem','사람들'],['cracy','통치']],              b: '사람들이 다스림', m: '민주주의', lv: '기초' },
      { w: 'epidemic',    p: [['epi','사이에'],['dem','사람들'],['ic','~한 것']], b: '사람들 사이에 퍼진', m: '전염병', lv: '고급' },
      { w: 'pandemic',    p: [['pan','모든'],['dem','사람들'],['ic','~한 것']], b: '모든 사람에게 퍼진', m: '세계적 유행병', lv: '고급' },
      { w: 'demographic', p: [['demo','사람들'],['graph','기록'],['ic','~의']], b: '사람들을 기록한', m: '인구 통계의', lv: 'GRE' },
      { w: 'demagogue',   p: [['dem','사람들'],['agogue','이끄는 자']],         b: '사람들을 선동해 이끄는 자', m: '선동가', lv: 'GRE' },
    ],
  },
  {
    id: 'path', group: 'greek', root: 'path', meaning: '감정 · 고통',
    origin: '그리스어', originWord: 'páthos (감정·고통)',
    words: [
      { w: 'sympathy',  p: [['sym','함께'],['path','느낌'],['y','것']],        b: '함께 느낌',       m: '동정',     lv: '수능' },
      { w: 'empathy',   p: [['em','안으로'],['path','느낌'],['y','것']],       b: '상대 안으로 들어가 느낌', m: '공감', lv: '고급' },
      { w: 'pathetic',  p: [['path','감정'],['etic','~을 자극하는']],           b: '감정을 자극하는', m: '측은한·한심한', lv: '고급' },
      { w: 'apathy',    p: [['a','없는'],['path','느낌'],['y','것']],          b: '느낌이 없음',     m: '무관심',   lv: 'GRE' },
      { w: 'pathology', p: [['path','병'],['logy','학문']],                    b: '병을 연구하는 학문', m: '병리학', lv: 'GRE' },
    ],
  },
  {
    id: 'phil', group: 'greek', root: 'phil', meaning: '사랑 · 좋아함',
    origin: '그리스어', originWord: 'phílos (사랑하는)',
    words: [
      { w: 'philosophy',   p: [['phil','사랑'],['soph','지혜'],['y','것']],     b: '지혜를 사랑함',   m: '철학',     lv: '기초' },
      { w: 'philharmonic', p: [['phil','사랑'],['harmonic','화음']],            b: '화음을 사랑하는', m: '교향악의', lv: '고급' },
      { w: 'philanthropy', p: [['phil','사랑'],['anthrop','인간'],['y','것']],  b: '인간을 사랑함',   m: '자선',     lv: 'GRE' },
      { w: 'bibliophile',  p: [['biblio','책'],['phil','사랑'],['e','사람']],   b: '책을 사랑하는 사람', m: '애서가', lv: 'GRE' },
    ],
  },
  {
    id: 'soph', group: 'greek', root: 'soph', meaning: '지혜',
    origin: '그리스어', originWord: 'sophós (지혜로운)',
    words: [
      { w: 'philosophy',    p: [['phil','사랑'],['soph','지혜'],['y','것']],    b: '지혜를 사랑함',   m: '철학',     lv: '기초' },
      { w: 'sophisticated', p: [['soph','지혜'],['isticated','다듬어진']],      b: '지혜로 다듬어진', m: '정교한·세련된', lv: '고급' },
      { w: 'sophomore',     p: [['soph','지혜로운'],['more','어리석은']],       b: '똑똑하면서도 설익은', m: '2학년생', lv: 'GRE' },
      { w: 'sophistry',     p: [['soph','지혜'],['istry','~인 척하는 것']],     b: '지혜인 척하는 말', m: '궤변',   lv: 'GRE' },
    ],
  },
  {
    id: 'arch', group: 'greek', root: 'arch', meaning: '으뜸 · 통치 · 처음',
    origin: '그리스어', originWord: 'arkhḗ (으뜸·처음)',
    words: [
      { w: 'monarch',   p: [['mon','하나'],['arch','통치자']],                 b: '혼자 다스리는 자', m: '군주',    lv: '수능' },
      { w: 'architect', p: [['arch','으뜸'],['tect','짓는 사람']],             b: '으뜸가는 건축가', m: '건축가',   lv: '수능' },
      { w: 'anarchy',   p: [['an','없는'],['arch','통치'],['y','상태']],       b: '다스림이 없음',   m: '무정부 상태', lv: '고급' },
      { w: 'hierarchy', p: [['hier','신성한'],['arch','통치'],['y','것']],     b: '신성한 순으로 다스림', m: '위계질서', lv: 'GRE' },
      { w: 'archaic',   p: [['arch','처음'],['aic','~의']],                    b: '맨 처음 시대의',  m: '고풍의·낡은', lv: 'GRE' },
    ],
  },
  {
    id: 'crat', group: 'greek', root: 'crat · cracy', meaning: '권력 · 통치',
    origin: '그리스어', originWord: 'krátos (힘)',
    words: [
      { w: 'democracy',   p: [['dem','사람들'],['cracy','통치']],              b: '사람들이 다스림', m: '민주주의', lv: '기초' },
      { w: 'autocrat',    p: [['auto','스스로'],['crat','통치자']],            b: '혼자 다 정하는 통치자', m: '독재자', lv: '고급' },
      { w: 'aristocrat',  p: [['aristo','가장 뛰어난'],['crat','통치자']],     b: '가장 뛰어난 자가 다스림', m: '귀족', lv: '고급' },
      { w: 'bureaucracy', p: [['bureau','사무국'],['cracy','통치']],           b: '사무국이 다스림', m: '관료제',   lv: 'GRE' },
      { w: 'plutocracy',  p: [['pluto','부'],['cracy','통치']],                b: '부자가 다스림',   m: '금권 정치', lv: 'GRE' },
    ],
  },
  {
    id: 'gen', group: 'greek', root: 'gen', meaning: '태생 · 낳다',
    origin: '그리스어', originWord: 'génos (태생·종족)',
    words: [
      { w: 'generate',   p: [['gen','낳다'],['erate','~하다']],                b: '낳아 만들어 내다', m: '생성하다', lv: '수능' },
      { w: 'genuine',    p: [['gen','태생'],['uine','~의']],                   b: '타고난 그대로의', m: '진짜의',   lv: '수능' },
      { w: 'genetic',    p: [['gen','태생'],['etic','~의']],                   b: '태생에 관한',     m: '유전의',   lv: '고급' },
      { w: 'indigenous', p: [['indi','안에서'],['gen','태어난'],['ous','~한']], b: '그 땅에서 태어난', m: '토착의',   lv: 'GRE' },
      { w: 'congenital', p: [['con','함께'],['gen','태어남'],['ital','~의']],  b: '태어날 때부터 함께한', m: '선천적인', lv: 'GRE' },
    ],
  },
  {
    id: 'morph', group: 'greek', root: 'morph', meaning: '형태',
    origin: '그리스어', originWord: 'morphḗ (형태)',
    words: [
      { w: 'metamorphosis',   p: [['meta','바뀜'],['morph','형태'],['osis','~됨']], b: '형태가 바뀜',   m: '변태·변형', lv: '고급' },
      { w: 'morphology',      p: [['morph','형태'],['logy','학문']],            b: '형태를 연구하는 학문', m: '형태학', lv: 'GRE' },
      { w: 'amorphous',       p: [['a','없는'],['morph','형태'],['ous','~한']], b: '정해진 형태가 없는', m: '무정형의', lv: 'GRE' },
      { w: 'anthropomorphic', p: [['anthropo','인간'],['morph','형태'],['ic','~한']], b: '인간 형태를 한', m: '의인화된', lv: 'GRE' },
    ],
  },
];

/* --- 카드 생성 ------------------------------------------------------ */
function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

/* 단어 하나 -> 카드 { front, back, speak, hint, lv } */
function rootCard(rootObj, word) {
  // 앞면: 영어 단어 + 난이도 배지
  const front =
    '<span class="rootword">' + escapeHtml(word.w) + '</span>' +
    '<span class="lv-badge lv-' + word.lv + '">' + word.lv + '</span>';

  // 뒷면: 형태소 칩 + 분해 뜻 + 기억고리
  const chips = word.p.map(part =>
    '<span class="mph">' + escapeHtml(part[0]) + '</span>').join('<span class="mph-op">+</span>');
  const breakdown = word.p.map(part =>
    escapeHtml(part[0]) + '(' + escapeHtml(part[1]) + ')').join(' + ');
  const back =
    '<span class="mph-row">' + chips + '</span>' +
    '<span class="mph-mean">' + breakdown + '</span>' +
    '<span class="mph-bridge">' + escapeHtml(word.b) +
      ' <b>→ ' + escapeHtml(word.m) + '</b></span>';

  return {
    front: front,
    back: back,
    speak: word.w,
    hint: rootObj.root + ' · ' + rootObj.meaning + ' · ' + rootObj.origin,
    lv: word.lv,
  };
}

/* 한 어근의 단어들을 카드 묶음으로 (난이도 순: 기초→수능→고급) */
function buildRootDeck(rootId) {
  const r = ROOTS.find(x => x.id === rootId);
  if (!r) return [];
  const order = { '기초': 0, '수능': 1, '고급': 2, 'GRE': 3 };
  return r.words
    .slice()
    .sort((a, b) => (order[a.lv] || 1) - (order[b.lv] || 1))
    .map(w => rootCard(r, w));
}

function rootWordCount(rootId) {
  const r = ROOTS.find(x => x.id === rootId);
  return r ? r.words.length : 0;
}

window.ROOT = { ROOT_GROUPS, ROOTS, buildRootDeck, rootWordCount };
