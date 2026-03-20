import type { HTMLAttributes } from 'react';

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={classNames('rounded-xl border border-border bg-white shadow-sm', className)}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classNames('border-b border-border p-4', className)} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classNames('p-4', className)} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classNames('border-t border-border p-4', className)} />;
}

export default Card;
