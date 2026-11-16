'use client';

import { Button } from '@/components/ui/Button';
import { SeanceCard } from '@/components/shared/SeanceCard';
import { WeekNavHeader } from '@/components/shared/WeekNavHeader';
import {
  formatDayLabel,
  formatWeekLabel,
  isSameDay,
  toISODateString,
  weekDays,
} from '@/lib/week';
import { WeekViewProps } from '@/interfaces/WeekViewProps';

export function WeekView({ weekStart, seances, onPrev, onNext, onDayClick, onNewSeance }: WeekViewProps) {
  const days = weekDays(weekStart);
  const today = new Date();

  return (
    <div>
      <WeekNavHeader label={formatWeekLabel(weekStart)} onPrev={onPrev} onNext={onNext} />

      {/* Grille semaine — Mobile: empilé, Desktop: 7 colonnes */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-7">
          {days.map((day) => {
            const daySeances = seances.filter((s) => s.date === toISODateString(day));
            const isToday = isSameDay(day, today);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[140px] border-b border-border last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${
                  isToday ? 'bg-accent/5' : 'bg-bg'
                }`}
              >
                {/* Label du jour — cliquable pour basculer en vue jour */}
                <button
                  type="button"
                  onClick={() => onDayClick(day)}
                  className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-widest border-b border-border transition-colors ${
                    isToday
                      ? 'text-accent bg-accent/10 hover:bg-accent/15'
                      : 'text-text-muted hover:bg-surface'
                  }`}
                >
                  {formatDayLabel(day)}
                  {daySeances.length > 0 && (
                    <span className="ml-1 font-normal text-text-muted">({daySeances.length})</span>
                  )}
                </button>

                {/* Séances du jour */}
                <div className="flex flex-col gap-1.5 p-3">
                  {daySeances.map((s) => (
                    <SeanceCard key={s.id} seance={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="sm" className="hidden sm:inline-flex" onClick={onNewSeance}>
          + Nouvelle séance
        </Button>
      </div>
    </div>
  );
}
