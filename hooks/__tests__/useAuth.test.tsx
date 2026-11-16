import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

jest.mock('@/lib/api');
jest.mock('@/lib/auth', () => ({
  hasTokens: jest.fn().mockReturnValue(false),
  getAccessToken: jest.fn().mockReturnValue(null),
  getRefreshToken: jest.fn().mockReturnValue(null),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  afterEach(() => jest.clearAllMocks());

  it('isLoading passe à false après l\'initialisation sans token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.isLoading).toBe(false);
  });

  it('user est null quand aucun token n\'est en localStorage', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.user).toBeNull();
  });

  it('login met à jour user après connexion réussie', async () => {
    const mockUser = {
      id: '1',
      email: 'a@b.com',
      firstName: 'Jean',
      lastName: 'D',
      createdAt: '',
      updatedAt: '',
    };
    jest
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: { accessToken: 'at', refreshToken: 'rt' }, error: null });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: mockUser, error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    await act(() => result.current.login({ email: 'a@b.com', password: 'pass' }));
    expect(result.current.user).toMatchObject(mockUser);
  });

  it('login retourne un message d\'erreur en cas d\'échec', async () => {
    jest
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: null, error: 'Email ou mot de passe incorrect' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    let error: string | null = null;
    await act(async () => {
      error = await result.current.login({ email: 'a@b.com', password: 'wrong' });
    });
    expect(error).toBe('Email ou mot de passe incorrect');
  });

  it('logout efface l\'utilisateur courant', async () => {
    jest
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: null, error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    await act(() => result.current.logout());
    expect(result.current.user).toBeNull();
  });
});
