'use client';

import { API_URL } from './config';
import { useAuth } from './auth-store';
import type { User } from './types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
  }
}

type Options = { method?: string; body?: unknown; auth?: boolean };

let refreshing: Promise<boolean> | null = null;

/**
 * Exchanges the refresh cookie for a new access token. Single-flight: concurrent callers share
 * one request, because each refresh token works only once.
 */
export function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
      if (!res.ok) {
        useAuth.getState().clear();
        return false;
      }
      const data = (await res.json()) as { accessToken: string; user: User };
      useAuth.getState().setSession(data.accessToken, data.user);
      return true;
    } catch {
      useAuth.getState().clear();
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

async function send(path: string, { method = 'GET', body }: Options): Promise<Response> {
  const token = useAuth.getState().accessToken;
  return fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/** JSON API client. On a 401 it refreshes the session once and retries. */
export async function api<T>(path: string, options: Options = {}): Promise<T> {
  let res = await send(path, options);
  if (res.status === 401 && options.auth !== false && (await refreshSession())) {
    res = await send(path, options);
  }
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = data?.error ?? {};
    throw new ApiError(res.status, e.code ?? 'ERROR', e.message ?? 'Request failed', e.details);
  }
  return data as T;
}

export async function logout(): Promise<void> {
  await api('/auth/logout', { method: 'POST', auth: false }).catch(() => undefined);
  useAuth.getState().clear();
}
