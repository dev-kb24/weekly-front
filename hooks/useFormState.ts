import { useState } from 'react';
import type { ChangeEvent } from 'react';

export function useFormState<T extends Record<string, unknown>>(initialState: T) {
  const [form, setForm] = useState<T>(initialState);

  const setField =
    (field: keyof T) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return { form, setForm, setField };
}
