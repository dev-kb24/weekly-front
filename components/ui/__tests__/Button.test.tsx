import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('rend correctement avec les props par défaut', () => {
    render(<Button>Cliquer</Button>);
    expect(screen.getByRole('button', { name: 'Cliquer' })).toBeInTheDocument();
  });

  it('est désactivé quand la prop disabled est true', () => {
    render(<Button disabled>Cliquer</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('appelle onClick quand cliqué', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ne déclenche pas onClick quand disabled', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Cliquer</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applique la classe du variant danger', () => {
    render(<Button variant="danger">Supprimer</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('applique la classe du variant secondary', () => {
    render(<Button variant="secondary">Annuler</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-surface');
  });
});
