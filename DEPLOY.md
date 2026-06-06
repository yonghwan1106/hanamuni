# 하나무늬 Vercel 배포 가이드

라이브 모드(GPT Image 2.0 + Claude)로 배포하려면 **Vercel 프로젝트에 API 키 환경변수**가 설정돼야 합니다.
환경변수가 없으면 배포는 되지만 **mock 모드**로 동작합니다.

## 사전: 인증 (둘 중 하나)
현재 환경의 `VERCEL_TOKEN`이 무효 상태입니다. 아래 중 하나로 인증하세요.

**(A) 로그인** — 프롬프트에 다음을 입력:
```
! vercel login
```
(브라우저 인증 후 돌아오기)

**(B) 토큰** — vercel.com/account/tokens 에서 토큰 발급 후:
```
! $env:VERCEL_TOKEN = "<유효토큰>"
```

## 배포 절차 (인증 후 — 어시스턴트가 대행 가능)
작업 폴더: `C:\Users\user\Desktop\contest-projects-2026\hanamuni`

1) 프로젝트 링크(최초 1회)
```
vercel link --yes --scope sanoramyun8
```
2) 환경변수 등록(라이브 모드 필수) — 값은 .env.local과 동일
```
vercel env add OPENAI_API_KEY production
vercel env add ANTHROPIC_API_KEY production
```
3) 프로덕션 배포
```
vercel --prod
```

## ⚠️ 비용 보호 (공개 배포 권고)
공개 URL은 생성 1회당 GPT Image 2.0 비용(이미지 3종 ≈ 약 $0.1~0.5)이 발생합니다.
공개 시 악용 방지를 위해 **rate limit(예: IP당 시간 N회)·일일 생성 상한**을 권장합니다.
원하시면 `/api/generate`에 경량 제한을 추가해 드립니다(미적용 시 무제한 호출 노출).

## 키 보호
- `.env.local`은 `.gitignore`로 커밋 제외됨(키 유출 방지).
- Vercel 환경변수는 대시보드/`vercel env`로만 관리(코드에 하드코딩 금지).
