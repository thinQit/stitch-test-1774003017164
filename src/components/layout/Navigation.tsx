'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navRoutes = [
  { route: '/', title: 'Home' },
  { route: '/pricing', title: 'Pricing' },
  { route: '/dashboard', title: 'Dashboard' },
  { route: '/dashboard/projects', title: 'Projects' },
  { route: '/signin', title: 'Sign In' },
  { route: '/signup', title: 'Sign Up' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const mainLinks = navRoutes.filter((item) => !['/signin', '/signup'].includes(item.route));
  const authLinks = navRoutes.filter((item) => ['/signin', '/signup'].includes(item.route));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-foreground" aria-label="ProjectFlow home">
          ProjectFlow
        </Link>
        <button
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="h-0.5 w-5 bg-foreground" />
          <span className="h-0.5 w-5 bg-foreground" />
        </button>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {mainLinks.map((link) => (
            <Link key={link.route} href={link.route} className="text-sm font-medium text-foreground hover:text-primary">
              {link.title}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            {authLinks.map((link) => (
              <Link
                key={link.route}
                href={link.route}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-semibold',
                  link.route === '/signup'
                    ? 'bg-primary text-white hover:bg-primaryHover'
                    : 'border border-border text-foreground hover:border-primary'
                )}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4" aria-label="Mobile navigation">
            {mainLinks.map((link) => (
              <Link key={link.route} href={link.route} className="text-sm font-medium" onClick={() => setOpen(false)}>
                {link.title}
              </Link>
            ))}
            <div className="flex flex-col gap-2">
              {authLinks.map((link) => (
                <Link
                  key={link.route}
                  href={link.route}
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-semibold',
                    link.route === '/signup'
                      ? 'bg-primary text-white hover:bg-primaryHover'
                      : 'border border-border text-foreground hover:border-primary'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navigation;
