'use client';

import { Select } from '@/components/ui/Select';

const ALLURE_MIN_OPTIONS = Array.from({ length: 14 }, (_, i) => ({
  value: String(i + 2),
  label: `${i + 2} min`,
}));

const ALLURE_SEC_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((s) => ({
  value: String(s),
  label: String(s).padStart(2, '0') + ' s',
}));

interface AllurePickerProps {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}

export function AllurePicker({ label, value, onChange }: AllurePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="form-label">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <Select
          label={`${label} — min`}
          options={ALLURE_MIN_OPTIONS}
          placeholder="— min"
          value={value != null ? String(Math.floor(value / 60)) : ''}
          onChange={(e) => {
            const m = e.target.value ? Number(e.target.value) : null;
            const s = value != null ? value % 60 : 0;
            onChange(m != null ? m * 60 + s : null);
          }}
        />
        <Select
          label={`${label} — sec`}
          options={ALLURE_SEC_OPTIONS}
          placeholder="— s"
          value={value != null ? String(value % 60) : ''}
          onChange={(e) => {
            const s = e.target.value ? Number(e.target.value) : 0;
            const m = value != null ? Math.floor(value / 60) : null;
            onChange(m != null ? m * 60 + s : null);
          }}
        />
      </div>
    </div>
  );
}
