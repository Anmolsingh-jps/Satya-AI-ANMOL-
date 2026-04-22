import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satya AI - Fact Checker",
  description: "Sach kya hai? Let AI find out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white">{children}</body>
    </html>
  );
}
