'use client';

import * as React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = '', ...props }: ButtonProps) {
  return <button className={`p-4 ${className}`.trim()} {...props} />;
}
