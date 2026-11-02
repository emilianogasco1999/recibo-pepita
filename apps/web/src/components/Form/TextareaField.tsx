import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, error, helperText, className, id, ...props }, ref) => {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={textareaId}
        className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        ref={ref}
        aria-invalid={!!error}
        className={cn(
          'flex min-h-[96px] w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa0c84] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});
TextareaField.displayName = 'TextareaField';
