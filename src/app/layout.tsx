import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProjectFlow',
  description: 'ProjectFlow — a Next.js + TypeScript landing site and lightweight admin for an AI-powered project management SaaS. Implements a responsive Tailwind CSS landing page (Hero with gradient, Feature cards, Pricing tiers, Footer) plus an admin CRUD dashboard to manage features, pricing, and marketing content. Includes REST API endpoints (with health), email subscription/contact capture, and a minimal checkout stub for Starter/Pro plans. Built with modern component architecture, TypeScript types, and accessibility best practices.',
  metadataBase: new URL('https://projectflow.local'),
  alternates: { canonical: '/' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
