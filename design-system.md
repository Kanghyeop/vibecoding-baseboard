# 디자인 시스템 (실습용)

> 이 문서는 **껍데기(프로토타입) 실습**을 위한 디자인 규칙입니다. 진짜 서비스가 아니라 "이렇게 만들 거다"를 보여주는 화면만 만드는 게 목적입니다.
> 원본은 `docs/003-디자인시스템.md`(베이스보드 앱 기준)이고, 이 문서는 그 규칙을 **어떤 스택으로 실습하든 그대로 적용**할 수 있게 정리한 버전입니다.

## 실습을 시작할 때 이렇게 말하세요

AI(Claude 등)에게 아래처럼 말하고 시작하면 됩니다.

> "나 지금 실습 중이라 앞으로 HTML로만 작업할 거고, 실제 앱을 개발하진 않을 거고, 어떻게 만들 거다라는 것을 보여주는 껍데기 즉 프로토타입만 작업해 나갈 거야. `design-system.md` 규칙대로 만들어줘."

React나 Next로 실습하고 싶으면 "HTML로만" 대신 "React로만" / "Next로만"이라고 바꿔 말하면 됩니다. 아래 A/B/C 중 맞는 걸 AI가 골라서 적용합니다.

## 이 문서를 받은 AI에게 (지침)

- **프로토타입만 만든다.** 진짜 로그인, 진짜 DB, 배포 설정은 하지 않는다. 버튼은 눌리고 화면은 바뀌지만 데이터는 새로고침하면 사라져도 됨.
- **색·글자·간격·둥글기는 아래 표에서만 꺼내 쓴다.** 표에 없는 임의 값(임의 hex, 임의 px)은 쓰지 않는다.
- **포인트 컬러 1개만 사용자 브랜드색으로 바꾸면 전체가 바뀌도록** 만든다 (변수/토큰 한 군데만 교체).
- 사용자가 스택을 말 안 했으면 "HTML만 쓸지, React를 쓸지, Next.js를 쓸지" 먼저 물어보고 아래 A/B/C 중 하나로 세팅한다.

---

## 색

기본 발상: 바탕은 흰색, 글자는 검정의 진하기 차이, 색은 포인트 1개뿐. 색이 보이면 반드시 의미(눌러라/켜졌다/위험하다)가 있어야 함.

무채색 (화면의 95%를 이 7개로 칠함)

| 이름 | 값 | 어디에 |
|---|---|---|
| 배경 | `#FFFFFF` | 앱 전체 배경, 헤더, 하단바 |
| 살짝 가라앉는 면 | `#F7F7F8` | 입력창, 카드 배경 |
| 글자-기본 | `#171719` | 제목, 본문 |
| 글자-보조 | `#5A5C63` | 닉네임, 설명 |
| 글자-희미 | `#9EA0A7` | 시간, 자리표시 글, 카운트 |
| 선 | `#E1E2E4` | 테두리, 구분선 |
| 선-약함 | `#F0F0F2` | 목록 행 사이 |

포인트 컬러 (단 1색 - 여기만 브랜드색으로 교체)

| 이름 | 값 | 어디에 |
|---|---|---|
| 포인트 | `#FF5A36` | 주요 버튼, 활성 탭, 눌린 좋아요 |
| 포인트-연함 | `#FFEDE8` | 포인트의 옅은 배경 (활성 칩 등) |

- 한 화면에 포인트색 요소는 1~2개까지만
- 의미색: 성공 `#00BF40`, 오류·삭제 `#FF4242` (이 용도 외엔 안 씀)

## 글자

Pretendard 하나만. 크기는 아래 6단계만.

| 이름 | 크기 | 굵기 | 어디에 |
|---|---|---|---|
| 타이틀 | 22px | bold | 화면 제목 |
| 헤딩 | 19px | bold | 상세의 제목 |
| 서브헤딩 | 16px | semibold | 목록의 글 제목, 섹션 제목 |
| 본문 | 15px | regular | 본문, 댓글 |
| 캡션 | 13px | regular | 닉네임, 시간, 카운트 |
| 마이크로 | 11px | regular | "수정됨" 같은 최소 주석 |

regular보다 얇은 굵기는 금지 (한글이 흐려 보임).

## 간격 · 둥글기

간격은 4의 배수만: `4 / 8 / 12 / 16 / 20 / 32`. 화면 좌우 여백은 20px 고정, 섹션 사이는 32px.

둥글기는 3단계 + 원형: `8`(칩) / `12`(입력창·카드·버튼) / `16`(모달·바텀시트) / `원형`(아바타, 글쓰기 버튼).

## 부품 규칙

- 주요 버튼: 포인트 배경 + 흰 글자, 높이 48px. 한 화면에 1개 원칙
- 보조 버튼: 연회색(`#F7F7F8`) 배경 + 검정 글자, 같은 크기
- 입력창: 연회색 배경, 테두리 없음. 포커스 시 포인트색 테두리 1px
- 목록 행: 좌우 20 / 위아래 16, 행 사이 약한 선 1px
- 칩(필터): 평소 회색 테두리 → 선택 시 포인트-연함 배경 + 포인트색 글자
- 아바타: 원형. 목록 32px, 상세 40px
- 빈 화면: 가운데 정렬 희미한 글자 한 줄 (+ 필요하면 보조 버튼 1개)
- 확인창: 삭제·차단 전엔 무조건. 확인 버튼만 빨강

## 하지 않는 것

그라데이션 / 배경색 바꾸기 / 3색 이상 / 폰트 섞기 / 임의 px 간격 / 요소마다 다른 둥글기 / 다크모드

---

## 구현: 스택별 세팅

공통 원칙은 위와 같고, 아래 중 실습 중인 스택에 맞는 것 하나만 골라서 세팅합니다.

### A. 순수 HTML/CSS만 쓸 때

파일 하나(`index.html` + `style.css`)로 끝내는 게 실습 목적에 맞습니다. 빌드 도구 없이 브라우저에서 바로 열어서 확인.

```css
/* style.css */
:root {
  --color-bg: #ffffff;
  --color-soft: #f7f7f8;
  --color-ink: #171719;
  --color-sub: #5a5c63;
  --color-faint: #9ea0a7;
  --color-line: #e1e2e4;
  --color-line-soft: #f0f0f2;
  --color-point: #ff5a36;
  --color-point-soft: #ffede8;
  --color-positive: #00bf40;
  --color-negative: #ff4242;
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, sans-serif;
}

body {
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: var(--color-bg);
}

.btn-primary {
  background: var(--color-point);
  color: #fff;
  height: 48px;
  border-radius: 12px;
}

.btn-secondary {
  background: var(--color-soft);
  color: var(--color-ink);
  height: 48px;
  border-radius: 12px;
}

.card {
  background: var(--color-soft);
  border-radius: 12px;
  padding: 16px;
}
```

Pretendard는 CDN으로 로드:

```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
```

포인트 컬러를 바꾸고 싶으면 `--color-point`, `--color-point-soft` 두 줄만 교체.

### B. React (Next.js 없이 - Vite/CRA)

라우팅 없이 상태(`useState`)로 화면 전환을 흉내 내는 것으로 충분합니다 (진짜 라우터는 실습 목적엔 과함).

`src/index.css`에 위 A의 `:root` 블록을 그대로 붙여넣고, 컴포넌트에서는 className으로만 사용:

```jsx
<button className="btn-primary">확인</button>
```

Tailwind를 쓰고 싶다면 `tailwind.config`의 `theme.extend.colors`에 같은 값을 등록해서 `bg-point`, `text-faint` 같은 클래스로 씁니다.

### C. Next.js

베이스보드 앱과 동일한 방식. Tailwind v4의 `@theme`으로 토큰을 선언하고 `bg-point`, `text-faint`, `border-line` 같은 클래스로만 색을 씁니다. 실제 예시는 `baseboard/src/app/globals.css` 참고.

```css
@import "tailwindcss";

@theme {
  --color-soft: #f7f7f8;
  --color-ink: #171719;
  --color-sub: #5a5c63;
  --color-faint: #9ea0a7;
  --color-line: #e1e2e4;
  --color-line-soft: #f0f0f2;
  --color-point: #ff5a36;
  --color-point-soft: #ffede8;
  --color-positive: #00bf40;
  --color-negative: #ff4242;
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, sans-serif;
}
```

임의 hex는 금지, 토큰 클래스로만 색을 쓰는 규칙은 A/B/C 모두 동일합니다.
