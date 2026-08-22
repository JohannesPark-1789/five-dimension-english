# 음성 변환 — ElevenLabs

앱이 읽어 주는 영어 **4,950개**(중복 제외)를 ElevenLabs 로 미리 음성 파일로
만들어 두고, 앱은 그 파일을 재생한다. 실시간 호출이 아니라 **한 번 만들어 두는**
방식이다 — 그래서 API 키가 브라우저로 나가지 않고, 오프라인에서도 소리가 나고,
비용도 한 번만 든다.

목소리는 **여성·남성 하나씩**이다. 학습자에게 보이는 선택은 그 둘뿐이다.

## 쓰는 법

```bash
node voice/estimate.mjs --plan=creator        # 비용·용량·달 나누기 (호출 없음)

export ELEVENLABS_API_KEY=...
node voice/compare.mjs                             # 두 모델 귀로 비교 (약 600 크레딧)
node voice/generate.mjs --tier=pattern --limit=5   # 소리 먼저 들어보기 (약 300 크레딧)
node voice/generate.mjs                            # 전체 변환
```

- 이미 만든 파일은 건너뛴다. **중간에 끊겨도 다시 실행하면 이어서** 한다.
- 시작 전에 계정의 남은 크레딧을 확인하고, 부족하면 진행하지 않는다.
- 실패한 문장은 `voice/failed.json` 에 남고, 다시 실행하면 그것만 재시도한다.

`estimate.mjs --plan=<플랜>` 은 그 플랜의 월 할당량으로 달을 나눠 하는 일정을 보여준다.
`--reserve=20000` 을 붙이면 달마다 그만큼은 다른 용도로 남긴다.

| 옵션 | 뜻 |
|---|---|
| `--tier=pattern,lexeme` | 계층 일부만 (`generated` `pattern` `phrase` `lexeme`) |
| `--voice=female` | 한쪽 목소리만 |
| `--limit=20` | 앞에서 N개만 — 시험 변환 |
| `--dry` | 호출 없이 계획만 |
| `--conc=4` | 동시 요청 수 |
| `EL_MODEL=eleven_flash_v2_5` | 값이 절반인 모델 (품질 조금 낮음) |
| `EL_FORMAT=mp3_44100_64` | 더 좋은 음질 (용량 두 배) |

## 크레딧 계획 — Creator 플랜 ($22/월 · 121,000)

전체 변환은 `eleven_multilingual_v2` 로 **253,594 크레딧**이다. 한 달 할당량의 두 배가 넘는다.

| 방법 | 추가 비용 | 걸리는 시간 |
|---|---|---|
| 기본 모델, 3개월에 나눠서 | **$0** | 3개월 |
| 기본 모델, 한 번에 | 약 **$40** | 하루 |
| `EL_MODEL=eleven_flash_v2_5`, 한 번에 | 약 **$2** | 하루 |
| Flash, 2개월에 나눠서 | **$0** | 2개월 |

Flash 는 값이 절반이고 품질은 조금 낮다. 문장이 2초 안쪽으로 짧아 차이가 작을
수 있으니 **`node voice/compare.mjs` 로 두 모델을 직접 들어보고 정한다** (약 600 크레딧).

교재 문장·구·단어(547개)만 먼저 하면 **16,078 크레딧**으로 끝난다 —
한 달 할당량 안이고, 값이 가장 높은 부분이다. 드릴 문장 4,403개가 나머지 94% 를 쓴다.

```bash
node voice/generate.mjs --tier=pattern,phrase,lexeme    # 16,078 크레딧
node voice/generate.mjs --tier=generated                # 나머지 — 달을 나눠서
```

달을 나눠 할 때는 `generate.mjs` 를 그냥 다시 실행하면 된다. 만든 것은
건너뛰므로 끊긴 자리에서 이어진다. 크레딧이 떨어지면 스스로 멈춘다.

## 키를 넘기는 법

계정 아이디·비밀번호는 필요 없고 **넘기지 말 것**. 필요한 것은 API 키 하나다.

1. ElevenLabs → 우측 상단 프로필 → **API Keys** → *Create API Key*
2. 권한은 **Text to Speech** 와 **User (read)** 만 준다. 크레딧 상한도 걸 수 있다.
3. 키를 환경변수로 둔다. 저장소나 대화창에 붙여넣지 않는다.

```bash
export ELEVENLABS_API_KEY=sk_...
```

Claude Code 웹에서 돌린다면 세션에 붙여넣는 대신
**환경 설정의 Environment variables** 에 `ELEVENLABS_API_KEY` 로 넣는다.
일이 끝나면 그 키는 ElevenLabs 화면에서 폐기하면 된다.

## 앱이 파일을 찾는 방식

```
voice/audio/{female|male}/{해시 앞 2자}/{해시}.mp3      해시 = sha1(문장) 앞 20자
```

앱은 문장에서 직접 해시를 계산하므로 문장 목록을 따로 실어 보내지 않는다.
`voice/manifest.json` 은 "어떤 목소리가 준비됐는가"만 담는다.

파일이 없으면(아직 변환 안 한 문장, 처음 듣는 문장 + 오프라인) 앱은 조용히
**기기 내장 음성**으로 되돌아간다. 발음이 아예 안 나오는 경우는 없다.

「🐢 천천히」는 느린 파일을 따로 만들지 않고 재생 속도를 0.7배로 낮춘다 —
변환 비용이 두 배가 되지 않는다.

## 배포

`voice/audio/` 는 약 76 MB · 9,900개다. 기본값은 `.gitignore` 로 저장소에서
빼 두었다.

- **정적 호스팅에 따로 올리는 경우** — 지금 상태로 두고 `voice/` 를 배포물에 포함한다.
- **GitHub Pages 로 배포하는 경우** — 저장소에 있어야 하므로 `.gitignore` 의
  `voice/audio/` · `voice/manifest.json` 두 줄을 지우고 커밋한다.

데이터 파일을 고쳐 문장이 바뀌면 새 문장만 다시 만들면 된다 —
바뀐 문장은 해시가 달라 새 파일이 되고, 옛 파일은 남아 있어도 무해하다.
그리고 `sw.js` 의 캐시 버전을 올릴 것.
