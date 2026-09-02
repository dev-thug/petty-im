import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { pretendard } from "@/app/fonts";

export const metadata: Metadata = {
  title: "petty | 당신만의 이야기가 시작되는 곳",
  description:
    "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다. 출시 소식을 가장 먼저 받아보세요.",
  metadataBase: new URL("https://petty.im"),
  openGraph: {
    title: "petty | 당신만의 이야기가 시작되는 곳",
    description: "당신만의 캐릭터와 함께, 특별한 이야기가 시작됩니다.",
    url: "https://petty.im",
    siteName: "petty",
    images: ["/assets/welcome-background.png"],
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={pretendard.variable} lang="ko">
      <body>{children}</body>
    </html>
  );
}
