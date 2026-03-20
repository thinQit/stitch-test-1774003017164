import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const subscriberSchema = z.object({
  email: z.string().email()
});

function getUserIdFromRequest(request: NextRequest): string | null {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (payload && typeof payload === 'object' && 'userId' in payload && typeof payload.userId === 'string') {
      return payload.userId;
    }
    return null;
  } catch {
    return null;
  }
}

function parseNumber(value: string | null, fallback: number): number {
  const parsed = value ? Number(value) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseNumber(searchParams.get('limit'), 50);
  const offset = parseNumber(searchParams.get('offset'), 0);

  const subscribers = await db.subscriber.findMany({ skip: offset, take: limit });
  const data = subscribers.map((subscriber) => ({
    id: subscriber.id,
    email: subscriber.email,
    created_at: subscriber.created_at.toISOString()
  }));
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  try {
    const body = subscriberSchema.parse(await request.json());
    const existing = await db.subscriber.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Subscriber already exists' }, { status: 409 });
    }
    const subscriber = await db.subscriber.create({ data: { email: body.email } });
    return NextResponse.json(
      {
        success: true,
        data: { id: subscriber.id, email: subscriber.email, created_at: subscriber.created_at.toISOString() }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
