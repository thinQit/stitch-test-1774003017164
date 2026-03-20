import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/admin';
import { hashPassword } from '@/lib/auth';

const schema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  password: z.string().min(6).optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const user = await db.adminUser.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 401;
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const data = schema.parse(await request.json());
    const existing = await db.adminUser.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const passwordHash = data.password ? await hashPassword(data.password) : undefined;
    const user = await db.adminUser.update({
      where: { id: params.id },
      data: {
        name: data.name ?? undefined,
        role: data.role ?? undefined,
        passwordHash
      }
    });
    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const existing = await db.adminUser.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    await db.adminUser.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
