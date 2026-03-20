import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return <div className={`p-4 ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: CardHeaderProps) {
  return <div className={`mb-2 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: CardContentProps) {
  return <div className={`mb-2 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }: CardFooterProps) {
  return <div className={`${className}`} {...props} />;
}
