import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, hashPassword, verifyToken } from '@/lib/auth';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(6),
  role: z.string().optional(),
  subscriptionId: z.string().optional()
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

export async function GET(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, subscriptionId: true, createdAt: true, updatedAt: true }
  });
  return NextResponse.json({ success: true, data: users });
}

export async function POST(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = UserSchema.parse(body);

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: data.role,
        subscriptionId: data.subscriptionId
      },
      select: { id: true, email: true, name: true, role: true, subscriptionId: true }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to create user.' }, { status: 400 });
  }
}
