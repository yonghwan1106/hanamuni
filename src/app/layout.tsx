import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
    <html lang="ko">
      <body className="min-h-screen flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
