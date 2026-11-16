'use client';

import { Button } from '@/components/ui/Button';
import { WeekNavHeader } from '@/components/shared/WeekNavHeader';
import { SeanceDayCard } from '@/components/shared/SeanceDayCard';
import { formatDayFullLabel } from '@/lib/week';
import type { Seance } from '@/interfaces/Seance';

interface DayViewProps {
  date: Date;
  seances: Seance[];
  onPrev: () => void;
  onNext: () => void;
  onBackToWeek: () => void;
  onNewSeance: () => void;
}

export function DayView({ date, seances, onPrev, onNext, onBackToWeek, onNewSeance }: DayViewProps) {
  return (
    <div>
      <WeekNavHeader
        label={formatDayFullLabel(date)}
        labelClassName="capitalize"
        onPrev={onPrev}
        onNext={onNext}
        prevLabel="Jour précédent"
        nextLabel="Jour suivant"
      />
      {seances.length === 0 ? (
        <p className="text-center text-[--color-text-muted] text-sm py-10">Aucune séance ce jour</p>
      ) : (
        <div className="flex items-center flex-col gap-3">
          {seances.map((s) => <SeanceDayCard key={s.id} seance={s} />)}
        </div>
      )}
      <div className="mt-6 flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={onBackToWeek}>← Vue semaine</Button>
        <Button size="sm" className="hidden sm:inline-flex" onClick={onNewSeance}>+ Nouvelle séance</Button>
      </div>
    </div>
  );
}
