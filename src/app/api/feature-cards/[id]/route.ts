import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().min(1).optional()
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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const feature = await db.featureCard.findUnique({ where: { id: params.id } });
  if (!feature) {
    return NextResponse.json({ success: false, error: 'Feature card not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: feature });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = UpdateSchema.parse(body);
    const feature = await db.featureCard.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: feature });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update feature card.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await db.featureCard.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete feature card.' }, { status: 400 });
  }
}
