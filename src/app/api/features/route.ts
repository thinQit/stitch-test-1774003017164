import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const featureSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().int().optional()
});

export async function GET(_request: NextRequest) {
  try {
    const features = await db.feature.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ success: true, data: { features } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load features' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = featureSchema.parse(body);

    const feature = await db.feature.create({
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle,
        icon: parsed.icon,
        order: parsed.order ?? 0
      }
    });

    return NextResponse.json({ success: true, data: { feature } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
