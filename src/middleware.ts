export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

function extractToken(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  const cookieToken = request.cookies.get('token')?.value;
  return headerToken || cookieToken || null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith('/dashboard');
  const isProtectedApi = pathname.startsWith('/api/projects');

  if (!isDashboard && !isProtectedApi) return NextResponse.next();

  const token = extractToken(request);
  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (_error) {
    if (isProtectedApi) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/projects/:path*']
};
