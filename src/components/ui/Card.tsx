import * as React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

const cx = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cx('rounded-2xl border border-border bg-white shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('border-b border-border px-6 py-5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('px-6 py-5', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('border-t border-border px-6 py-5', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { CardContent, CardFooter, CardHeader };
export default Card;
