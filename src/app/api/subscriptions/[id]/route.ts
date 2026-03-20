import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const UpdateSchema = z.object({
  tier: z.string().min(1).optional(),
  priceMonthly: z.number().positive().optional(),
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const subscription = await db.subscription.findUnique({ where: { id: params.id } });
  if (!subscription) {
    return NextResponse.json({ success: false, error: 'Subscription not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: subscription });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = UpdateSchema.parse(body);
    const subscription = await db.subscription.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: subscription });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update subscription.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await db.subscription.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete subscription.' }, { status: 400 });
  }
}
