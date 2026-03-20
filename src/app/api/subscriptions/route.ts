import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const SubscriptionSchema = z.object({
  tier: z.string().min(1),
  priceMonthly: z.number().positive(),
  customerId: z.string().optional()
});

function getUserId(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  const cookieToken = request.cookies.get('token')?.value;
  const token = headerToken || cookieToken || null;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch (_error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const subscriptions = await db.subscription.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ success: true, data: subscriptions });
}

export async function POST(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = SubscriptionSchema.parse(body);
    const subscription = await db.subscription.create({ data });
    return NextResponse.json({ success: true, data: subscription });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to create subscription.' }, { status: 400 });
  }
}
