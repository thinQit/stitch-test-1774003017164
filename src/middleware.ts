import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/features') && request.method === 'GET') {
    return NextResponse.next();
  }

  const token = getTokenFromHeader(request.headers.get('authorization'));
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
  matcher: [
    '/api/subscribers/:path*',
    '/api/enterprise-contacts/:path*',
    '/api/pricing-tiers/:path*',
    '/api/features/:path*'
  ]
};
