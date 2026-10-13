import type { NextRequest, NextResponse } from 'next/server';
import { SESSION_DAYS } from './auth';

// Server-set, httpOnly backup of the session token. localStorage alone is fragile:
// Safari wipes script-writable storage after 7 days without a visit (ITP), which
// silently logged clients out. Cookies set by the server via Set-Cookie aren't
// subject to that cap, so /api/auth/me can restore the token from here.
export const SESSION_COOKIE = 'ch_session';
// Readable (non-httpOnly) marker so the UI knows a session exists without a request.
export const SESSION_MARKER = 'ch_auth';

const maxAge = SESSION_DAYS * 24 * 60 * 60;

export function setSessionCookie(res: NextResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge });
  res.cookies.set(SESSION_MARKER, '1', { httpOnly: false, secure, sameSite: 'lax', path: '/', maxAge });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(SESSION_MARKER, '', { path: '/', maxAge: 0 });
}

export function readSessionCookie(req: NextRequest): string | null {
  return req.cookies.get(SESSION_COOKIE)?.value || null;
}
