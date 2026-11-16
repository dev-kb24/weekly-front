import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '@/components/forms/RegisterForm';

const mockRegister = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ register: mockRegister }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('RegisterForm', () => {
  afterEach(() => jest.clearAllMocks());

  it('affiche tous les champs requis', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse e-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('appelle register avec les valeurs saisies', async () => {
    mockRegister.mockResolvedValueOnce(null);
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText('Prénom'), 'Jean');
    await userEvent.type(screen.getByLabelText('Nom'), 'Dupont');
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'jean@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));
    expect(mockRegister).toHaveBeenCalledWith({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      password: 'password123',
    });
  });

  it('redirige vers /dashboard après inscription réussie', async () => {
    mockRegister.mockResolvedValueOnce(null);
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText('Prénom'), 'Jean');
    await userEvent.type(screen.getByLabelText('Nom'), 'Dupont');
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'jean@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('affiche le message d\'erreur en cas d\'échec', async () => {
    mockRegister.mockResolvedValueOnce('Email déjà utilisé');
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText('Prénom'), 'Jean');
    await userEvent.type(screen.getByLabelText('Nom'), 'Dupont');
    await userEvent.type(screen.getByLabelText('Adresse e-mail'), 'jean@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));
    expect(screen.getByText('Email déjà utilisé')).toBeVisible();
  });
});
