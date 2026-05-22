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
  const order = { '기초': 0, '수능': 1, '고급': 2 };
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
