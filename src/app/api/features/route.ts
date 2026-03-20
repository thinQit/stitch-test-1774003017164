import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  highlightColor: z.string().min(1)
});

export async function GET(_request: NextRequest) {
  try {
    const features = await db.feature.findMany();
    return NextResponse.json({ success: true, data: { features } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch features' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const feature = await db.feature.create({ data: parsed });

    return NextResponse.json({ success: true, data: feature }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to create feature' }, { status: 400 });
  }
}
