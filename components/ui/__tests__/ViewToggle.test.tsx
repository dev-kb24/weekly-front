import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViewToggle } from '@/components/ui/ViewToggle';

describe('ViewToggle', () => {
  it('affiche les boutons Semaine et Jour', () => {
    render(<ViewToggle current="week" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Semaine' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jour' })).toBeInTheDocument();
  });

  it('applique le style actif sur le bouton Semaine quand current="week"', () => {
    render(<ViewToggle current="week" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Semaine' })).toHaveClass('bg-accent');
    expect(screen.getByRole('button', { name: 'Jour' })).not.toHaveClass('bg-accent');
  });

  it('applique le style actif sur le bouton Jour quand current="day"', () => {
    render(<ViewToggle current="day" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Jour' })).toHaveClass('bg-accent');
    expect(screen.getByRole('button', { name: 'Semaine' })).not.toHaveClass('bg-accent');
  });

  it('appelle onChange avec "day" quand on clique sur Jour', async () => {
    const handleChange = jest.fn();
    render(<ViewToggle current="week" onChange={handleChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Jour' }));
    expect(handleChange).toHaveBeenCalledWith('day');
  });

  it('appelle onChange avec "week" quand on clique sur Semaine', async () => {
    const handleChange = jest.fn();
    render(<ViewToggle current="day" onChange={handleChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Semaine' }));
    expect(handleChange).toHaveBeenCalledWith('week');
  });
});
