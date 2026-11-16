const MOCK_WEEK_LABEL = '14 — 20 avr.';

interface MockPartie {
  type: string;
  detail: string;
}

interface MockSeance {
  day: string;
  title: string;
  parties: MockPartie[];
  notes?: string;
}

const MOCK_SEANCES: MockSeance[] = [
  {
    day: 'Lun',
    title: 'Sortie endurance',
    parties: [
      { type: 'Échauffement', detail: '15 min' },
      { type: 'Running', detail: '10 km' },
      { type: 'Récupération', detail: '10 min' },
    ],
  },
  {
    day: 'Mer',
    title: 'Séance fractionné',
    parties: [
      { type: 'Échauffement', detail: '20 min' },
      { type: 'Fractionné', detail: '6 × 800 m — Zone 4' },
      { type: 'Récupération', detail: '15 min' },
    ],
    notes: '200 m trot entre chaque répétition',
  },
  {
    day: 'Ven',
    title: 'Tempo 45 min',
    parties: [
      { type: 'Échauffement', detail: '10 min' },
      { type: 'Running', detail: '45 min — 4:30/km' },
    ],
  },
  {
    day: 'Dim',
    title: 'Sortie longue',
    parties: [
      { type: 'Échauffement', detail: '15 min' },
      { type: 'Running', detail: '21 km' },
      { type: 'Récupération', detail: '10 min' },
    ],
    notes: 'Allure libre, priorité distance',
  },
];

const EMPTY_DAYS = ['Mar', 'Jeu', 'Sam'];

function MockSeanceCard({ seance }: { seance: MockSeance }) {
  const typeLabels = seance.parties.map((p) => p.type).join(' · ');
  return (
    <div className="rounded-xl bg-[#F7F7F7] border border-[#E8E8E8] border-l-[3px] border-l-[#FF3B00] p-3">
      <span className="block text-sm font-black text-[#111111] mb-1">{seance.title}</span>
      <span className="text-xs text-[#999999]">{typeLabels}</span>
      {seance.notes && (
        <p className="mt-1.5 text-xs text-[#999999] line-clamp-1">{seance.notes}</p>
      )}
    </div>
  );
}

export function LandingMockPlanning() {
  const allDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <section className="bg-[--color-surface] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[--color-text-muted] mb-4">
          Aperçu
        </p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[--color-text] mb-12">
          Une semaine d&apos;un coup d&apos;œil.
        </h2>

        {/* Week header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-[--color-text-muted]">{MOCK_WEEK_LABEL}</span>
          <div className="flex rounded-full border border-[--color-border] overflow-hidden text-xs">
            <span className="px-3 py-1.5 font-black bg-[--color-text] text-[--color-bg]">Semaine</span>
            <span className="px-3 py-1.5 font-semibold text-[--color-text-muted] bg-[--color-bg]">Jour</span>
          </div>
        </div>

        {/* 7-column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {allDays.map((day) => {
            const seance = MOCK_SEANCES.find((s) => s.day === day);
            const isEmpty = EMPTY_DAYS.includes(day);
            const isToday = day === 'Lun';

            return (
              <div key={day} className="min-h-[60px]">
                <div
                  className={`w-full text-left px-2 py-1 mb-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    isToday
                      ? 'bg-[--color-text] text-[--color-bg]'
                      : 'text-[--color-text-muted]'
                  }`}
                >
                  {day}
                  {seance && (
                    <span className="ml-1 font-normal">(1)</span>
                  )}
                </div>
                {seance && <MockSeanceCard seance={seance} />}
                {isEmpty && (
                  <div className="rounded-xl border border-dashed border-[--color-border] h-12 opacity-40" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
