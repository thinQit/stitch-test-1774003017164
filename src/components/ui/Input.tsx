'use client';

import * as React from 'react';
import clsx from 'clsx';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label && <span className="text-secondary">{label}</span>}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30',
          className
        )}
        {...props}
      />
    </label>
  )
);

Input.displayName = 'Input';

export default Input;
