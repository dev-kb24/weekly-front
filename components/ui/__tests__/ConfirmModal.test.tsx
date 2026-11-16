import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

describe('ConfirmModal', () => {
  it('affiche le titre et le message', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Supprimer ?"
        message="Cette action est irréversible."
      />,
    );
    expect(screen.getByText('Supprimer ?')).toBeInTheDocument();
    expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument();
  });

  it('appelle onClose et onConfirm au clic sur Confirmer', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Supprimer ?"
        message="Message"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('appelle seulement onClose au clic sur Annuler', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Supprimer ?"
        message="Message"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('affiche le label personnalisé du bouton de confirmation', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Test"
        message="Message"
        confirmLabel="Supprimer définitivement"
      />,
    );
    expect(screen.getByRole('button', { name: 'Supprimer définitivement' })).toBeInTheDocument();
  });

  it('applique le style danger au bouton de confirmation', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Test"
        message="Message"
        variant="danger"
        confirmLabel="Supprimer"
      />,
    );
    const btn = screen.getByRole('button', { name: 'Supprimer' });
    expect(btn.className).toMatch(/red/);
  });

  it('ne rend rien quand isOpen est false', () => {
    render(
      <ConfirmModal
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Test"
        message="Message"
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
