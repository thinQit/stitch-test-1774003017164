import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    assertAdmin(request);
    const leads = await db.lead.findMany({ orderBy: { createdAt: 'desc' } });
    const data = leads.map((lead) => ({
      ...lead,
      createdAt: lead.createdAt.toISOString()
    }));
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 401;
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
