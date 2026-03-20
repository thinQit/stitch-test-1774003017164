import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'ProjectFlow',
  description:
    'ProjectFlow — a full-stack Next.js + TypeScript landing site and lightweight API for an AI-powered project management SaaS. Implements a responsive Tailwind CSS design matching the approved wireframe: gradient hero, feature cards (Smart Scheduling, Automated Reporting, Team Insights), 3-tier pricing (Starter $29/mo, Pro $79/mo, Enterprise custom), and footer. Includes reusable modern components, TypeScript types, simple subscription/contact endpoints, and a health check.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
