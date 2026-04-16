import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
