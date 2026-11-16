import { render } from '@testing-library/react';
import { HomeRedirect } from '@/components/shared/HomeRedirect';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('HomeRedirect', () => {
  afterEach(() => jest.clearAllMocks());

  it('affiche un overlay pendant le chargement', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });
    const { container } = render(<HomeRedirect />);
    expect(container.firstChild).not.toBeNull();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('ne redirige pas si isLoading est false et user est null', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    const { container } = render(<HomeRedirect />);
    expect(container.firstChild).toBeNull();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirige vers /dashboard si user est défini et chargement terminé', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'a@b.com', firstName: 'Jean', lastName: 'D', createdAt: '', updatedAt: '' },
      isLoading: false,
    });
    render(<HomeRedirect />);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('ne redirige pas si user est défini mais isLoading est encore true', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'a@b.com', firstName: 'Jean', lastName: 'D', createdAt: '', updatedAt: '' },
      isLoading: true,
    });
    render(<HomeRedirect />);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
