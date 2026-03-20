import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/admin';

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  icon: z.string().min(1).optional()
});

export async function GET(_request: NextRequest) {
  try {
    const features = await db.feature.findMany();
    return NextResponse.json({ success: true, data: features });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load features';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    assertAdmin(request);
    const data = schema.parse(await request.json());
    const feature = await db.feature.create({
      data: {
        id: data.id,
        title: data.title ?? null,
        summary: data.summary ?? null,
        icon: data.icon ?? null
      }
    });
    return NextResponse.json({ success: true, data: feature }, { status: 201 });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
