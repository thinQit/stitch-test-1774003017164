'use client';

import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', ...props }: InputProps) {
  return <input className={`p-4 ${className}`.trim()} {...props} />;
}
