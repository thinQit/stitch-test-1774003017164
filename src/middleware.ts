export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getAllowedOrigins(): string[] {
  const value = process.env.CORS_ALLOWED_ORIGINS;
  if (!value) return [];
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}
