import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());
    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 409 });
    }
    const passwordHash = await hashPassword(body.password);
    const user = await db.user.create({ data: { email: body.email, passwordHash } });
    const token = signToken({ userId: user.id, email: user.email });
    return NextResponse.json(
      { success: true, data: { token, userId: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
