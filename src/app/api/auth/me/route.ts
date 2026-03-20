import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token =
    getTokenFromHeader(request.headers.get('authorization')) ||
    request.cookies.get('projectflow_token')?.value ||
    null;

  if (!token) {
    return NextResponse.json({ success: true, data: { user: null } });
  }

  try {
    const decoded = verifyToken(token) as { userId?: string };
    if (!decoded.userId) {
      return NextResponse.json({ success: true, data: { user: null } });
    }

    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ success: true, data: { user: null } });
    }

    return NextResponse.json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } }
    });
  } catch (_error) {
    return NextResponse.json({ success: true, data: { user: null } });
  }
}
