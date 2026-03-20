import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, hashPassword, verifyToken } from '@/lib/auth';

const UpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { id: params.id },
    select: { id: true, email: true, name: true, role: true, subscriptionId: true, createdAt: true, updatedAt: true }
  });
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: user });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = UpdateSchema.parse(body);
    const updateData: {
      email?: string;
      name?: string;
      passwordHash?: string;
      role?: string;
      subscriptionId?: string;
    } = {
      email: data.email,
      name: data.name,
      role: data.role,
      subscriptionId: data.subscriptionId
    };

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const user = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, subscriptionId: true }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update user.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await db.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete user.' }, { status: 400 });
  }
}
