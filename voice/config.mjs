/* =====================================================================
   voice/config.mjs — ElevenLabs 변환 설정

   목소리는 남/여 하나씩만 쓴다. 학습자에게 선택지를 늘리지 않는다.
   바꿀 일이 생기면 여기 한 줄만 고친다 (앱 코드는 slot 이름만 안다).
   ===================================================================== */

/* 모델 —
   eleven_multilingual_v2 : 가장 자연스럽다. 1 크레딧/문자. 기본값.
   eleven_flash_v2_5      : 품질 조금 낮고 값은 절반. 0.5 크레딧/문자.
   환경변수로 바꾼다: EL_MODEL=eleven_flash_v2_5 node voice/generate.mjs   */
export const MODEL = process.env.EL_MODEL || 'eleven_multilingual_v2';

/* 크레딧 단가 (문자당). ElevenLabs 공식 기준 — v2 계열 1, Flash/Turbo 0.5 */
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

/* 포맷별 대략 바이트/초 — 용량 추정용 */
export const BYTES_PER_SEC = {
  mp3_22050_32:  4000,
  mp3_44100_64:  8000,
  mp3_44100_128: 16000,
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
