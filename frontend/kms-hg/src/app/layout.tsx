import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";

export const metadata: Metadata = {
  title: "KMS Hasnur Group",
  description: "Knowledge Management System Hasnur Group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
