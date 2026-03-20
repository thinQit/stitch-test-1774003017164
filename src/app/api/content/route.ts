import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const contentSchema = z.object({
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

export async function GET(_request: NextRequest) {
  const content = await db.siteContent.findFirst();
  if (!content) {
    return NextResponse.json({
      success: true,
      data: {
        id: null,
        hero_title: null,
        hero_subtitle: null,
        footer_text: null
      }
    });
  }
  return NextResponse.json({ success: true, data: content });
}

export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = contentSchema.parse(await request.json());
    const existing = await db.siteContent.findFirst();
    const content = existing
      ? await db.siteContent.update({ where: { id: existing.id }, data: body })
      : await db.siteContent.create({ data: body });

    return NextResponse.json({ success: true, data: content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
