import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
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

  const messages = await db.contactMessage.findMany({ skip: offset, take: limit });
  const data = messages.map((message) => ({
    id: message.id,
    name: message.name,
    email: message.email,
    message: message.message,
    received_at: message.received_at.toISOString()
  }));

  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  try {
    const body = contactSchema.parse(await request.json());
    const message = await db.contactMessage.create({ data: body });
    return NextResponse.json({ success: true, data: { status: 'received', id: message.id } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
