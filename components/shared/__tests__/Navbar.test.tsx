import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '@/components/shared/Navbar';

const mockLogout = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      createdAt: '',
      updatedAt: '',
    },
    logout: mockLogout,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Navbar', () => {
  afterEach(() => jest.clearAllMocks());

  it('affiche le nom de l\'application', () => {
    render(<Navbar />);
    expect(screen.getByText('WeeklyFit')).toBeInTheDocument();
  });

  it('affiche le prénom et le nom de l\'utilisateur', () => {
    render(<Navbar />);
    expect(screen.getAllByText('Jean Dupont').length).toBeGreaterThan(0);
  });

  it('appelle logout et redirige vers /login au clic sur Déconnexion', async () => {
    mockLogout.mockResolvedValueOnce(undefined);
    render(<Navbar />);
    const buttons = screen.getAllByRole('button', { name: 'Déconnexion' });
    await userEvent.click(buttons[0]);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
