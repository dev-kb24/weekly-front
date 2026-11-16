import { renderHook, act } from '@testing-library/react';
import { useWeekView } from '@/hooks/useWeekView';
import { getMonday } from '@/lib/week';

describe('useWeekView', () => {
  it('démarre sur la vue semaine par défaut', () => {
    const { result } = renderHook(() => useWeekView());
    expect(result.current.view).toBe('week');
  });

  it('démarre sur le lundi de la semaine courante', () => {
    const { result } = renderHook(() => useWeekView());
    const expectedMonday = getMonday(new Date());
    expect(result.current.currentDate.toDateString()).toBe(expectedMonday.toDateString());
  });

  it('goToDay passe en vue jour avec la date donnée', () => {
    const { result } = renderHook(() => useWeekView());
    const target = new Date('2026-04-10T00:00:00');
    act(() => result.current.goToDay(target));
    expect(result.current.view).toBe('day');
    expect(result.current.currentDate.toDateString()).toBe(target.toDateString());
  });

  it('goToWeek revient en vue semaine et recale sur le lundi', () => {
    const { result } = renderHook(() => useWeekView());
    act(() => result.current.goToDay(new Date('2026-04-14T00:00:00')));
    act(() => result.current.goToWeek());
    expect(result.current.view).toBe('week');
    expect(result.current.currentDate.toDateString()).toBe(
      getMonday(new Date('2026-04-14')).toDateString(),
    );
  });

  it('prevPeriod recule d\'une semaine en vue semaine', () => {
    const { result } = renderHook(() => useWeekView());
    const before = result.current.currentDate.getTime();
    act(() => result.current.prevPeriod());
    expect(result.current.currentDate.getTime()).toBe(before - 7 * 86400000);
  });

  it('nextPeriod avance d\'une semaine en vue semaine', () => {
    const { result } = renderHook(() => useWeekView());
    const before = result.current.currentDate.getTime();
    act(() => result.current.nextPeriod());
    expect(result.current.currentDate.getTime()).toBe(before + 7 * 86400000);
  });

  it('prevPeriod recule d\'un jour en vue jour', () => {
    const { result } = renderHook(() => useWeekView());
    act(() => result.current.goToDay(new Date('2026-04-14T00:00:00')));
    act(() => result.current.prevPeriod());
    expect(result.current.currentDate.toDateString()).toBe(
      new Date('2026-04-13T00:00:00').toDateString(),
    );
  });

  it('nextPeriod avance d\'un jour en vue jour', () => {
    const { result } = renderHook(() => useWeekView());
    act(() => result.current.goToDay(new Date('2026-04-14T00:00:00')));
    act(() => result.current.nextPeriod());
    expect(result.current.currentDate.toDateString()).toBe(
      new Date('2026-04-15T00:00:00').toDateString(),
    );
  });
});
