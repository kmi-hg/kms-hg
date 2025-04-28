// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { SessionProvider } from "next-auth/react";  // Import SessionProvider

export const metadata: Metadata = {
  title: "KMS Hasnur Group",
  description: "Knowledge Management System Hasnur Group",
};

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.className}>
      <body>
        <SessionProvider>{children}</SessionProvider> {/* Wrap children with SessionProvider */}
      </body>
    </html>
  );
}
