import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <div className="flex w-full flex-col gap-1">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
