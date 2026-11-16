import { CadenceType, DurationUnit } from '@/types/seance';
import type { PartType } from '@/types/seance';
import type { RunningPartie } from '@/interfaces/RunningPartie';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const PART_TYPE_LABELS: Record<PartType, string> = {
  echauffement: 'Échauffement',
  running: 'Running',
  recuperation: 'Récupération',
};

export const CADENCE_TYPE_LABELS: Record<CadenceType, string> = {
  zone: 'Zone cardiaque',
  allure: 'Allure',
};

export function formatAllureMin(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}'${String(seconds).padStart(2, '0')}"/km`;
}

export function formatPartieAmount(partie: RunningPartie): string {
  return partie.durationUnit === DurationUnit.TIME
    ? `${partie.durationMinutes ?? '?'} min`
    : `${partie.distanceKm ?? '?'} km`;
}

export function formatPartieCadence(partie: RunningPartie): string {
  if (partie.cadenceType === CadenceType.ZONE) {
    return partie.heartRateZone != null ? `Zone ${partie.heartRateZone}` : '';
  }
  if (partie.allureMinMin != null) {
    return partie.allureMinMax != null
      ? `${formatAllureMin(partie.allureMinMin)} \u2013 ${formatAllureMin(partie.allureMinMax)}`
      : formatAllureMin(partie.allureMinMin);
  }
  return '';
}

