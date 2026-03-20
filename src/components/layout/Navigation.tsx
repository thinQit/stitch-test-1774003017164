'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">ProjectFlow</Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/pricing">Get started</Link>
          </Button>
        </nav>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="block h-0.5 w-6 bg-slate-800" />
          <span className="mt-1 block h-0.5 w-6 bg-slate-800" />
          <span className="mt-1 block h-0.5 w-6 bg-slate-800" />
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col gap-4 px-6 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="w-fit">
              <Link href="/pricing" onClick={() => setOpen(false)}>Get started</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navigation;
