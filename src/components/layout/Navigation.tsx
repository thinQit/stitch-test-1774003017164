'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6" aria-label="Primary">
        <Link href="/" className="text-xl font-bold text-foreground">
          ProjectFlow
        </Link>
        <button
          className="lg:hidden inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="h-0.5 w-5 bg-foreground block" />
          <span className="h-0.5 w-5 bg-foreground block mt-1" />
          <span className="h-0.5 w-5 bg-foreground block mt-1" />
        </button>
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className={cn('lg:hidden border-t border-border px-4 py-3', open ? 'block' : 'hidden')}>
        <div className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
