import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { DialogProvider } from "@/components/dialog";

export const metadata: Metadata = {
  title: "베이스보드",
  description: "누구나 읽고, 로그인한 사람만 쓰는 게시판",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <DialogProvider>{children}</DialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
