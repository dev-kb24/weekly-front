import Link from 'next/link';
import { PartieRow } from '@/components/shared/PartieRow';
import { formatSeanceDate } from '@/lib/week';
import { groupParties } from '@/lib/seance';
import type { Seance } from '@/interfaces/Seance';

interface SeanceDayCardProps {
  seance: Seance;
  hideDetailLink?: boolean;
  /** Masque le titre interne (utile quand le parent affiche déjà un <h1>) */
  hideTitle?: boolean;
  /** Affiche "Partie N" et le compteur "Parties (N)" — mode page de détail */
  showPartieOrder?: boolean;
}

export function SeanceDayCard({ seance, hideDetailLink = false, hideTitle = false, showPartieOrder = false }: SeanceDayCardProps) {
  const blocs = groupParties(seance.parties);
  const displayTitle = seance.title ?? formatSeanceDate(seance.date);
  return (
    <div className="flex flex-col rounded-xl bg-bg border border-[--color-border] border-l-[8px] border-l-accent p-4 w-[60%]">
      {!hideTitle && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-black text-[--color-text]">{displayTitle}</span>
          {!hideDetailLink && (
            <Link href={`/seances/${seance.id}`} className="text-xs font-semibold text-[--color-accent] hover:underline">
              Détail →
            </Link>
          )}
        </div>
      )}
      {hideTitle && !hideDetailLink && (
        <div className="flex justify-end mb-2">
          <Link href={`/seances/${seance.id}`} className="text-xs font-semibold text-[--color-accent] hover:underline">
            Détail →
          </Link>
        </div>
      )}
      {seance.notes && <p className="text-xs text-[--color-text-muted] mb-3">{seance.notes}</p>}
      {blocs.length > 0 && (
        <div className="flex flex-col gap-2">
          {showPartieOrder && (
            <p className="text-xs font-semibold text-[--color-text-muted] mb-1">
              Parties ({seance.parties.length})
            </p>
          )}
          {blocs.map((bloc, i) => {
            const isBloc = bloc.repetitions > 1 || bloc.parties.length > 1;
            return (
              <div key={bloc.blockId ?? `single-${i}`}>
                {isBloc ? (
                  <div className="rounded-lg border border-[--color-border] border-l-4 border-l-accent bg-[#FFF8F6] p-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[--color-accent] mb-2 block">
                      × {bloc.repetitions}
                    </span>
                    <div>
                      {bloc.parties.map((p, pi) => (
                        <PartieRow key={pi} partie={p} order={showPartieOrder ? p.order : undefined} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <PartieRow partie={bloc.parties[0]} order={showPartieOrder ? bloc.parties[0].order : undefined} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
