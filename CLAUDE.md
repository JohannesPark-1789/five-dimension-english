# five-dimension — 5차원 영어

패턴 드릴 · 기본동사 · 어원 중심의 영어 학습 PWA. 원본 교재(PDF)를 앱으로 옮긴 형태.

## 스택 · 실행

**빌드 도구 없는 바닐라 PWA** — `index.html` + 스크립트 몇 개 + `sw.js` + `manifest.webmanifest`.
npm 설치 불필요. 정적 서버로 열면 된다 (`.claude/launch.json` 참조).

## 구조

| 파일 | 내용 |
|---|---|
| `index.html` | 앱 셸 (제목 「5차원 영어」) |
| `app.js` | 화면·상호작용 로직 |
| `data.js` | 학습 데이터 |
| `patterns.js` | 패턴 드릴 문항 |
| `roots.js` | 어원 데이터 (가장 큼 — GRE 수준까지 확장됨) |
| `audit/` | 영어 전수 검수 파이프라인 (아래 「영어 검수」) |
| `voice/` | ElevenLabs 음성 변환 파이프라인 (아래 「음성」) |
| `sw.js` · `manifest.webmanifest` · `icon.png` | PWA 셸 |
| `*.pdf` | 원본 교재 — BASIC DRILL I~XV · PATTERN DRILL I~VIII · 정답지 |

## 원칙

- **데이터와 로직을 섞지 않는다.** 문항·어원은 `data.js`/`patterns.js`/`roots.js` 에만, 화면은 `app.js` 에만.
- 학습 진도는 브라우저 로컬 저장. 서버·외부 전송 없음.
- PDF 교재는 **출처 자료**다. 앱 데이터를 고칠 때 원본과 어긋나지 않게 대조한다.
- 오프라인 우선. 데이터 파일을 고치면 `sw.js` 캐시 버전도 같이 올린다 — 안 올리면 사용자가 옛 데이터를 계속 본다.
- **선택지를 늘리지 않는다.** 발음 목소리는 여성·남성 둘뿐이다. 기기 음성 목록을 학습자에게 보이지 않는다.

## 음성

`voice/` — 앱이 읽어 주는 영어 4,950개를 ElevenLabs 로 **미리** 음성 파일로 만들어 두고
앱은 그 파일을 재생한다. 실시간 API 호출이 아니다 — 키가 브라우저로 나가지 않고,
오프라인에서도 소리가 나고, 비용은 한 번만 든다. 자세한 것은 [`voice/README.md`](voice/README.md).

```bash
node voice/estimate.mjs --plan=creator              # 비용·용량·달 나누기 (API 호출 없음)
ELEVENLABS_API_KEY=... node voice/compare.mjs       # 두 모델 귀로 비교 (약 600 크레딧)
ELEVENLABS_API_KEY=... node voice/generate.mjs      # 변환 (이어서 하기 가능)
```

전체 변환은 253,594 크레딧이다. Creator 플랜(121,000/월)이면 3개월에 나누면 추가 $0,
한 번에 하면 약 $40, Flash 모델이면 약 $2. 자세한 계획은 `voice/README.md`.

문장 목록은 `audit/extract.mjs` 것을 그대로 쓴다 — 문장을 뽑는 방법을 두 벌 만들지 않는다.
파일 이름은 `sha1(문장)` 앞 20자다. 앱(`app.js`)과 `voice/corpus.mjs` 가 **같은 규칙**을
써야 한다 — 어긋나면 파일을 못 찾고 조용히 기기 음성으로 내려간다.
파일이 없을 때 기기 음성으로 되돌아가는 길은 항상 열어 둔다.

「천천히」는 느린 파일을 따로 만들지 않고 재생 속도를 0.7배로 낮춘다 — 안 그러면 비용이 두 배다.

## 다듬을 여지

- 데이터 파일이 130 KB 를 넘었다. 계속 커지면 JSON 분리 + 지연 로딩을 검토한다.
- PDF 10 MB 가 저장소에 함께 있다. 배포물에서 제외할지 정할 것.
- 음성 파일이 약 66 MB · 9,900개다 (실측 기준). GitHub Pages 로 배포하므로 저장소에 들어간다 —
  커밋은 전체 변환이 끝난 뒤 한 번에. 자세한 것은 `voice/README.md`.

## 영어 검수

`audit/` — 앱이 보여주는 영어 문자열 4,979개를 전수 추출해 미국식 영어 기준으로 검수하는 파이프라인.
설계는 [`audit/ARCHITECTURE.md`](audit/ARCHITECTURE.md).

```bash
node audit/run.mjs          # 추출 → 1차 기계 검수 → 검수 큐 → 보고서
node audit/run.mjs report   # 판정을 채운 뒤 보고서만 다시
```

문장 대부분이 `data.js` 에서 **생성**되므로 grep 이 아니라 데이터 모듈을 실행해서 뽑는다.
데이터를 고치면 파이프라인을 다시 돌린다 — 새 항목은 미판정으로 뜬다.
동사를 늘려도 새 **형태**는 안 생기므로 판정할 것은 목적어 결합(A3) 하나뿐이다.
동사 추가 규칙은 `data.js` 의 VERBS 주석 참조 (obj·objKo 필수, 상태동사 금지).
`audit/out/` 은 생성물이라 커밋하지 않는다. 판정(`audit/verdicts/*.json`)과 `audit/REPORT.md` 는 커밋한다.

## 연동

진도 export 는 [`../_shared/INTEGRATION_MAP.md`](../_shared/INTEGRATION_MAP.md) §3-B 계약(`app: "five-dimension"`).

## Git

`main` · `origin` = `github.com/JohannesPark-1789/five-dimension-english` (개인 계정 — 팀 이관 검토 대상)
