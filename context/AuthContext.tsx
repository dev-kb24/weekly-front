'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '@/lib/api';
import { clearTokens, hasTokens, setTokens } from '@/lib/auth';
import type { LoginPayload } from '@/interfaces/LoginPayload';
import type { RegisterPayload } from '@/interfaces/RegisterPayload';
import type { TokenPair } from '@/interfaces/TokenPair';
import type { User } from '@/interfaces/User';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<string | null>;
  register: (payload: RegisterPayload) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (!hasTokens()) {
      setIsLoading(false);
      return;
    }
    const result = await api.get<User>('/users/me');
    setUser(result.error ? null : result.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (payload: LoginPayload): Promise<string | null> => {
    const loginResult = await api.post<TokenPair>('/auth/login', payload);
    if (loginResult.error !== null) return loginResult.error;
    setTokens(loginResult.data);
    const meResult = await api.get<User>('/users/me');
    if (meResult.error !== null) return meResult.error;
    setUser(meResult.data);
    return null;
  };

  const register = async (payload: RegisterPayload): Promise<string | null> => {
    const registerResult = await api.post<User>('/auth/register', payload);
    if (registerResult.error !== null) return registerResult.error;
    return login({ email: payload.email, password: payload.password });
  };

  const logout = async (): Promise<void> => {
    await api.post('/auth/logout', {});
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
