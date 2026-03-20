import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

function extractUserId(request: NextRequest): string | null {
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
  const userId = extractUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthenticated.' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, subscriptionId: true }
  });

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: user });
}
