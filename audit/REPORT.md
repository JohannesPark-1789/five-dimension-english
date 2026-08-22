# 5차원 영어 — 영어 문장 전수 검수 보고서

## 1. 코퍼스

| 계층 | 항목 수 |
|---|---|
| generated | 4404 |
| phrase | 167 |
| pattern | 40 |
| lexeme | 367 |
| hardcoded | 1 |
| **합계** | **4979** (고유 4950) |

## 2. 검수 커버리지

| 배치 | 검수 단위 | 판정 완료 | 대상 문장 | 커버된 문장 |
|---|---|---|---|---|
| A1-형태 | 241 | 241 | 4404 | 4404 |
| A2-동사 _(보조축)_ | 3 | 3 | — | — |
| A3-목적어 _(보조축)_ | 41 | 41 | — | — |
| B-문장-01 | 25 | 25 | 25 | 25 |
| B-문장-02 | 25 | 25 | 25 | 25 |
| B-문장-03 | 25 | 25 | 25 | 25 |
| B-문장-04 | 25 | 25 | 25 | 25 |
| B-문장-05 | 25 | 25 | 25 | 25 |
| B-문장-06 | 25 | 25 | 25 | 25 |
| B-문장-07 | 25 | 25 | 25 | 25 |
| B-문장-08 | 25 | 25 | 25 | 25 |
| B-문장-09 | 7 | 7 | 7 | 7 |
| C-단어-01 | 60 | 60 | 60 | 60 |
| C-단어-02 | 60 | 60 | 60 | 60 |
| C-단어-03 | 60 | 60 | 60 | 60 |
| C-단어-04 | 60 | 60 | 60 | 60 |
| C-단어-05 | 60 | 60 | 60 | 60 |
| C-단어-06 | 60 | 60 | 60 | 60 |
| C-단어-07 | 7 | 7 | 7 | 7 |
| D-코드 | 1 | 1 | 1 | 1 |
| **합계** | **860** | **860** | **4979** | **4979** |

> 보조축(A2 동사)은 주축과 **같은 문장을 어휘 축에서** 다시 보는 배치라 문장 수 집계에서 뺀다.

> 전 단위 판정 완료.

> ⚠️ 문장이 바뀐 뒤 재판정 안 된 판정 1건: pat:0097



## 3. 1차 기계 검수

- 검사 4979건 · 지적 88건 — {"warn":4,"review":84}

| 심각도 | 규칙 | 대상 | 영어 | 지적 |
|---|---|---|---|---|
| warn | R6-중복 | gen:buy:what:wantTo | `What do you want to buy?` | 동일 영어 2회 (gen:buy:what:wantTo, code:app.js:0) · 한국어 불일치: 뭘 사고 싶니? /  |
| warn | R6-중복 | gen:read:dec:present | `You read a book.` | 동일 영어 2회 (gen:read:dec:present, gen:read:dec:past) · 한국어 불일치: 책을 읽는다 / 책을 읽었다 |
| warn | R6-중복 | pat:0117 | `if you turn right` | 동일 영어 2회 (pat:0117, pat:0175) · 한국어 불일치: 당신이 오른쪽으로 돌면 / 오른쪽으로 돌면 |
| warn | R6-중복 | pat:0128 | `if they had not met me` | 동일 영어 2회 (pat:0128, pat:0129) · 한국어 불일치: 만약에 그들이 나를 만나지 못했었더라면 / 만약에 그들이 나를 못 만났더라면 |
| review | R7-목적어없음 | shape:dec|can|thing | `You can buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|continuous|thing | `You are buying a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|enjoy|thing | `You enjoy buying a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|enjoyed|thing | `You enjoyed buying a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|future|thing | `You will buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|hadTo|thing | `You had to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|haveTo|thing | `You have to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|past|thing | `You bought a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|present|thing | `You buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|wantedTo|thing | `You wanted to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:dec|wantTo|thing | `You want to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|can|thing | `How can you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|continuous|thing | `How are you buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|enjoy|thing | `How do you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|enjoyed|thing | `How did you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|future|thing | `How will you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|past|thing | `How did you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|present|thing | `How do you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|wantedTo|thing | `How did you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:how|wantTo|thing | `How do you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|can|thing | `You can't buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|continuous|thing | `You aren't buying a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|enjoy|thing | `You don't enjoy buying a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|enjoyed|thing | `You didn't enjoy buying a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|future|thing | `You won't buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|hadTo|thing | `You didn't have to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|haveTo|thing | `You don't have to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|past|thing | `You didn't buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|present|thing | `You don't buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|wantedTo|thing | `You didn't want to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:neg|wantTo|thing | `You don't want to buy a ticket.` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|can|thing | `Can you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|continuous|thing | `Are you buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|enjoy|thing | `Do you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|enjoyed|thing | `Did you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|future|thing | `Will you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|hadTo|thing | `Did you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|haveTo|thing | `Do you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|past|thing | `Did you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|present|thing | `Do you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|wantedTo|thing | `Did you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:none|wantTo|thing | `Do you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|can|thing | `When can you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|continuous|thing | `When are you buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|enjoy|thing | `When do you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|enjoyed|thing | `When did you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|future|thing | `When will you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|hadTo|thing | `When did you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|haveTo|thing | `When do you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|past|thing | `When did you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|present|thing | `When do you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|wantedTo|thing | `When did you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:when|wantTo|thing | `When do you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|can|thing | `Where can you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|continuous|thing | `Where are you buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|enjoy|thing | `Where do you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|enjoyed|thing | `Where did you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|future|thing | `Where will you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|hadTo|thing | `Where did you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|haveTo|thing | `Where do you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|past|thing | `Where did you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|present|thing | `Where do you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|wantedTo|thing | `Where did you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:where|wantTo|thing | `Where do you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|continuous|thing | `Why are you buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|enjoy|thing | `Why do you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|enjoyed|thing | `Why did you enjoy buying a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|hadTo|thing | `Why did you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|haveTo|thing | `Why do you have to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|past|thing | `Why did you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|present|thing | `Why do you buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|wantedTo|thing | `Why did you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-목적어없음 | shape:why|wantTo|thing | `Why do you want to buy a ticket?` | 타동사인데 목적어가 없는 동사 1개: sing |
| review | R7-whom | shape:who|can|person | `Who can you meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|continuous|person | `Who are you meeting?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|enjoy|person | `Who do you enjoy meeting?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|enjoyed|person | `Who did you enjoy meeting?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|future|person | `Who will you meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|hadTo|person | `Who did you have to meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|haveTo|person | `Who do you have to meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|past|person | `Who did you meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|present|person | `Who do you meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|wantedTo|person | `Who did you want to meet?` | 목적격 의문사 who · 인스턴스 6개 |
| review | R7-whom | shape:who|wantTo|person | `Who do you want to meet?` | 목적격 의문사 who · 인스턴스 6개 |

## 4. 2차 판정 결함

**결함 없음.** 판정한 전 단위가 `ok` 다. 다만 "봤다"는 것이지 "모든 관점에서 봤다"는 뜻은 아니다 — `ARCHITECTURE.md` §8 의 미커버 축을 볼 것.

## 5. 참고 — 결함은 아니지만 메모

82건.

| 대상 | 영어 | 메모 |
|---|---|---|
| shape:dec|past|intransitive | `You went.` | 동사 read 는 현재형과 과거형의 철자가 같아 "You read a book." 이 두 단계에서 똑같이 나온다. 영어는 정상이고 한국어(읽는다 / 읽었다)로만 구분된다. |
| shape:dec|past|person | `You met your friends.` | 동사 read 는 현재형과 과거형의 철자가 같아 "You read a book." 이 두 단계에서 똑같이 나온다. 영어는 정상이고 한국어(읽는다 / 읽었다)로만 구분된다. |
| shape:dec|past|thing | `You bought a ticket.` | 동사 read 는 현재형과 과거형의 철자가 같아 "You read a book." 이 두 단계에서 똑같이 나온다. 영어는 정상이고 한국어(읽는다 / 읽었다)로만 구분된다. |
| shape:how|continuous|intransitive | `How are you going?` | 동사 go 에서 "How are you going?"은 미국에서 안부 인사로 읽힌다(수단을 물으려면 How are you getting there?). 나머지 5개 동사는 정상. |
| shape:neg|continuous|intransitive | `You aren't going.` | "You aren't buying" 과 "You're not buying" 둘 다 미국식으로 정상이다. 앱은 전자로 통일한다. |
| shape:neg|continuous|person | `You aren't meeting your friends.` | "You aren't buying" 과 "You're not buying" 둘 다 미국식으로 정상이다. 앱은 전자로 통일한다. |
| shape:neg|continuous|thing | `You aren't buying a ticket.` | "You aren't buying" 과 "You're not buying" 둘 다 미국식으로 정상이다. 앱은 전자로 통일한다. |
| shape:neg|hadTo|intransitive | `You didn't have to go.` | "didn't have to" 도 금지가 아니라 불필요(~하지 않아도 됐다). |
| shape:neg|hadTo|person | `You didn't have to meet your friends.` | "didn't have to" 도 금지가 아니라 불필요(~하지 않아도 됐다). |
| shape:neg|hadTo|thing | `You didn't have to buy a ticket.` | "didn't have to" 도 금지가 아니라 불필요(~하지 않아도 됐다). |
| shape:neg|haveTo|intransitive | `You don't have to go.` | "don't have to" 는 금지가 아니라 불필요다. 한국어를 "사면 안 된다"가 아니라 "사지 않아도 된다"로 뽑는 이유 — 학습자가 제일 많이 틀리는 지점이다. |
| shape:neg|haveTo|person | `You don't have to meet your friends.` | "don't have to" 는 금지가 아니라 불필요다. 한국어를 "사면 안 된다"가 아니라 "사지 않아도 된다"로 뽑는 이유 — 학습자가 제일 많이 틀리는 지점이다. |
| shape:neg|haveTo|thing | `You don't have to buy a ticket.` | "don't have to" 는 금지가 아니라 불필요다. 한국어를 "사면 안 된다"가 아니라 "사지 않아도 된다"로 뽑는 이유 — 학습자가 제일 많이 틀리는 지점이다. |
| shape:who|can|person | `Who can you meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|continuous|person | `Who are you meeting?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|enjoy|person | `Who do you enjoy meeting?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|enjoyed|person | `Who did you enjoy meeting?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|future|person | `Who will you meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|hadTo|person | `Who did you have to meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|haveTo|person | `Who do you have to meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|past|person | `Who did you meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|present|person | `Who do you meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|wantedTo|person | `Who did you want to meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| shape:who|wantTo|person | `Who do you want to meet?` | 목적격 who — 구어 미국영어에서는 who 가 표준이다. 격식 문어라면 whom. |
| verb:sing:finite | `Do you sing? / Where did you sing? / Why do you have to sing?` | sing 은 절대용법이 표준이다. "Do you sing?" 은 정상이고, 목적어를 붙인 "Do you sing a song?" 은 오히려 군더더기다. 그래서 obj 를 두지 않았다. |
| verb:sing:prog | `Are you singing? / Where are you singing?` | sing 은 절대용법이 표준이다. "Do you sing?" 은 정상이고, 목적어를 붙인 "Do you sing a song?" 은 오히려 군더더기다. 그래서 obj 를 두지 않았다. |
| verb:sing:enjoy | `Do you enjoy singing? / Why do you enjoy singing?` | sing 은 절대용법이 표준이다. "Do you sing?" 은 정상이고, 목적어를 붙인 "Do you sing a song?" 은 오히려 군더더기다. 그래서 obj 를 두지 않았다. |
| obj:open | `open the window` | 결합은 자연스럽다. "Do you enjoy opening the window?" 는 어색하다. |
| obj:close | `close the door` | 결합은 자연스럽다. "Do you enjoy closing the door?" 는 어색하다. |
| obj:send | `send an email` | "Do you enjoy sending an email?" 은 다소 어색하다. 나머지 형태는 정상. |
| obj:find | `find your keys` | 결합은 자연스럽다. "Do you enjoy finding your keys?" 는 어색하다 — find 는 의도한 행위가 아니라 결과라서 enjoy 와 잘 안 붙는다. |
| obj:break | `break a glass` | 결합은 자연스럽다. 다만 "Do you enjoy breaking a glass?" / "Do you want to break a glass?" 는 의미가 이상하다 — 일부러 깨는 상황이 전제된다. |
| pat:0022 | `the first person who was waiting in line` | 미국식 표현으로 고쳐 반영했다. |
| pat:0037 | `She has taught children how to dance.` | 미국식 표현으로 고쳐 반영했다. |
| pat:0038 | `She got to school yesterday.` | 미국식 표현으로 고쳐 반영했다. |
| pat:0042 | `a photo containing her image` | 패턴 라벨 오류 — containing 은 현재분사인데 "과거분사 수식(a4)"로 분류돼 있다. |
| pat:0066 | `the people who are waiting for me` | 패턴 라벨 오류 — "who are waiting"은 관계절(a5)이지 현재분사 수식(a3)이 아니다. |
| pat:0072 | `the people who are shouting at me` | 패턴 라벨 오류 — "who are shouting"은 관계절(a5)이지 현재분사 수식(a3)이 아니다. |
| pat:0097 | `whether I have a driver's license or not` | 둥근 아포스트로피(’). 나머지 코퍼스는 전부 직선(') — 통일 필요. |
| pat:0112 | `When do you give the children presents?` | 패턴 라벨 오류 — "give presents to the children"은 전치사구를 쓴 3형식이다. 4형식 예문이라면 "give the children presents". |
| pat:0117 | `if you turn right` | pat:0175 와 영어가 같다(한국어만 다름). 둘 중 하나 정리 검토. |
| pat:0124 | `if I were born again` | 미국식 표현으로 고쳐 반영했다. |
| pat:0128 | `if they had not met me` | pat:0129 와 영어가 같다(한국어만 다름). 둘 중 하나 정리 검토. |
| pat:0129 | `if they had not met me` | pat:0128 와 영어가 같다(한국어만 다름). 둘 중 하나 정리 검토. |
| pat:0135 | `if you had not helped me over those three years` | 미국식 표현으로 고쳐 반영했다. |
| pat:0146 | `the one singing softly` | 영어 "the one"은 성별이 없는데 한국어는 "그녀"로 못박았다. 영어는 정상. |
| pat:0164 | `Time flies.` | 한국어 "시간이 납니다"는 오역이다(= 짬이 난다). 괄호 설명이 진짜 뜻. 영어 "Time flies."는 정상. |
| pat:0173 | `keeping a diary in English` | 미국식 표현으로 고쳐 반영했다. |
| pat:0175 | `if you turn right` | pat:0117 와 영어가 같다(한국어만 다름). 둘 중 하나 정리 검토. |
| pat:0202 | `the crowd riding the bus` | 미국식 표현으로 고쳐 반영했다. |
| pat:0203 | `the team effort` | 미국식 표현으로 고쳐 반영했다. |
| root:in-not:invisible | `invisible` | 직역("보이지 않는")과 실제 뜻("보이지 않는")이 똑같아 기억고리 역할을 못 한다. |
| root:spect:suspect | `suspect` | 형태소 표기를 고쳐 반영했다. |
| root:vis:evidence | `evidence` | 분해가 e+vid 까지만 — 접미사 -ence 가 빠졌다. 다른 카드(vis+ion 등)는 접미사까지 적어 일관성이 없다. |
| root:voc:advocate | `advocate` | 분해 불가였던 voice 를 어근이 살아 있는 advocate(ad+voc+ate)로 교체했다. |
| root:voc:vocal | `vocal` | 직역과 실제 뜻이 똑같다("목소리의"). 기억고리 역할을 못 한다. |
| root:voc:vocabulary | `vocabulary` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:duct:educate | `educate` | 분해가 e+duc 까지만 — 접미사 -ate 누락. 위와 같은 일관성 문제. |
| root:spir:expire | `expire` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:logy:dialogue | `dialogue` | 미국식은 dialog 도 널리 쓰지만 dialogue 가 여전히 표준이라 문제없다. 다만 같은 그룹의 catalog 는 단축형이라 표기 방침이 섞여 있다 — 의도한 것인지 확인. |
| root:psych:psychology | `psychology` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:psych:psychologist | `psychologist` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:contra:contrast | `contrast` | 형태소 표기를 고쳐 반영했다. |
| root:contra:contrary | `contrary` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:mal:malevolent | `malevolent` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:syn:sympathy | `sympathy` | 같은 단어가 path 그룹에서는 sym+path+y 로 분해돼 있다. 분해 방식이 그룹마다 다르면 학습자가 헷갈린다 — 하나로 통일할 것. |
| root:suf-able:reliable | `reliable` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:suf-ize:emphasize | `emphasize` | 직역과 실제 뜻이 똑같다("강조하다"). |
| root:suf-cide:pesticide | `pesticide` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:suf-cide:herbicide | `herbicide` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:magn:magnificent | `magnificent` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:anthrop:anthropology | `anthropology` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:dem:democracy | `democracy` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:path:sympathy | `sympathy` | 같은 단어가 syn 그룹에서는 sym+pathy 로 분해돼 있다. 통일 필요. |
| root:path:pathology | `pathology` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:phil:philosophy | `philosophy` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:soph:philosophy | `philosophy` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:soph:sophomore | `sophomore` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:arch:architect | `architect` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:crat:democracy | `democracy` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| root:morph:morphology | `morphology` | 어원 분해를 고쳐 반영했다 — 형태소를 이어 붙이면 표제어가 나온다. (1차 검수 R5 통과) |
| code:app.js:0 | `What do you want to buy?` | TTS 엔진 워밍업용. 화면에는 안 보이지만 음성으로 나가므로 코퍼스에 포함했다. |
