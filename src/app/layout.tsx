import type { Metadata } from "next";
import { Gowun_Dodum, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// 한글 디스플레이/제목 — 송명(명조)는 한글 전용(subsets 없음)이라
// next/font 로더 타입이 preload/subsets를 막는다 → <link>로 직접 로드하고
// CSS 변수(--font-display)는 globals.css에서 매핑한다.

// 한글 본문 — 고운돋움: 따뜻·정갈
const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// 라틴 액센트 — Cormorant Garamond: refined serif (워드마크·라벨·숫자)
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "하나무늬 HANAMUNI — 전통문양 생성형 창작 스튜디오",
  description:
    "사연과 감정을 전통문양 22만건의 감성 라벨로 매칭해 한복 착장 이미지로 생성하고, 전통성 점수로 검증하는 생성형 창작 스튜디오. 굿즈·웨딩·기념품으로 바로 사용 가능.",
  keywords: ["전통문양", "한복", "AI 생성", "하나무늬", "HANAMUNI", "전통 창작"],
  openGraph: {
    title: "하나무늬 HANAMUNI",
    description: "내 사연으로 전통문양을 짓다",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gowunDodum.variable} ${cormorant.variable}`}
    >
      <head>
        {/* 송명(Song Myung) — 한글 디스플레이/제목 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Song+Myung&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
