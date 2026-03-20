import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    z.object({}).parse({});
    const headerToken = getTokenFromHeader(request.headers.get('authorization'));
    const cookieToken = request.cookies.get('pf_admin')?.value;
    const token = headerToken ?? cookieToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const userId = typeof payload === 'object' && payload && 'id' in payload ? String(payload.id) : null;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized.' },
      { status: 401 }
    );
  }
}
