'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/admin/leads', label: 'Admin' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-foreground">
          ProjectFlow
        </Link>
        <button
          className="flex items-center rounded-lg border border-border p-2 text-sm md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="h-0.5 w-5 bg-foreground" />
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium text-secondary hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      <div className={cn('border-t border-border px-6 pb-4 md:hidden', open ? 'block' : 'hidden')}>
        <div className="flex flex-col gap-3 pt-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium text-secondary hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
