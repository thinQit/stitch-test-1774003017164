import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const FeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1)
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

export async function GET() {
  const features = await db.featureCard.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ success: true, data: features });
}

export async function POST(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = FeatureSchema.parse(body);
    const feature = await db.featureCard.create({ data });
    return NextResponse.json({ success: true, data: feature });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to create feature card.' }, { status: 400 });
  }
}
