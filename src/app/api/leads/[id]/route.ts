import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await db.lead.findUnique({ where: { id: params.id } });
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { lead } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load lead' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete lead' }, { status: 400 });
  }
}
