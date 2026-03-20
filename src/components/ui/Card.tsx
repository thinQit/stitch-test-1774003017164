import * as React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
        {...props}
      >
        {title ? <h3 className="text-lg font-semibold text-gray-900">{title}</h3> : null}
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
        {children ? <div className={title || description ? 'mt-4' : ''}>{children}</div> : null}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
