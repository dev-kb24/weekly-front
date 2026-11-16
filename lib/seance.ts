import { CadenceType, DurationUnit } from '@/types/seance';
import type { BlocDisplay, RunningPartie } from '@/interfaces/RunningPartie';
import type { Seance } from '@/interfaces/Seance';

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

export function totalDurationMinutes(seance: Seance): number {
  const total = seance.parties.reduce((sum, p) => {
    if (p.durationUnit === DurationUnit.TIME && p.durationMinutes != null) {
      return sum + p.durationMinutes * p.repetitions;
    }
    if (
      p.durationUnit === DurationUnit.DISTANCE &&
      p.distanceKm != null &&
      p.cadenceType === CadenceType.ALLURE &&
      p.allureMinMin != null
    ) {
      const avgAllureSec =
        p.allureMinMax != null
          ? (p.allureMinMin + p.allureMinMax) / 2
          : p.allureMinMin;
      return sum + (p.distanceKm * avgAllureSec * p.repetitions) / 60;
    }
    return sum;
  }, 0);
  return Math.round(total);
}

export function groupParties(parties: RunningPartie[]): BlocDisplay[] {
  const blocs: BlocDisplay[] = [];
  const indexByBlockId = new Map<string, number>();
  for (const p of parties) {
    if (p.blockId && indexByBlockId.has(p.blockId)) {
      blocs[indexByBlockId.get(p.blockId)!].parties.push(p);
    } else {
      const idx = blocs.length;
      if (p.blockId) indexByBlockId.set(p.blockId, idx);
      blocs.push({ blockId: p.blockId, repetitions: p.repetitions, parties: [p] });
    }
  }
  return blocs;
}
