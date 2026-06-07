import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 오방색 기반 하나무늬 팔레트 — 미술관급 톤 보정
        muk: {
          DEFAULT: "#1a1410",  // 먹(흑) — 기본 텍스트·배경 포인트
          deep: "#120d0a",     // 더 깊은 먹 — 히어로 바탕
          soft: "#231a14",     // 부드러운 먹 — 카드/패널
          light: "#3d3530",
        },
        hong: {
          DEFAULT: "#b3402f",  // 홍(적) — 주요 CTA·강조 (단청 주홍)
          light: "#cb5440",
          deep: "#8c2c20",
          muted: "#f5e6e4",
        },
        cheong: {
          DEFAULT: "#1a4a7a",  // 청(청) — 헤더·링크
          light: "#2d6da8",
          muted: "#e8f0f8",
        },
        geum: {
          DEFAULT: "#b8860b",  // 금(황) — 포인트·게이지·점수
          light: "#d4af37",    // 밝은 금 — 길트 하이라이트
          bright: "#e8c860",   // 금박 광택
          muted: "#fdf6e3",
        },
        baek: {
          DEFAULT: "#f8f4ef",  // 백(백) — 배경
          pure: "#ffffff",
        },
        // 한지 크림 계열 — 종이 섹션
        hanji: {
          DEFAULT: "#f3ece0",
          warm: "#efe5d4",
          deep: "#e7dcc8",
        },
        // 청자 보조
        cheongja: "#7a9b8e",
        mint: "#2d6d3a",       // 점수 통과·완료 표시 (studio 사용)
      },
      fontFamily: {
        // 한글 디스플레이/제목 — 송명(명조)
        display: ["var(--font-display)", "Song Myung", "serif"],
        // 한글 본문 — 고운돋움
        body: [
          "var(--font-body)",
          "Gowun Dodum",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "맑은 고딕",
          "sans-serif",
        ],
        // 라틴 액센트 — Cormorant Garamond
        latin: ["var(--font-latin)", "Cormorant Garamond", "Georgia", "serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,20,16,0.05), 0 6px 22px rgba(26,20,16,0.07)",
        "card-hover": "0 8px 18px rgba(26,20,16,0.10), 0 18px 48px rgba(26,20,16,0.14)",
        // 금박 매트(mat) 그림자 — 작품 프레임
        gilt: "0 0 0 1px rgba(184,134,11,0.30), 0 2px 4px rgba(184,134,11,0.12), 0 14px 40px rgba(26,20,16,0.16)",
        "gilt-inset": "inset 0 0 0 1px rgba(212,175,55,0.35), inset 0 1px 0 rgba(232,200,96,0.20)",
      },
      backgroundImage: {
        "hanamuni-hero": "linear-gradient(135deg, #120d0a 0%, #1a1410 55%, #231a14 100%)",
        "gilt-sheen": "linear-gradient(120deg, #b8860b 0%, #e8c860 45%, #d4af37 55%, #b8860b 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
