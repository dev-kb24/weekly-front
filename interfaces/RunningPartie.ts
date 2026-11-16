import { CadenceType, DurationUnit, PartType } from '@/types/seance';

export interface BlocDisplay {
  blockId: string | null;
  repetitions: number;
  parties: RunningPartie[];
}

export interface RunningPartie {
  id?: string;
  order: number;
  type: PartType;
  durationUnit: DurationUnit;
  durationMinutes: number | null;
  distanceKm: number | null;
  cadenceType: CadenceType;
  heartRateZone: number | null;
  allureMinMin: number | null;
  allureMinMax: number | null;
  repetitions: number;
  blockId: string | null;
}
