import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Sessions are long-lived and sliding: /api/auth/me re-issues a fresh token once the
// current one is a day old, so anyone who opens the app at least once a year never
// has to log in again. Logout is explicit (POST /api/auth/logout).
export const SESSION_DAYS = 365;
const REFRESH_AFTER_SECONDS = 24 * 60 * 60;

export function generateToken(userId: number, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: `${SESSION_DAYS}d` }
  );
}

/** True when a verified token is old enough that the client should get a fresh one. */
export function tokenNeedsRefresh(decoded: { iat?: number } | null): boolean {
  if (!decoded?.iat) return true;
  return Date.now() / 1000 - decoded.iat > REFRESH_AFTER_SECONDS;
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
