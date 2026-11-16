import { Button } from '@/components/ui/Button';

interface WeekNavHeaderProps {
  label: string;
  labelClassName?: string;
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

export function WeekNavHeader({ label, labelClassName, onPrev, onNext, prevLabel = 'Semaine précédente', nextLabel = 'Semaine suivante' }: WeekNavHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" size="sm" onClick={onPrev} aria-label={prevLabel}>
        ←
      </Button>
      <span className={`text-sm font-semibold text-text-muted${labelClassName ? ` ${labelClassName}` : ''}`}>{label}</span>
      <Button variant="ghost" size="sm" onClick={onNext} aria-label={nextLabel}>
        →
      </Button>
    </div>
  );
}
