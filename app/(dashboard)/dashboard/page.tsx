'use client';

import { useEffect, useState } from 'react';
import { DayView } from '@/views/DayView';
import { WeekView } from '@/views/WeekView';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { Modal } from '@/components/ui/Modal';
import { SeanceForm } from '@/components/forms/SeanceForm';
import { useSeances } from '@/hooks/useSeances';
import { useWeekView } from '@/hooks/useWeekView';
import { toISODateString } from '@/lib/week';
import type { CreateSeancePayload } from '@/interfaces/CreateSeancePayload';
import { AppErrors } from '@/lib/errors';

export default function DashboardPage() {
  const { view, currentDate, goToDay, goToWeek, prevPeriod, nextPeriod } = useWeekView();
  const { seances, isLoading, error, fetchByWeek, create } = useSeances();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchByWeek(currentDate);
  }, [currentDate, fetchByWeek]);

  const daySeances = seances.filter((s) => s.date === toISODateString(currentDate));

  const handleViewChange = (v: 'week' | 'day') => {
    if (v === 'week') goToWeek();
    else goToDay(new Date());
  };

  const handleCreateSubmit = async (payload: CreateSeancePayload) => {
    const seance = await create(payload);
    if (!seance) throw new Error(AppErrors.CREATE_SEANCE_FAILED);
    setIsCreateOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-black tracking-tight text-[--color-text]">Mes séances</h1>
        <ViewToggle current={view} onChange={handleViewChange} />
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {isLoading ? (
        <p className="text-center text-[--color-text-muted] text-sm py-10">Chargement…</p>
      ) : view === 'week' ? (
        <WeekView
          weekStart={currentDate}
          seances={seances}
          onPrev={prevPeriod}
          onNext={nextPeriod}
          onDayClick={goToDay}
          onNewSeance={() => setIsCreateOpen(true)}
        />
      ) : (
        <DayView
          date={currentDate}
          seances={daySeances}
          onPrev={prevPeriod}
          onNext={nextPeriod}
          onBackToWeek={goToWeek}
          onNewSeance={() => setIsCreateOpen(true)}
        />
      )}

      {/* FAB mobile */}
      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        aria-label="Nouvelle séance"
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[--color-accent] text-white text-2xl font-light hover:bg-[--color-accent-hover] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:ring-offset-2"
      >
        +
      </button>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nouvelle séance"
      >
        <SeanceForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateOpen(false)}
          submitLabel="Créer la séance"
        />
      </Modal>
    </div>
  );
}

