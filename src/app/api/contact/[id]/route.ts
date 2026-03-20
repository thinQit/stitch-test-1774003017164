import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  message: z.string().min(1).optional()
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

  const message = await db.contactMessage.findUnique({ where: { id: params.id } });
  if (!message) {
    return NextResponse.json({ success: false, error: 'Contact message not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: message.id,
      name: message.name,
      email: message.email,
      message: message.message,
      received_at: message.received_at.toISOString()
    }
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const existing = await db.contactMessage.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contact message not found' }, { status: 404 });
    }

    const message = await db.contactMessage.update({
      where: { id: params.id },
      data: {
        name: body.name ?? existing.name,
        email: body.email ?? existing.email,
        message: body.message ?? existing.message
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
        received_at: message.received_at.toISOString()
      }
    });
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

  const existing = await db.contactMessage.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Contact message not found' }, { status: 404 });
  }

  await db.contactMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, data: null });
}
