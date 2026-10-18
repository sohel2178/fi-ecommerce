import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_INTERNAL_URL, REFRESH_COOKIE } from './config';
import type { Role, User } from './types';

/** Reads the session user on the server from the refresh cookie, without rotating it. */
export async function getSessionUser(): Promise<User | null> {
  const token = cookies().get(REFRESH_COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_INTERNAL_URL}/auth/session`, {
      headers: { Cookie: `${REFRESH_COOKIE}=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return ((await res.json()) as { user: User }).user;
  } catch {
    return null;
  }
}

/**
 * Route guard for server layouts. Redirects to /login (with ?next=) when logged out, and home
 * when the role is not allowed. This is UX only; the API enforces access on every request.
 */
export async function requireUser(roles?: Role[]): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    const path = headers().get('x-pathname') ?? '/';
    redirect(`/login?next=${encodeURIComponent(path)}`);
  }
  if (roles && !roles.includes(user.role)) redirect('/');
  return user;
}
