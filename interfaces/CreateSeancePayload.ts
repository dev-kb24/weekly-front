import type { RunningPartie } from '@/interfaces/RunningPartie';

export interface CreateSeancePayload {
  date: string;
  title?: string;
  notes?: string;
  parties: Omit<RunningPartie, 'id'>[];
}
