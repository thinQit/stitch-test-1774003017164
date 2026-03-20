import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/admin';

const schema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  icon: z.string().min(1).optional()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const feature = await db.feature.findUnique({ where: { id: params.id } });
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: feature });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load feature';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const data = schema.parse(await request.json());
    const existing = await db.feature.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    const feature = await db.feature.update({
      where: { id: params.id },
      data: {
        title: data.title ?? undefined,
        summary: data.summary ?? undefined,
        icon: data.icon ?? undefined
      }
    });
    return NextResponse.json({ success: true, data: feature });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const existing = await db.feature.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    await db.feature.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
