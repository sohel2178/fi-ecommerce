'use client';

import { create } from 'zustand';
import type { User } from './types';

type AuthState = {
  /** Access token lives only in memory; the refresh token is an httpOnly cookie. */
  accessToken: string | null;
  user: User | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  setSession: (accessToken: string, user: User) => void;
  setUser: (user: User) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'loading',
  setSession: (accessToken, user) => set({ accessToken, user, status: 'authenticated' }),
  setUser: (user) => set({ user }),
  clear: () => set({ accessToken: null, user: null, status: 'anonymous' }),
}));
