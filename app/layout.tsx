//app/layout.tsx
//app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "SplitEasy",
  description: "Smart bill splitting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}