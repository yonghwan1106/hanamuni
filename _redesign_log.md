# 하나무늬(HANAMUNI) 프론트엔드 재디자인 로그

**작업일**: 2026-06-07
**아트 디렉션**: "현대 미술관 속 전통 공방" — refined luxury / editorial / 한국 전통의 혼
**프레임워크**: Next.js 15.5.19 + React 19 + Tailwind CSS 3.4 (webpack, Turbopack 미사용)

---

## 1. 변경 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/layout.tsx` | next/font/google 도입(Gowun Dodum·Cormorant Garamond), Song Myung은 `<head>` `<link>`로 로드, 폰트 CSS 변수 연결, `font-body antialiased` 적용 |
| `tailwind.config.ts` | fontFamily(display/body/latin) 매핑, 먹·홍·청·금 톤 보정 + 한지/청자/금박/mint 토큰 추가, gilt·gilt-inset 그림자, gilt-sheen 배경, letterSpacing widest2 |
| `src/app/globals.css` | 전면 재작성 — 한지 종이 grain/noise(SVG fractalNoise), 금색 헤어라인 룰(`gilt-rule`), 금박 텍스트(`gilt-text`), 족자/현판 프레임(`gilt-frame`), 금박 광택 스윕(`gilt-sweep`), 스태거드 등장(`rise-in d1~d6`), 인장 회전(`seal-in`), 문양 회전(`drift-spin`). **기존 클래스/키프레임 전부 유지·격상**: `hanamuni-spinner`·`score-bar`·`fadein`·`hero-bg`·`pattern-card`·`emotion-chip`·`hanamuni-border`. 접근성(`focus-visible` 금색 링, `prefers-reduced-motion`), 인쇄 스타일 추가 |
| `src/components/SiteHeader.tsx` | 먹빛 글래스 헤더 + 상단 금박 헤어라인, 명조 한글 워드마크 + Cormorant 라틴 라벨, 회전 인장 로고(花), 밑줄 호버 네비, 알약형 CTA |
| `src/components/SiteFooter.tsx` | 먹빛 푸터 + 금박 헤어라인, 명조 제목, 금색 ◦ 불릿, Cormorant 카피라이트 |
| `src/app/page.tsx` | 랜딩 전면 재구성 — 비대칭 12컬럼 히어로(먹빛+문양 SVG 레이어+금박 "전통"+족자 프레임+인장+스태거드 페이드인), 한지 갤러리, 먹빛 "네 걸음"(壹貳參肆), 한지 활용대상(婚禮鄕韓 한자), 드라마틱 CTA |
| `src/app/studio/page.tsx` | **시각만 변경** — 작품 이미지를 족자/현판 금색 매트 프레임(`gilt-frame`)으로, 단계 인디케이터·경과타이머·점수 게이지·세부내역·출처 패널을 명조/금박/한지 언어로 재스타일. 로직 블록 무수정 |
| `src/app/about-data.tsx` (`src/app/about-data/page.tsx`) | 동일 디자인 언어 적용 — 한지 배경, 금색 헤어라인, 데이터 카드/지표/권리구조 재스타일. SVG 다이어그램은 색만 조화(주홍 #b3402f, rx 4 등) |

> `/api/*` 라우트(generate·normalize·score) **일절 수정하지 않음**.

---

## 2. 적용한 폰트

- **한글 디스플레이/제목**: `Song Myung`(송명, 명조) — `<head>`의 Google Fonts `<link>`로 로드 후 `--font-display` CSS 변수에 매핑. (Song Myung은 한글 전용 폰트로 next/font 로더 타입이 subsets/preload를 막아 `<link>` 방식 채택)
- **한글 본문**: `Gowun Dodum`(고운돋움) — `next/font/google`, `subsets:["latin"]`, `--font-body`
- **라틴 액센트(워드마크·라벨·숫자)**: `Cormorant Garamond` — `next/font/google`, 400~700 + italic, `--font-latin`
- Tailwind `fontFamily`에 display/body/latin 3종 매핑. body 기본 폰트 = 고운돋움.
- 금지 폰트(Inter/Roboto/Arial/Pretendard 기본룩/Space Grotesk) **미사용**.

## 3. 적용한 색

- 먹 `#1a1410`(+deep `#120d0a`/soft `#231a14`), 한지 `#f3ece0`(+warm/deep), 홍 `#b3402f`(단청 주홍), 청 `#1a4a7a`, 금 `#b8860b`(+밝은금 `#d4af37`/금박광택 `#e8c860`), 청자 `#7a9b8e`, mint `#2d6d3a`.
- 기존 muk/hong/cheong/geum/baek 토큰 **유지**, 한지·청자·금박·mint·그림자(gilt)·헤어라인 토큰 **추가**.
- AI slop(보라 그라데이션, 흰 배경 SaaS 카드 나열) **배제** — 먹빛 베이스 + 한지 크림 섹션 + 오방색 절제 액센트 + 박물관 금박.

## 4. 적용한 모티프·질감

- 전통문양 SVG(dangcho·yeonhwa·moran·unmun·taeguk)를 히어로/섹션 배경에 저투명도(0.05~0.08) 레이어로 은은히, 일부 `drift-spin` 느린 회전.
- 한지 종이결: SVG `feTurbulence` fractalNoise grain + 가로 섬유결(`hanji-fibre`), 먹빛 위 `ink-grain`.
- 금색 헤어라인 룰(`gilt-rule`)을 제목/섹션 구분선으로, 족자/현판 금색 매트 프레임(`gilt-frame`)을 작품 이미지에.
- 모션: 고임팩트 순간 집중 — 히어로 스태거드 페이드인(rise-in), 금박 인장 회전 등장(seal-in), 카드 금박 광택 스윕(gilt-sweep), 호버 헤어라인 확장. `prefers-reduced-motion` 대응.

## 5. 빌드 결과

```
npm run build  →  ✓ Compiled successfully
타입에러: 0 / 9개 라우트 모두 생성
  ○ /                5.33 kB   (정적)
  ○ /about-data      164 B     (정적)
  ○ /studio          5.97 kB   (정적)
  ƒ /api/generate · /api/normalize · /api/score  (서버, 무수정)
```

### 검증 (Playwright, 프로덕션 서버 :3939)
- 3개 페이지 모두 HTTP 200, **콘솔 에러 0건**.
- 스튜디오 생성 플로우 end-to-end 정상(예시 입력 → 생성 → 패턴 이미지 렌더 → 결과 화면). 점진 노출·점수·출처 정상 동작.
- 모바일(390px): **가로 오버플로 0px**, 반응형 정상(히어로 족자는 lg 이상에서만 노출).

## 6. studio 로직 무수정 확인

다음을 **원본 그대로 보존**(className·마크업 래핑·타이포·색·여백·애니메이션만 변경):
- `"use client"` 지시문
- 모든 hook: `useState`(step/phase/story/selectedChips/error/elapsed/normalize/images/score), `useEffect`(경과 타이머), `useCallback`(toggleChip/handleGenerate/handleReset/handleRegenerate)
- `handleGenerate`의 3단계 흐름: normalize fetch → 이미지 3종 `Promise.all` 병렬 생성 + `setImages((prev)=>({...prev,[type]:g}))` incremental reveal → score fetch
- fetch 호출 3종(`/api/normalize`·`/api/generate`·`/api/score`)
- 타입: `NormalizeResponse`·`GenerateResponse`·`ImageType`·`ScoreResponse` import 및 사용
- 생성 이미지 `<img>` 렌더 유지(Next `<Image>` 미사용, data URI 대응) + `eslint-disable no-img-element` 주석 유지
- `hanamuni-spinner`·`score-bar`·`fadein`(`animate-[fadein_0.5s_ease]`) 클래스명·동작 유지
- 상수(EMOTION_CHIPS·STORY_EXAMPLES·IMAGE_SLOTS·STEP_DEFS) 값 무변경

로직 식별자 grep 35건 전수 확인 + 실제 생성 플로우 통과로 무결성 입증 완료.
```
