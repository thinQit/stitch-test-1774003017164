'use client';

import * as React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className = '', ...props }: CardProps) {
  return <div className={`p-4 ${className}`.trim()} {...props} />;
}
