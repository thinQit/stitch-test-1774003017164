import './globals.css';
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'ProjectFlow',
  description: 'ProjectFlow — a full-stack Next.js + TypeScript landing site and lightweight admin dashboard for an AI-powered project management SaaS. Includes a responsive Tailwind CSS design matching the approved wireframe: gradient Hero, three feature cards (Smart Scheduling, Automated Reporting, Team Insights), a 3-tier Pricing section (Starter $29/mo, Pro $79/mo, Enterprise custom), newsletter/lead capture, and a Footer. Modern component architecture, TypeScript types, server-side API endpoints (health, features, pricing tiers, lead capture, checkout), and SSG/ISR optimizations for performance.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
