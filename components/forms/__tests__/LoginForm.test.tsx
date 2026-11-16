import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/forms/LoginForm';

const mockLogin = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('LoginForm', () => {
  afterEach(() => jest.clearAllMocks());

  it('affiche les champs email et mot de passe', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Adresse e-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('affiche le bouton de soumission', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  it('appelle login avec les valeurs saisies', async () => {
    mockLogin.mockResolvedValueOnce(null);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('redirige vers /dashboard après connexion réussie', async () => {
    mockLogin.mockResolvedValueOnce(null);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('affiche le message d\'erreur en cas d\'échec de connexion', async () => {
    mockLogin.mockResolvedValueOnce('Email ou mot de passe incorrect');
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'bad@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(screen.getByText('Email ou mot de passe incorrect')).toBeVisible();
  });

  it('ne redirige pas après un échec de connexion', async () => {
    mockLogin.mockResolvedValueOnce('Erreur réseau');
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(mockPush).not.toHaveBeenCalled();
  });
});
