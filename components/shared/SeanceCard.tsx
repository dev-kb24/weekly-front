import Link from 'next/link';
import { formatSeanceDate } from '@/lib/week';
import { formatDuration, totalDurationMinutes } from '@/lib/seance';
import type { Seance } from '@/interfaces/Seance';

interface SeanceCardProps {
  seance: Seance;
}

function SeanceSummary({ seance }: { seance: Seance }) {
  const total = totalDurationMinutes(seance);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {total > 0 && (
        <>
          <span className="text-xs font-semibold text-[--color-text-muted]">{formatDuration(total)}</span>
        </>
      )}
    </div>
  );
}

export function SeanceCard({ seance }: SeanceCardProps) {
  const displayTitle = seance.title ?? formatSeanceDate(seance.date);

  return (
    <Link
      href={`/seances/${seance.id}`}
      className="relative block rounded-xl bg-[--color-surface] border border-l-[8px] border-l-accent p-3 hover:bg-[#EFEFEF] transition-colors"
    >
      <span className="block text-sm font-black text-[--color-text] mb-1">{displayTitle}</span>
      <SeanceSummary seance={seance} />
      {seance.notes && (
        <p className="mt-1.5 text-xs text-[--color-text-muted] line-clamp-1">{seance.notes}</p>
      )}
    </Link>
  );
}

