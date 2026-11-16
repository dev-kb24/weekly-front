import type { ReactNode } from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  id: string;
  children: ReactNode;
}

export function FormField({ label, error, id, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-[--color-error]">{error}</p>}
    </div>
  );
}
