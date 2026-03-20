'use client';

import * as React from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary'
          ? 'bg-primary text-white hover:bg-primary/90'
          : 'bg-muted text-foreground hover:bg-muted/80',
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
