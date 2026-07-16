import type { Metadata } from "next";
import { Black_Han_Sans, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";

const display = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Nanum_Myeongjo({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "진메현 시리즈",
  description: "진메현 시리즈 웹 리더 — 편과 장 단위로 읽는 소설 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
