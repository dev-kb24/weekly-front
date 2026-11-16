'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SeanceForm } from '@/components/forms/SeanceForm';
import { SeanceDayCard } from '@/components/shared/SeanceDayCard';
import { formatSeanceDate } from '@/lib/week';
import type { CreateSeancePayload } from '@/interfaces/CreateSeancePayload';
import type { Seance } from '@/interfaces/Seance';
import { useSeances } from '@/hooks/useSeances';

export default function SeanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchOne, update, remove } = useSeances();
  const [seance, setSeance] = useState<Seance | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOne(id).then(setSeance);
  }, [id, fetchOne]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const ok = await remove(id);
    if (ok) router.push('/dashboard');
    setIsDeleting(false);
  };

  const handleEditSubmit = async (payload: CreateSeancePayload) => {
    const updated = await update(id, payload);
    if (updated) {
      setSeance(updated);
      setIsEditOpen(false);
    }
  };

  if (!seance) {
    return <p className="text-center text-gray-400 text-sm py-10">Chargement…</p>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← Retour
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            disabled={isDeleting}
          >
            Supprimer
          </Button>
        </div>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-3">
        {seance.title ?? formatSeanceDate(seance.date)}
      </h1>

      <SeanceDayCard seance={seance} hideDetailLink hideTitle showPartieOrder />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la séance"
        message="Cette action est irréversible. La séance sera définitivement supprimée."
        confirmLabel="Supprimer"
        variant="danger"
      />

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modifier la séance"
      >
        <SeanceForm
          initialValues={{
            date: seance.date,
            title: seance.title ?? undefined,
            notes: seance.notes ?? undefined,
            parties: seance.parties,
          }}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          submitLabel="Enregistrer les modifications"
        />
      </Modal>
    </div>
  );
}

