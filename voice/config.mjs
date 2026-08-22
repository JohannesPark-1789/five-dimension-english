/* =====================================================================
   voice/config.mjs — ElevenLabs 변환 설정

   목소리는 남/여 하나씩만 쓴다. 학습자에게 선택지를 늘리지 않는다.
   바꿀 일이 생기면 여기 한 줄만 고친다 (앱 코드는 slot 이름만 안다).
   ===================================================================== */

/* 모델 — compare.mjs 로 두 모델을 가려듣고 Flash 로 정했다.
   이 앱 문장은 2초 안쪽으로 짧아 multilingual_v2 와 차이가 크지 않았고,
   값은 절반이라 Creator 한 달 할당량에 거의 들어간다.
     eleven_flash_v2_5      : 0.5 크레딧/문자. 현재 기본값.
     eleven_multilingual_v2 : 1 크레딧/문자. 더 풍부하지만 두 배.
   바꿀 일이 생기면: EL_MODEL=eleven_multilingual_v2 node voice/generate.mjs
   (다만 파일 이름이 문장 해시라 모델을 바꾸면 전부 다시 만들어야 한다) */
export const MODEL = process.env.EL_MODEL || 'eleven_flash_v2_5';

/* 크레딧 단가 (문자당). ElevenLabs 공식 기준 — v2 계열 1, Flash/Turbo 0.5.
   Flash 전체 변환을 실제로 돌려 보니 청구는 253,594자에 약 69,860 크레딧
   (문자당 0.28)이었다. 공식값보다 낮지만 추정은 0.5 로 둔다 — 예산은 넉넉히
   잡는 편이 안전하고, 할인율은 언제든 바뀔 수 있다.                       */
export const CREDITS_PER_CHAR = {
  eleven_multilingual_v2: 1,
  eleven_v3:              1,
  eleven_turbo_v2_5:      0.5,
  eleven_flash_v2_5:      0.5,
};

/* 출력 포맷 — 문장이 2초 안쪽이라 32kbps 로도 발음 구분에 충분하고
   전체 용량이 절반으로 준다. 더 좋은 소리를 원하면 mp3_44100_64.
   (mp3_44100_128 은 Creator 이상 플랜에서만 된다)                      */
export const FORMAT = process.env.EL_FORMAT || 'mp3_22050_32';

/* 파일 크기 추정 — 실제로 만든 9,900개 전수를 재어 맞춘 값이다.
   문장당 고정 2.2 KB(헤더·앞뒤 여백)에 글자당 149 바이트가 붙는다.
   짧은 문장이 많아 고정분 비중이 크다 — 재생 시간 × 비트레이트로 어림하면
   15% 넘게 높게 나온다. 전수 실측은 mp3_22050_32 뿐이고, 나머지 포맷은
   비트레이트 비로 글자당만 늘린 추정이다.                                */
export const SIZE_MODEL = {
  mp3_22050_32:  { perChar: 149, perClip: 2242 },   // 9,900개 전수 실측 → 57.2 MB
  mp3_44100_64:  { perChar: 298, perClip: 2800 },   // 추정
  mp3_44100_128: { perChar: 596, perClip: 3900 },   // 추정
};

/* 목소리 둘. id 는 ElevenLabs 기본 제공 목소리.
   generate.mjs 가 실행 시 /v1/voices 로 이름을 확인하고, 계정에 없으면
   같은 성별의 다른 목소리로 대체하지 않고 그냥 멈춘다 (조용한 오작동 방지). */
export const VOICES = [
  { slot: 'female', name: 'Rachel', id: '21m00Tcm4TlvDq8ikWAM' },  // 차분한 미국 여성
  { slot: 'male',   name: 'Adam',   id: 'pNInz6obpgDQGcFmaJgB' },  // 낮고 또렷한 미국 남성
];

/* 발음 학습용이라 표현을 과하게 흔들지 않는다 — 안정성을 높게 잡는다. */
export const VOICE_SETTINGS = {
  stability:        0.55,
  similarity_boost: 0.80,
  style:            0.0,
  use_speaker_boost: true,
};

export const API = 'https://api.elevenlabs.io/v1';
