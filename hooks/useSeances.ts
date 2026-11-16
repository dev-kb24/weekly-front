'use client';

import { useCallback, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { getISOWeek } from '@/lib/week';
import type { CreateSeancePayload } from '@/interfaces/CreateSeancePayload';
import type { Seance } from '@/interfaces/Seance';
import type { UpdateSeancePayload } from '@/types/seance';

interface UseSeancesReturn {
  seances: Seance[];
  isLoading: boolean;
  error: string | null;
  fetchByWeek: (weekStart: Date) => Promise<void>;
  fetchOne: (id: string) => Promise<Seance | null>;
  create: (payload: CreateSeancePayload) => Promise<Seance | null>;
  update: (id: string, payload: UpdateSeancePayload) => Promise<Seance | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useSeances(): UseSeancesReturn {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchByWeek = useCallback(async (weekStart: Date) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    const week = getISOWeek(weekStart);
    try {
      const result = await api.get<Seance[]>(`/seances?week=${week}`, controller.signal);
      if (result.error === null) setSeances(result.data);
      else setError(result.error);
    } catch {
      // AbortError: une nouvelle requête est en cours, on ignore
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id: string): Promise<Seance | null> => {
    const result = await api.get<Seance>(`/seances/${id}`);
    if (result.error !== null) {
      setError(result.error);
      return null;
    }
    return result.data;
  }, []);

  const create = useCallback(async (payload: CreateSeancePayload): Promise<Seance | null> => {
    setError(null);
    const result = await api.post<Seance>('/seances', payload);
    if (result.error !== null) {
      setError(result.error);
      return null;
    }
    setSeances((prev) => [...prev, result.data]);
    return result.data;
  }, []);

  const update = useCallback(
    async (id: string, payload: UpdateSeancePayload): Promise<Seance | null> => {
      setError(null);
      const result = await api.patch<Seance>(`/seances/${id}`, payload);
      if (result.error !== null) {
        setError(result.error);
        return null;
      }
      setSeances((prev) => prev.map((s) => (s.id === id ? result.data : s)));
      return result.data;
    },
    [],
  );

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    const { error: err } = await api.delete<void>(`/seances/${id}`);
    if (err) {
      setError(err);
      return false;
    }
    setSeances((prev) => prev.filter((s) => s.id !== id));
    return true;
  }, []);

  return { seances, isLoading, error, fetchByWeek, fetchOne, create, update, remove };
}
