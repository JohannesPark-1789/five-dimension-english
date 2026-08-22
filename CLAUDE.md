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
| `sw.js` · `manifest.webmanifest` · `icon.png` | PWA 셸 |
| `*.pdf` | 원본 교재 — BASIC DRILL I~XV · PATTERN DRILL I~VIII · 정답지 |

## 원칙

- **데이터와 로직을 섞지 않는다.** 문항·어원은 `data.js`/`patterns.js`/`roots.js` 에만, 화면은 `app.js` 에만.
- 학습 진도는 브라우저 로컬 저장. 서버·외부 전송 없음.
- PDF 교재는 **출처 자료**다. 앱 데이터를 고칠 때 원본과 어긋나지 않게 대조한다.
- 오프라인 우선. 데이터 파일을 고치면 `sw.js` 캐시 버전도 같이 올린다 — 안 올리면 사용자가 옛 데이터를 계속 본다.

## 다듬을 여지

- 데이터 파일이 130 KB 를 넘었다. 계속 커지면 JSON 분리 + 지연 로딩을 검토한다.
- PDF 10 MB 가 저장소에 함께 있다. 배포물에서 제외할지 정할 것.

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
