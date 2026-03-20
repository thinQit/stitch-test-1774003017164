import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit') || 50);
    const offset = Number(request.nextUrl.searchParams.get('offset') || 0);
    const source = request.nextUrl.searchParams.get('source') || undefined;

    const leads = await db.lead.findMany({
      where: source ? { source } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json({ success: true, data: { leads } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load leads' }, { status: 500 });
  }
}
