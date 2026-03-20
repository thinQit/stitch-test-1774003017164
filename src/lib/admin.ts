import { NextRequest } from 'next/server';
import { getTokenFromHeader, verifyToken } from './auth';

export function assertAdmin(request: NextRequest): void {
  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = request.headers.get('authorization');
  const bearerToken = getTokenFromHeader(authHeader);
  const headerToken = request.headers.get('x-admin-token');

  if (adminToken && (bearerToken === adminToken || headerToken === adminToken)) {
    return;
  }

  if (bearerToken) {
    try {
      const payload = verifyToken(bearerToken);
      if (payload && payload.role === 'admin') {
        return;
      }
    } catch (_error) {
      // fallthrough to unauthorized
    }
  }

  const error = new Error('Unauthorized');
  (error as Error & { status?: number }).status = 401;
  throw error;
}
