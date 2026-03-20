import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const data = schema.parse(await request.json());
    const existing = await db.adminUser.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db.adminUser.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        role: 'admin',
        passwordHash
      }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
