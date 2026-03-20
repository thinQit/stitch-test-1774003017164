import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  description: z.string().min(1).optional()
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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const feature = await db.feature.findUnique({ where: { id: params.id } });
  if (!feature) {
    return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: feature });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const existing = await db.feature.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    const feature = await db.feature.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: feature });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await db.feature.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
  }

  await db.feature.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, data: null });
}
