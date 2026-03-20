import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  highlightColor: z.string().min(1).optional()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const feature = await db.feature.findUnique({ where: { id: params.id } });
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: feature });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch feature' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const feature = await db.feature.update({
      where: { id: params.id },
      data: parsed
    });

    return NextResponse.json({ success: true, data: feature });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update feature' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.feature.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete feature' }, { status: 400 });
  }
}
