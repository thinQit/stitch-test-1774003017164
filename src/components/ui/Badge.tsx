import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs ${className}`}
      {...props}
    />
  );
}
