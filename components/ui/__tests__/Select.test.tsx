import { render, screen } from '@testing-library/react';
import { Select } from '@/components/ui/Select';

const OPTIONS = [
  { value: 'running', label: 'Course à pied' },
  { value: 'cycling', label: 'Cyclisme' },
];

describe('Select', () => {
  it('affiche le label fourni', () => {
    render(<Select label="Sport" options={OPTIONS} />);
    expect(screen.getByText('Sport')).toBeInTheDocument();
  });

  it('associe le label au select via htmlFor/id', () => {
    render(<Select label="Sport" options={OPTIONS} />);
    expect(screen.getByLabelText('Sport')).toBeInTheDocument();
  });

  it('affiche toutes les options', () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Course à pied' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cyclisme' })).toBeInTheDocument();
  });

  it('affiche le placeholder en première option quand fourni', () => {
    render(<Select options={OPTIONS} placeholder="— Choisir —" />);
    expect(screen.getByRole('option', { name: '— Choisir —' })).toBeInTheDocument();
  });

  it('affiche le message d\'erreur quand fourni', () => {
    render(<Select options={OPTIONS} error="Veuillez choisir un sport" />);
    expect(screen.getByText('Veuillez choisir un sport')).toBeVisible();
  });
});
