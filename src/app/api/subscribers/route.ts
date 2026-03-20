import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  email: z.string().email(),
  planInterest: z.string().optional()
});

export async function GET(_request: NextRequest) {
  try {
    const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
    const mapped = subscribers.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email,
      planInterest: subscriber.planInterest ?? undefined,
      createdAt: subscriber.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, data: { subscribers: mapped } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const subscriber = await db.subscriber.create({ data: parsed });

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
    return NextResponse.json({ success: false, error: 'Unable to create subscriber' }, { status: 400 });
  }
}
