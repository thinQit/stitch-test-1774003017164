import * as React from 'react';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number;
  colorClassName?: string;
};

export default function Spinner({ size = 24, colorClassName = 'border-blue-600', className = '', ...props }: SpinnerProps) {
  const dimension = `${size}px`;
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <div
        className={`animate-spin rounded-full border-2 border-transparent ${colorClassName} border-t-transparent`}
        style={{ width: dimension, height: dimension }}
      />
    </div>
  );
}
