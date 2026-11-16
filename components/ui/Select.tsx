import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { FormField } from '@/components/ui/FormField';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;

    return (
      <FormField label={label} error={error} id={id}>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none rounded-lg border-[1.5px] border-[--color-border] bg-white px-3.5 py-2.5 pr-9 text-sm text-[--color-text] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-[--color-accent] transition',
              error && 'border-[--color-error] focus:ring-[--color-error]',
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[--color-text-muted]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </FormField>
    );
  },
);

Select.displayName = 'Select';
