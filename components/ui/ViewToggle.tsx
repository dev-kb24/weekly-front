'use client';

import { cn } from '@/lib/cn';

type View = 'week' | 'day';

interface ViewToggleProps {
  current: View;
  onChange: (view: View) => void;
}

const VIEWS: { value: View; label: string }[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'day', label: 'Jour' },
];

export function ViewToggle({ current, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-full border border-[--color-border] overflow-hidden">
      {VIEWS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'px-4 py-1.5 text-sm font-semibold transition-colors',
            current === value
              ? 'bg-accent text-white'
              : 'bg-bg text-text-muted hover:bg-surface',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
