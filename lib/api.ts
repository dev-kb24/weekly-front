import { API_URL } from '@/lib/constants';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/auth';
import type { TokenPair } from '@/interfaces/TokenPair';
import { AppErrors } from '@/lib/errors';

export type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

interface ErrorResponse {
  message?: string;
  statusCode?: number;
  status?: string;
}

/** Shape of the generic ApiResponse wrapper returned by the NestJS backend. */
interface BackendEnvelope<T> {
  statusCode: number;
  status: 'success' | 'failed';
  data: T;
}

function unwrap<T>(json: unknown): T {
  if (
    typeof json === 'object' &&
    json !== null &&
    'status' in json &&
    (json as Record<string, unknown>).status === 'success' &&
    'data' in json
  ) {
    return (json as BackendEnvelope<T>).data;
  }
  return json as T;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const tokens = (await res.json()) as TokenPair;
    setTokens(tokens);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<ApiResult<T>> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401 && retry && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) return request<T>(path, options, false);
      return { data: null, error: AppErrors.SESSION_EXPIRED };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as ErrorResponse;
      return { data: null, error: AppErrors.translate(body.message ?? `Erreur ${res.status}`) };
    }

    if (res.status === 204) return { data: null as unknown as T, error: null };

    const json = await res.json();
    return { data: unwrap<T>(json), error: null };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    return { data: null, error: AppErrors.NETWORK_ERROR };
  }
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
