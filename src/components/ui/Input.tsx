'use client';

import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  wrapperClassName?: string;
};

const cn = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export default function Input({
  label,
  wrapperClassName,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn('flex flex-col gap-2', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm placeholder:text-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          className
        )}
        {...props}
      />
    </div>
  );
}
