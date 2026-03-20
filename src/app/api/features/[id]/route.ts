import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const updateSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().optional()
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const feature = await db.feature.update({
      where: { id: params.id },
      data: parsed
    });

    return NextResponse.json({ success: true, data: { feature } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update feature' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.feature.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete feature' }, { status: 400 });
  }
}
