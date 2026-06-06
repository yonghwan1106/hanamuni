# 하나무늬 HANAMUNI

전통문양 22만 건의 감성 형용사 라벨로 사용자의 사연·감정을 전통문양 패턴 + 한복 착장으로 생성하고, **전통성 점수(0~100)**로 검증하는 생성형 창작 스튜디오.

제4회 문화체육관광 AI·데이터 활용 공모전 — 제품·서비스 분야 출품작 (대상 도전)

---

## 실행법

### 1. 의존성 설치

```bash
cd C:\Users\user\Desktop\contest-projects-2026\hanamuni
npm install
```

### 2. 환경변수 설정 (선택 — 없으면 mock 모드)

```bash
# .env.local.example 복사
copy .env.local.example .env.local
# 이후 .env.local을 열어 API 키 입력
```

### 3. 개발 서버 실행

```bash
npm run dev
# http://localhost:3000 에서 확인
```

> Turbopack은 한글 경로 panic 이슈로 **비활성화** 상태입니다. `--turbopack` 플래그를 추가하지 마세요.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## mock 모드 / 실모드 전환

| 상태 | 동작 |
|------|------|
| API 키 없음 (기본) | **mock 모드** — 규칙 기반 감성 분류, SVG 샘플 문양, 결정적 점수 반환. 앱 전체 end-to-end 작동. |
| `.env.local` 키 입력 후 | **실모드** — Claude API 정규화, 나노바나나 이미지 생성, Claude 점수 산정으로 자동 전환. |

### 키 교체 지점

| 파일 | 환경변수 | 역할 |
|------|----------|------|
| `src/app/api/normalize/route.ts` | `ANTHROPIC_API_KEY` | 사연→감성 라벨 정규화 |
| `src/app/api/generate/route.ts` | `NANOBANANA_API_KEY` | 전통문양·한복 이미지 생성 |
| `src/app/api/score/route.ts` | `ANTHROPIC_API_KEY` | 전통성 점수 산정 |

키가 설정되면 각 라우트가 실모드로 자동 전환됩니다. 하드코딩 없음.

---

## 데이터 출처

| 데이터 | 규모 | 출처 | 라이선스 |
|--------|------|------|----------|
| 전통문양 AI학습데이터 | 22만 건 | culture.go.kr/share | 공공누리 제1유형 |
| 전통복식 한복 이미지 | 10,163 건 (360°8K) | 문화공공데이터광장 | 문화 공공데이터 개방 |
| 한국민족문화대백과사전 | 표제어 기반 | encykorea.aks.ac.kr | 한국학중앙연구원 공공데이터 |
| 전통문양조회 API | 실시간 | 공공데이터포털 data.go.kr | 공공누리 제1유형 |

---

## 라우트 구조

```
/               랜딩 — 서비스 소개, 문양 갤러리, CTA
/studio         핵심 스튜디오 — 사연 입력 → 생성 → 결과 + 점수
/about-data     데이터·검증 — 데이터 목록, 폐루프 다이어그램, 성능 지표
/api/normalize  POST — 사연+칩 → 감성 라벨 정규화
/api/generate   POST — 감성 라벨 → 문양+한복 이미지 생성
/api/score      POST — 문양ID+라벨 → 전통성 점수 산정
```

---

## 기술 스택

- **Next.js 15** + React 19 + TypeScript 5.7
- **Tailwind CSS 3.4** — 오방색 기반 커스텀 팔레트
- **Vercel** 배포 (sanoramyun8 계정)
- AI: Claude (Anthropic) + 나노바나나 (Gemini 2.5 Flash Image)
- webpack 빌드 (Turbopack 비활성화)

---

## Vercel 배포

```bash
# Vercel CLI 사용 시
vercel --prod

# 환경변수는 Vercel 대시보드 > Settings > Environment Variables에 입력
```

배포 후 URL: `https://hanamuni.vercel.app` (또는 프로젝트명에 따라 다름)
