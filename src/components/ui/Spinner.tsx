'use client';

import * as React from 'react';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement>;

export default function Spinner({ className = '', ...props }: SpinnerProps) {
  return <div className={`p-4 ${className}`.trim()} {...props} />;
}
