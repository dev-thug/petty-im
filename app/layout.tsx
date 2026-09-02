import type { ReactNode } from "react";

import "@/app/globals.css";

import { pretendard } from "@/app/fonts";

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
