'use client';

import { useCallback, useState } from 'react';
import { getMonday, nextDay, nextWeek, prevDay, prevWeek } from '@/lib/week';

type View = 'week' | 'day';

interface WeekViewState {
  view: View;
  currentDate: Date;
}

interface UseWeekViewReturn {
  view: View;
  currentDate: Date;
  goToDay: (date: Date) => void;
  goToWeek: () => void;
  prevPeriod: () => void;
  nextPeriod: () => void;
}

export function useWeekView(): UseWeekViewReturn {
  const [state, setState] = useState<WeekViewState>({
    view: 'week',
    currentDate: getMonday(new Date()),
  });

  const goToDay = useCallback((date: Date) => {
    setState({ view: 'day', currentDate: date });
  }, []);

  const goToWeek = useCallback(() => {
    setState((prev) => ({ view: 'week', currentDate: getMonday(prev.currentDate) }));
  }, []);

  const prevPeriod = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate:
        prev.view === 'week' ? prevWeek(prev.currentDate) : prevDay(prev.currentDate),
    }));
  }, []);

  const nextPeriod = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate:
        prev.view === 'week' ? nextWeek(prev.currentDate) : nextDay(prev.currentDate),
    }));
  }, []);

  return {
    view: state.view,
    currentDate: state.currentDate,
    goToDay,
    goToWeek,
    prevPeriod,
    nextPeriod,
  };
}
