import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/admin';
import { hashPassword } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.string().optional(),
  password: z.string().min(6).optional()
});

export async function GET(request: NextRequest) {
  try {
    assertAdmin(request);
    const users = await db.adminUser.findMany();
    const data = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }));
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 401;
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    assertAdmin(request);
    const data = schema.parse(await request.json());
    const existing = await db.adminUser.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 });
    }
    const passwordHash = data.password ? await hashPassword(data.password) : null;
    const user = await db.adminUser.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        role: data.role ?? 'admin',
        passwordHash
      }
    });
    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, { status: 201 });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
