import { formatPartieAmount, formatPartieCadence, PART_TYPE_LABELS } from '@/lib/constants';
import type { RunningPartie } from '@/interfaces/RunningPartie';

interface PartieRowProps {
  partie: RunningPartie;
  /** Affiche "Partie N" à droite quand fourni */
  order?: number;
}

export function PartieRow({ partie, order }: PartieRowProps) {
  const amount = formatPartieAmount(partie);
  const cadence = formatPartieCadence(partie);
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[--color-border] last:border-0">
      <span className="text-xs font-semibold text-[--color-text]">
        {PART_TYPE_LABELS[partie.type]}
      </span>
      <div className="flex items-center gap-2 text-xs text-[--color-text-muted]">
        <span>{amount}</span>
        {cadence && (
          <>
            <span className="text-[--color-border]">·</span>
            <span>{cadence}</span>
          </>
        )}
        {order != null && (
          <>
            <span className="text-[--color-border]">·</span>
            <span>Partie {order}</span>
          </>
        )}
      </div>
    </div>
  );
}
