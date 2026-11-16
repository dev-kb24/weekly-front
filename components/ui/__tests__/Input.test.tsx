import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('affiche le label fourni', () => {
    render(<Input label="Adresse e-mail" />);
    expect(screen.getByText('Adresse e-mail')).toBeInTheDocument();
  });

  it('associe le label à l\'input via htmlFor/id', () => {
    render(<Input label="Adresse e-mail" />);
    const input = screen.getByLabelText('Adresse e-mail');
    expect(input).toBeInTheDocument();
  });

  it('affiche le message d\'erreur quand fourni', () => {
    render(<Input error="Champ requis" />);
    expect(screen.getByText('Champ requis')).toBeVisible();
  });

  it('appelle onChange quand la valeur change', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('n\'affiche pas de message d\'erreur quand la prop error est absente', () => {
    render(<Input label="Nom" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
