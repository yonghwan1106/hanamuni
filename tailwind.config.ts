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
        // 오방색 기반 하나무늬 팔레트
        muk: {
          DEFAULT: "#1a1410",  // 먹(흑) — 기본 텍스트·배경 포인트
          light: "#3d3530",
        },
        hong: {
          DEFAULT: "#c0392b",  // 홍(적) — 주요 CTA·강조
          light: "#e74c3c",
          muted: "#f5e6e4",
        },
        cheong: {
          DEFAULT: "#1a4a7a",  // 청(청) — 헤더·링크
          light: "#2d6da8",
          muted: "#e8f0f8",
        },
        geum: {
          DEFAULT: "#b8860b",  // 금(황) — 포인트·게이지·점수
          light: "#d4a012",
          muted: "#fdf6e3",
        },
        baek: {
          DEFAULT: "#f8f4ef",  // 백(백) — 배경
          pure: "#ffffff",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Malgun Gothic",
          "맑은 고딕",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,20,16,0.06), 0 4px 16px rgba(26,20,16,0.08)",
        "card-hover": "0 4px 12px rgba(26,20,16,0.12), 0 8px 32px rgba(26,20,16,0.10)",
      },
      backgroundImage: {
        "hanamuni-hero": "linear-gradient(135deg, #1a1410 0%, #1a4a7a 60%, #1a1410 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
