import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  email: z.string().email().optional(),
  planInterest: z.string().optional()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriber = await db.subscriber.findUnique({ where: { id: params.id } });
    if (!subscriber) {
      return NextResponse.json({ success: false, error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: subscriber.id,
        email: subscriber.email,
        planInterest: subscriber.planInterest ?? undefined,
        createdAt: subscriber.createdAt.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch subscriber' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const subscriber = await db.subscriber.update({
      where: { id: params.id },
      data: parsed
    });

    return NextResponse.json({
      success: true,
      data: {
        id: subscriber.id,
        email: subscriber.email,
        planInterest: subscriber.planInterest ?? undefined,
        createdAt: subscriber.createdAt.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update subscriber' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.subscriber.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete subscriber' }, { status: 400 });
  }
}
