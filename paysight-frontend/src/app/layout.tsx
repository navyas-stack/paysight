import type { Metadata } from "next";
import "./globals.css";
import "@/styles/style.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "PaySight — Salary Management",
  description: "Salary management tool for HR managers",
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
