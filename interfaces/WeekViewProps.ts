import type { Seance } from '@/interfaces/Seance';
export interface WeekViewProps {
  weekStart: Date;
  seances: Seance[];
  onPrev: () => void;
  onNext: () => void;
  onDayClick: (date: Date) => void;
  onNewSeance: () => void;
}