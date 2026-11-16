import { render, screen } from '@testing-library/react';
import { SeanceCard } from '@/components/shared/SeanceCard';
import { CadenceType, DurationUnit, PartType } from '@/types/seance';
import type { Seance } from '@/interfaces/Seance';

const BASE_SEANCE: Seance = {
  id: '1',
  date: '2026-04-14',
  title: 'Fractionné du jeudi',
  notes: null,
  parties: [
    {
      order: 1,
      type: PartType.ECHAUFFEMENT,
      durationUnit: DurationUnit.TIME,
      durationMinutes: 15,
      distanceKm: null,
      cadenceType: CadenceType.ZONE,
      heartRateZone: 1,
      allureMinMin: null,
      allureMinMax: null,
      repetitions: 1,
      blockId: null,
    },
  ],
  createdAt: '2026-04-14T10:00:00Z',
  updatedAt: '2026-04-14T10:00:00Z',
};

describe('SeanceCard', () => {
  it('affiche le titre de la séance', () => {
    render(<SeanceCard seance={BASE_SEANCE} />);
    expect(screen.getByText('Fractionné du jeudi')).toBeInTheDocument();
  });

  it('affiche la date formatée si pas de titre', () => {
    render(<SeanceCard seance={{ ...BASE_SEANCE, title: null }} />);
    expect(screen.getByText('14/04/2026')).toBeInTheDocument();
  });


  it('affiche les notes si présentes', () => {
    render(<SeanceCard seance={{ ...BASE_SEANCE, notes: 'Bonne séance' }} />);
    expect(screen.getByText('Bonne séance')).toBeInTheDocument();
  });

  it('affiche la durée totale en minutes (< 60 min)', () => {
    render(<SeanceCard seance={BASE_SEANCE} />);
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('affiche la durée totale en heures (>= 60 min)', () => {
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        { ...BASE_SEANCE.parties[0], durationMinutes: 90 },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.getByText('1h30')).toBeInTheDocument();
  });

  it("n'affiche pas la durée si elle est nulle", () => {
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        { ...BASE_SEANCE.parties[0], durationUnit: DurationUnit.DISTANCE, durationMinutes: null, distanceKm: 5 },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.queryByText(/min|h\d/)).toBeNull();
  });

  it('calcule la durée depuis distance + allure (allureMinMin uniquement)', () => {
    // 5 km × 300 sec/km ÷ 60 = 25 min
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        {
          ...BASE_SEANCE.parties[0],
          durationUnit: DurationUnit.DISTANCE,
          durationMinutes: null,
          distanceKm: 5,
          cadenceType: CadenceType.ALLURE,
          heartRateZone: null,
          allureMinMin: 300,
          allureMinMax: null,
        },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.getByText('25 min')).toBeInTheDocument();
  });

  it('calcule la durée depuis distance + allure (moyenne allureMinMin/Max)', () => {
    // 10 km × ((270+330)/2 = 300) sec/km ÷ 60 = 50 min
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        {
          ...BASE_SEANCE.parties[0],
          durationUnit: DurationUnit.DISTANCE,
          durationMinutes: null,
          distanceKm: 10,
          cadenceType: CadenceType.ALLURE,
          heartRateZone: null,
          allureMinMin: 270,
          allureMinMax: 330,
        },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.getByText('50 min')).toBeInTheDocument();
  });

  it('multiplie la durée calculée par le nombre de répétitions', () => {
    // 5 km × 300 sec/km ÷ 60 × 3 répétitions = 75 min = 1h15
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        {
          ...BASE_SEANCE.parties[0],
          durationUnit: DurationUnit.DISTANCE,
          durationMinutes: null,
          distanceKm: 5,
          cadenceType: CadenceType.ALLURE,
          heartRateZone: null,
          allureMinMin: 300,
          allureMinMax: null,
          repetitions: 3,
        },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.getByText('1h15')).toBeInTheDocument();
  });

  it('additionne la durée TIME et la durée calculée depuis distance + allure', () => {
    // 15 min (time) + 5 km × 300 sec/km ÷ 60 (25 min) = 40 min
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        BASE_SEANCE.parties[0], // 15 min échauffement
        {
          order: 2,
          type: PartType.RUNNING,
          durationUnit: DurationUnit.DISTANCE,
          durationMinutes: null,
          distanceKm: 5,
          cadenceType: CadenceType.ALLURE,
          heartRateZone: null,
          allureMinMin: 300,
          allureMinMax: null,
          repetitions: 1,
          blockId: null,
        },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.getByText('40 min')).toBeInTheDocument();
  });

  it("n'ajoute pas la distance sans allure (zone cardiaque)", () => {
    // distance + zone cardiaque → durée incalculable → pas de durée affichée
    const seance: Seance = {
      ...BASE_SEANCE,
      parties: [
        {
          ...BASE_SEANCE.parties[0],
          durationUnit: DurationUnit.DISTANCE,
          durationMinutes: null,
          distanceKm: 5,
          cadenceType: CadenceType.ZONE,
          heartRateZone: 3,
          allureMinMin: null,
          allureMinMax: null,
        },
      ],
    };
    render(<SeanceCard seance={seance} />);
    expect(screen.queryByText(/min|h\d/)).toBeNull();
  });
});
