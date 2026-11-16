import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('affiche le label fourni', () => {
    render(<Badge label="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applique la variante accent', () => {
    render(<Badge label="Info" variant="accent" />);
    expect(screen.getByText('Info')).toHaveClass('bg-[#FFF0ED]');
  });

  it('applique la variante par défaut', () => {
    render(<Badge label="Default" />);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});

