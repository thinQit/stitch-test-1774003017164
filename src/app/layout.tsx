import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import AuthProvider from '@/providers/AuthProvider';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ProjectFlow',
  description: 'ProjectFlow — a full-stack Next.js + TypeScript SaaS landing site and lightweight admin backend for an AI-powered project management product. Includes a pixel-matching landing page (hero with gradient, feature cards, pricing tiers, footer) built with Tailwind CSS and modern component architecture, plus APIs for health, newsletter subscribe, contact leads, and CRUD for pricing plans and leads to support a simple admin dashboard.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
