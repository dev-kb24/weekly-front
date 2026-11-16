import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { FormField } from '@/components/ui/FormField';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;

    return (
      <FormField label={label} error={error} id={id}>
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border-[1.5px] border-[--color-border] bg-white px-3.5 py-2.5 text-sm text-[--color-text] placeholder-[--color-text-muted] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-[--color-accent] transition',
            error && 'border-[--color-error] focus:ring-[--color-error]',
            className,
          )}
          {...props}
        />
      </FormField>
    );
  },
);

Input.displayName = 'Input';
