import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const detailed = request.nextUrl.searchParams.get('detailed') === 'true';
  const data: { status: string; uptimeSeconds?: number; version?: string } = { status: 'ok' };

  if (detailed) {
    data.uptimeSeconds = Math.floor(process.uptime());
    data.version = process.env.NEXT_PUBLIC_SITE_URL || 'local';
  }

  return NextResponse.json({ success: true, data });
}
