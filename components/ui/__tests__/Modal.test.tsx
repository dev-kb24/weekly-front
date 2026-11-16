import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
  it('ne rend rien quand isOpen est false', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Test">
        <p>Contenu</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('affiche le contenu et le titre quand isOpen est true', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Mon titre">
        <p>Contenu modal</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Mon titre')).toBeInTheDocument();
    expect(screen.getByText('Contenu modal')).toBeInTheDocument();
  });

  it('appelle onClose au clic sur le bouton Fermer', async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenu</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('appelle onClose au clic sur le backdrop', async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenu</p>
      </Modal>,
    );
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('appelle onClose à la pression de la touche Échap', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenu</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onClose si une autre touche est pressée", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenu</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
