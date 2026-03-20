import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const verbose = request.nextUrl.searchParams.get('verbose') === 'true';
  const data = {
    status: 'ok',
    uptime: Number(process.uptime().toFixed(2)),
    ...(verbose ? { environment: process.env.NODE_ENV ?? 'development' } : {})
  };
  return NextResponse.json({ success: true, data });
}
