import { renderHook, act } from '@testing-library/react';
import { useSeances } from '@/hooks/useSeances';
import { api } from '@/lib/api';
import { CadenceType, DurationUnit, PartType } from '@/types/seance';
import type { Seance } from '@/interfaces/Seance';

jest.mock('@/lib/api');

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
      durationMinutes: 60,
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

const CREATE_PAYLOAD = {
  date: '2026-04-14',
  parties: [
    {
      order: 1,
      type: PartType.RUNNING,
      durationUnit: DurationUnit.TIME,
      durationMinutes: 60,
      distanceKm: null,
      cadenceType: CadenceType.ZONE,
      heartRateZone: 2,
      allureMinMin: null,
      allureMinMax: null,
      repetitions: 1,
      blockId: null,
    },
  ],
};

describe('useSeances', () => {
  afterEach(() => jest.clearAllMocks());

  it('démarre avec une liste de séances vide', () => {
    const { result } = renderHook(() => useSeances());
    expect(result.current.seances).toHaveLength(0);
  });

  it("fetchByWeek charge les séances depuis l'API", async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: [MOCK_SEANCE], error: null });
    const { result } = renderHook(() => useSeances());
    await act(() => result.current.fetchByWeek(new Date('2026-04-14')));
    expect(result.current.seances).toHaveLength(1);
    expect(result.current.seances[0].id).toBe('1');
  });

  it('create ajoute la séance à la liste', async () => {
    jest.spyOn(api, 'post').mockResolvedValueOnce({ data: MOCK_SEANCE, error: null });
    const { result } = renderHook(() => useSeances());
    await act(() => result.current.create(CREATE_PAYLOAD));
    expect(result.current.seances).toHaveLength(1);
  });

  it('update modifie la séance dans la liste', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: [MOCK_SEANCE], error: null });
    const updated = { ...MOCK_SEANCE, title: 'Nouvelle sortie' };
    jest.spyOn(api, 'patch').mockResolvedValueOnce({ data: updated, error: null });
    const { result } = renderHook(() => useSeances());
    await act(() => result.current.fetchByWeek(new Date('2026-04-14')));
    await act(() => result.current.update('1', { title: 'Nouvelle sortie' }));
    expect(result.current.seances[0].title).toBe('Nouvelle sortie');
  });

  it('remove supprime la séance de la liste', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: [MOCK_SEANCE], error: null });
    jest.spyOn(api, 'delete').mockResolvedValueOnce({ data: null, error: null });
    const { result } = renderHook(() => useSeances());
    await act(() => result.current.fetchByWeek(new Date('2026-04-14')));
    await act(() => result.current.remove('1'));
    expect(result.current.seances).toHaveLength(0);
  });

  it("stocke le message d'erreur en cas d'échec de fetchByWeek", async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: null, error: 'Erreur réseau' });
    const { result } = renderHook(() => useSeances());
    await act(() => result.current.fetchByWeek(new Date('2026-04-14')));
    expect(result.current.error).toBe('Erreur réseau');
  });

  it('retourne null quand create échoue', async () => {
    jest.spyOn(api, 'post').mockResolvedValueOnce({ data: null, error: 'Erreur' });
    const { result } = renderHook(() => useSeances());
    let seance: Seance | null = null;
    await act(async () => {
      seance = await result.current.create(CREATE_PAYLOAD);
    });
    expect(seance).toBeNull();
  });
});
