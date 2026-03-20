'use client';

import type { HTMLAttributes } from 'react';

type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

const cn = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export default function Spinner({ className, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-sm text-foreground/70', className)} {...props}>
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
