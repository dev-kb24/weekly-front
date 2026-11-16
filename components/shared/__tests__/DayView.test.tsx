import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DayView } from '@/views/DayView';
import { CadenceType, DurationUnit, PartType } from '@/types/seance';
import type { Seance } from '@/interfaces/Seance';

const DATE = new Date('2026-04-14T00:00:00');

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

describe('DayView', () => {
  it('affiche le label du jour', () => {
    render(
      <DayView
        date={DATE}
        seances={[]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText(/Mardi/i)).toBeInTheDocument();
  });

  it("affiche un message quand il n'y a aucune séance", () => {
    render(
      <DayView
        date={DATE}
        seances={[]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText('Aucune séance ce jour')).toBeInTheDocument();
  });

  it('affiche les séances du jour', () => {
    render(
      <DayView
        date={DATE}
        seances={[MOCK_SEANCE]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText('Sortie longue')).toBeInTheDocument();
  });

  it('appelle onPrev quand on clique sur la flèche gauche', async () => {
    const onPrev = jest.fn();
    render(
      <DayView
        date={DATE}
        seances={[]}
        onPrev={onPrev}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Jour précédent' }));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('appelle onNext quand on clique sur la flèche droite', async () => {
    const onNext = jest.fn();
    render(
      <DayView
        date={DATE}
        seances={[]}
        onPrev={jest.fn()}
        onNext={onNext}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Jour suivant' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('appelle onBackToWeek quand on clique sur Vue semaine', async () => {
    const onBackToWeek = jest.fn();
    render(
      <DayView
        date={DATE}
        seances={[]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={onBackToWeek}
        onNewSeance={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Vue semaine/i }));
    expect(onBackToWeek).toHaveBeenCalledTimes(1);
  });

  it('appelle onNewSeance au clic sur + Nouvelle séance', async () => {
    const onNewSeance = jest.fn();
    render(
      <DayView
        date={DATE}
        seances={[]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={onNewSeance}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: '+ Nouvelle séance' }));
    expect(onNewSeance).toHaveBeenCalledTimes(1);
  });

  it('affiche le label du type de la partie', () => {
    render(
      <DayView
        date={DATE}
        seances={[MOCK_SEANCE]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('affiche la durée de la partie', () => {
    render(
      <DayView
        date={DATE}
        seances={[MOCK_SEANCE]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('affiche la zone cardiaque', () => {
    render(
      <DayView
        date={DATE}
        seances={[MOCK_SEANCE]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    expect(screen.getByText('Zone 2')).toBeInTheDocument();
  });

  it('affiche le lien Détail →', () => {
    render(
      <DayView
        date={DATE}
        seances={[MOCK_SEANCE]}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onBackToWeek={jest.fn()}
        onNewSeance={jest.fn()}
      />,
    );
    const link = screen.getByRole('link', { name: 'Détail →' });
    expect(link).toHaveAttribute('href', '/seances/1');
  });
});
