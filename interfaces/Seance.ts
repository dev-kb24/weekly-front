import type { RunningPartie } from '@/interfaces/RunningPartie';

export interface Seance {
  id: string;
  date: string;
  title: string | null;
  notes: string | null;
  parties: RunningPartie[];
  createdAt: string;
  updatedAt: string;
}
