import * as React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className = "", ...props }: SpinnerProps) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${className}`}
      {...props}
    />
  );
}
