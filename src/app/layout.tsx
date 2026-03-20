import './globals.css';
import type { Metadata } from "next";
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: "App",
  description: "Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><><Navigation />{children}</></body>
    </html>
  );
}
