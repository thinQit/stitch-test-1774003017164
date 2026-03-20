import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import AuthProvider from '@/providers/AuthProvider';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ProjectFlow',
  description:
    'ProjectFlow — a full-stack Next.js + TypeScript landing site and light SaaS backend for an AI-powered project management product. Implements a modern Tailwind CSS component architecture, a gradient hero, feature cards (Smart Scheduling, Automated Reporting, Team Insights), a 3-tier pricing section (Starter $29/mo, Pro $79/mo, Enterprise custom) and footer. Includes API endpoints for health, public features/pricing, lead capture and subscription intent; admin UI to view leads; and delivery notes for integration with Stripe and analytics.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
