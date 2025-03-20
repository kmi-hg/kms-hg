import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";

export const metadata: Metadata = {
  title: "KMS Hasnur Group",
  description: "Knowledge Management System Hasnur Group",
};

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-figtree">{children}</body>
    </html>
  );
}
