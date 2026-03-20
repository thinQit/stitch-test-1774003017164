import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  footer_text: z.string().optional()
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const content = await db.siteContent.findUnique({ where: { id: params.id } });
  if (!content) {
    return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: content });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const existing = await db.siteContent.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 });
    }

    const content = await db.siteContent.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: content });
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

  const existing = await db.siteContent.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 });
  }

  await db.siteContent.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, data: null });
}
