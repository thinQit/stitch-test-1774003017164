export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

function isProtectedRoute(pathname: string, method: string): boolean {
  if (pathname.startsWith('/api/leads')) return true;
  if (pathname.startsWith('/api/plans') && method !== 'GET') return true;
  if (pathname.startsWith('/api/features') && method !== 'GET') return true;
  return false;
}

export async function middleware(request: NextRequest) {
  if (!isProtectedRoute(request.nextUrl.pathname, request.method)) {
    return NextResponse.next();
  }

  const token =
    getTokenFromHeader(request.headers.get('authorization')) ||
    request.cookies.get('projectflow_token')?.value ||
    null;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/plans/:path*', '/api/leads/:path*', '/api/features/:path*']
};
