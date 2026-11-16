import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeekView } from '@/views/WeekView';
import { getMonday } from '@/lib/week';
import type { Seance } from '@/interfaces/Seance';
import { CadenceType, DurationUnit, PartType } from '@/types/seance';

// Monday April 13, 2026
const WEEK_START = getMonday(new Date('2026-04-14'));
const EMPTY: Seance[] = [];

const MOCK_SEANCE: Seance = {
  id: '1',
  date: '2026-04-14',
  title: 'Sortie longue',
  notes: null,
  parties: [
    {
      order: 1,
      type: PartType.RUNNING,
      durationUnit: DurationUnit.TIME,
      durationMinutes: 45,
      distanceKm: null,
      cadenceType: CadenceType.ZONE,
      heartRateZone: 2,
      allureMinMin: null,
      allureMinMax: null,
      repetitions: 1,
      blockId: null,
    },
  ],
  createdAt: '2026-04-14T10:00:00Z',
  updatedAt: '2026-04-14T10:00:00Z',
};

describe('WeekView', () => {
  it('affiche le label de la semaine (range de dates)', () => {
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={EMPTY}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onDayClick={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText(/13 – 19 avr\./)).toBeInTheDocument();
  });

  it('affiche 7 boutons de jour', () => {
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={EMPTY}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onDayClick={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    // Each day label is a button
    expect(screen.getByText(/Lun 13/)).toBeInTheDocument();
    expect(screen.getByText(/Dim 19/)).toBeInTheDocument();
  });

  it('appelle onPrev quand on clique sur la flèche gauche', async () => {
    const onPrev = jest.fn();
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={EMPTY}
        onPrev={onPrev}
        onNext={jest.fn()}
        onDayClick={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Semaine précédente' }));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('appelle onNext quand on clique sur la flèche droite', async () => {
    const onNext = jest.fn();
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={EMPTY}
        onPrev={jest.fn()}
        onNext={onNext}
        onDayClick={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Semaine suivante' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('appelle onDayClick avec la date correcte au clic sur un jour', async () => {
    const onDayClick = jest.fn();
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={EMPTY}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onDayClick={onDayClick}
        onNewSeance={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByText(/Mar 14/));
    expect(onDayClick).toHaveBeenCalledTimes(1);
  });

  it('affiche le compteur de séances pour les jours qui en ont', () => {
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={[MOCK_SEANCE]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onDayClick={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('appelle onNewSeance au clic sur + Nouvelle séance', async () => {
    const onNewSeance = jest.fn();
    render(
      <WeekView
        weekStart={WEEK_START}
        seances={EMPTY}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onDayClick={jest.fn()}
        onNewSeance={onNewSeance}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: '+ Nouvelle séance' }));
    expect(onNewSeance).toHaveBeenCalledTimes(1);
  });
});
