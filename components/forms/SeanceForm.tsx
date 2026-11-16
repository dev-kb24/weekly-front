'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AllurePicker } from '@/components/ui/AllurePicker';
import { CADENCE_TYPE_LABELS, PART_TYPE_LABELS } from '@/lib/constants';
import { CadenceType, DurationUnit, PartType } from '@/types/seance';
import type { CreateSeancePayload } from '@/interfaces/CreateSeancePayload';
import type { RunningPartie } from '@/interfaces/RunningPartie';
import { AppErrors } from '@/lib/errors';

const PART_TYPE_OPTIONS = Object.values(PartType).map((v) => ({
  value: v,
  label: PART_TYPE_LABELS[v],
}));

const DURATION_UNIT_OPTIONS = [
  { value: DurationUnit.TIME, label: 'Durée (min)' },
  { value: DurationUnit.DISTANCE, label: 'Distance (km)' },
];

const CADENCE_TYPE_OPTIONS = Object.values(CadenceType).map((v) => ({
  value: v,
  label: CADENCE_TYPE_LABELS[v],
}));

const ZONE_OPTIONS = [1, 2, 3, 4, 5].map((z) => ({
  value: String(z),
  label: `Zone ${z}`,
}));

type PartieForm = Omit<RunningPartie, 'id' | 'repetitions' | 'blockId'>;

interface BlocForm {
  tempId: string;
  repetitions: number;
  parties: PartieForm[];
}

function genId(): string {
  return crypto.randomUUID();
}

function newPartie(): PartieForm {
  return {
    order: 0,
    type: PartType.RUNNING,
    durationUnit: DurationUnit.TIME,
    durationMinutes: null,
    distanceKm: null,
    cadenceType: CadenceType.ZONE,
    heartRateZone: null,
    allureMinMin: null,
    allureMinMax: null,
  };
}

function newSingleBloc(): BlocForm {
  return { tempId: genId(), repetitions: 1, parties: [newPartie()] };
}

function newRepeatBloc(): BlocForm {
  return {
    tempId: genId(),
    repetitions: 2,
    parties: [
      { ...newPartie(), type: PartType.RUNNING },
      { ...newPartie(), type: PartType.RECUPERATION },
    ],
  };
}

/** Regroupe des parties plates (API) en blocs pour l'édition */
function partiesToBlocs(parties: Omit<RunningPartie, 'id'>[]): BlocForm[] {
  const map = new Map<string, BlocForm>();
  const singles: BlocForm[] = [];

  for (const p of parties) {
    const { repetitions, blockId, ...rest } = p;
    if (blockId) {
      if (!map.has(blockId)) {
        map.set(blockId, { tempId: blockId, repetitions, parties: [] });
      }
      map.get(blockId)!.parties.push(rest);
    } else {
      singles.push({ tempId: genId(), repetitions: 1, parties: [rest] });
    }
  }

  // Reconstruct order: singles interleaved with blocks based on order field
  const all = [...singles, ...Array.from(map.values())];
  all.sort((a, b) => (a.parties[0]?.order ?? 0) - (b.parties[0]?.order ?? 0));
  return all;
}

/** Aplatit les blocs en parties avec order global, repetitions et blockId */
function blocsToParties(blocs: BlocForm[]): Omit<RunningPartie, 'id'>[] {
  let startOrder = 1;
  return blocs.flatMap((bloc) => {
    const blockId = bloc.repetitions > 1 || bloc.parties.length > 1 ? bloc.tempId : null;
    const parties = bloc.parties.map((p, i) => ({
      ...p,
      order: startOrder + i,
      repetitions: bloc.repetitions,
      blockId,
    }));
    startOrder += bloc.parties.length;
    return parties;
  });
}

// ─── PartieRow ─────────────────────────────────────────────────────────────

interface PartieRowProps {
  partie: PartieForm;
  showRemove: boolean;
  onChange: (p: PartieForm) => void;
  onRemove: () => void;
  label?: string;
}

function PartieRow({ partie, showRemove, onChange, onRemove, label }: PartieRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border-[1.5px] border-[--color-border] bg-white p-4">
      <div className="flex items-center justify-between">
        {label && (
          <span className="form-label">
            {label}
          </span>
        )}
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto rounded p-1 text-xs text-[--color-error] hover:bg-[--color-surface] transition-colors"
          >
            Retirer
          </button>
        )}
      </div>

      <Select
        label="Type"
        options={PART_TYPE_OPTIONS}
        value={partie.type}
        onChange={(e) => onChange({ ...partie, type: e.target.value as PartType })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Mesure"
          options={DURATION_UNIT_OPTIONS}
          value={partie.durationUnit}
          onChange={(e) =>
            onChange({
              ...partie,
              durationUnit: e.target.value as DurationUnit,
              durationMinutes: null,
              distanceKm: null,
            })
          }
        />
        {partie.durationUnit === DurationUnit.TIME ? (
          <Input
            label="Durée (min)"
            type="number"
            value={partie.durationMinutes ?? ''}
            onChange={(e) =>
              onChange({
                ...partie,
                durationMinutes: e.target.value ? Number(e.target.value) : null,
              })
            }
            min={1}
            required
          />
        ) : (
          <Input
            label="Distance (km)"
            type="number"
            value={partie.distanceKm ?? ''}
            onChange={(e) =>
              onChange({
                ...partie,
                distanceKm: e.target.value ? Number(e.target.value) : null,
              })
            }
            min={0}
            step={0.1}
            required
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="Cadence"
          options={CADENCE_TYPE_OPTIONS}
          value={partie.cadenceType}
          onChange={(e) =>
            onChange({
              ...partie,
              cadenceType: e.target.value as CadenceType,
              heartRateZone: null,
              allureMinMin: null,
              allureMinMax: null,
            })
          }
        />
        {partie.cadenceType === CadenceType.ZONE ? (
          <Select
            label="Zone cardiaque"
            options={ZONE_OPTIONS}
            placeholder="— Choisir —"
            value={partie.heartRateZone != null ? String(partie.heartRateZone) : ''}
            onChange={(e) =>
              onChange({
                ...partie,
                heartRateZone: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            <AllurePicker
              label="Allure min"
              value={partie.allureMinMin}
              onChange={(v) => onChange({ ...partie, allureMinMin: v })}
            />
            <AllurePicker
              label="Allure max"
              value={partie.allureMinMax}
              onChange={(v) => onChange({ ...partie, allureMinMax: v })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BlocRow ───────────────────────────────────────────────────────────────

interface BlocRowProps {
  bloc: BlocForm;
  index: number;
  total: number;
  onChange: (b: BlocForm) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function BlocRow({ bloc, index, total, onChange, onRemove, onMoveUp, onMoveDown }: BlocRowProps) {
  const isRepeat = bloc.repetitions > 1 || bloc.parties.length > 1;

  const updatePartie = (pi: number, p: PartieForm) =>
    onChange({ ...bloc, parties: bloc.parties.map((x, i) => (i === pi ? p : x)) });

  const addPartie = () =>
    onChange({ ...bloc, parties: [...bloc.parties, newPartie()] });

  const removePartie = (pi: number) =>
    onChange({ ...bloc, parties: bloc.parties.filter((_, i) => i !== pi) });

  if (!isRepeat) {
    // Partie simple — affichage compact
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 justify-end">
          <button type="button" onClick={onMoveUp} disabled={index === 0} aria-label="Monter"
            className="rounded p-1 text-xs text-[--color-text-muted] hover:bg-[--color-surface] hover:text-[--color-text] disabled:opacity-20 transition-colors">↑</button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label="Descendre"
            className="rounded p-1 text-xs text-[--color-text-muted] hover:bg-[--color-surface] hover:text-[--color-text] disabled:opacity-20 transition-colors">↓</button>
          <button type="button" onClick={onRemove}
            className="ml-1 rounded p-1 text-xs text-[--color-error] hover:bg-[--color-surface] transition-colors">Supprimer</button>
        </div>
        <PartieRow
          partie={bloc.parties[0]}
          showRemove={false}
          onChange={(p) => updatePartie(0, p)}
          onRemove={() => {}}
        />
      </div>
    );
  }

  // Bloc répété
  return (
    <div className="flex flex-col gap-3 rounded-xl border-[1.5px] border-l-4 border-[--color-border] border-l-[--color-accent] bg-[--color-surface] p-4">
      {/* Header du bloc */}
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-[--color-accent] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
          Bloc
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="bloc-repetitions" className="form-label">
            Répétitions
          </label>
          <input
            id="bloc-repetitions"
            aria-label="Répétitions"
            type="number"
            min={1}
            value={bloc.repetitions}
            onChange={(e) => onChange({ ...bloc, repetitions: Math.max(1, Number(e.target.value)) })}
            className="w-16 rounded-lg border-[1.5px] border-[--color-border] bg-white px-2 py-1 text-sm text-[--color-text] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-[--color-accent] transition"
          />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={onMoveUp} disabled={index === 0} aria-label="Monter le bloc"
            className="rounded p-1 text-xs text-[--color-text-muted] hover:bg-white hover:text-[--color-text] disabled:opacity-20 transition-colors">↑</button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label="Descendre le bloc"
            className="rounded p-1 text-xs text-[--color-text-muted] hover:bg-white hover:text-[--color-text] disabled:opacity-20 transition-colors">↓</button>
          <button type="button" onClick={onRemove}
            className="ml-1 rounded p-1 text-xs text-[--color-error] hover:bg-white transition-colors">Supprimer</button>
        </div>
      </div>

      {/* Parties du bloc */}
      <div className="flex flex-col gap-2">
        {bloc.parties.map((p, pi) => (
          <PartieRow
            key={pi}
            partie={p}
            showRemove={bloc.parties.length > 1}
            label={`Étape ${pi + 1}`}
            onChange={(updated) => updatePartie(pi, updated)}
            onRemove={() => removePartie(pi)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addPartie}
        className="self-start rounded-lg border-[1.5px] border-dashed border-[--color-border] px-3 py-1.5 text-xs font-semibold text-[--color-text-muted] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors"
      >
        + Ajouter une étape
      </button>
    </div>
  );
}

// ─── SeanceForm ────────────────────────────────────────────────────────────

interface SeanceFormProps {
  initialValues?: Partial<CreateSeancePayload>;
  onSubmit: (payload: CreateSeancePayload) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function SeanceForm({ initialValues, onSubmit, onCancel, submitLabel = 'Enregistrer' }: SeanceFormProps) {
  const router = useRouter();
  const [date, setDate] = useState(
    initialValues?.date ?? new Date().toISOString().split('T')[0],
  );
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [blocs, setBlocs] = useState<BlocForm[]>(() =>
    initialValues?.parties?.length
      ? partiesToBlocs(initialValues.parties)
      : [newSingleBloc()],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBloc = (i: number, b: BlocForm) =>
    setBlocs((prev) => prev.map((x, idx) => (idx === i ? b : x)));

  const removeBloc = (i: number) =>
    setBlocs((prev) => prev.filter((_, idx) => idx !== i));

  const moveBloc = (i: number, direction: -1 | 1) => {
    const next = i + direction;
    if (next < 0 || next >= blocs.length) return;
    setBlocs((prev) => {
      const arr = [...prev];
      [arr[i], arr[next]] = [arr[next], arr[i]];
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onSubmit({
        date,
        ...(title && { title }),
        ...(notes && { notes }),
        parties: blocsToParties(blocs),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : AppErrors.GENERIC);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          label="Titre (optionnel)"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ex: Fractionné du jeudi"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="form-label">
          Parties
        </span>
        {blocs.map((b, i) => (
          <BlocRow
            key={b.tempId}
            bloc={b}
            index={i}
            total={blocs.length}
            onChange={(updated) => updateBloc(i, updated)}
            onRemove={() => removeBloc(i)}
            onMoveUp={() => moveBloc(i, -1)}
            onMoveDown={() => moveBloc(i, 1)}
          />
        ))}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setBlocs((prev) => [...prev, newSingleBloc()])}
          >
            + Partie simple
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setBlocs((prev) => [...prev, newRepeatBloc()])}
          >
            + Bloc répété
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="form-label">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border-[1.5px] border-[--color-border] bg-white px-3.5 py-2.5 text-sm text-[--color-text] placeholder-[--color-text-muted] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-[--color-accent] transition resize-none"
          placeholder="Ressenti, conditions, remarques…"
        />
      </div>

      {error && <p className="text-sm text-[--color-error]">{error}</p>}

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={() => (onCancel ? onCancel() : router.back())}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

