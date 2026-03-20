import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { signToken, verifyPassword, hashPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    let user = await db.user.findUnique({ where: { email: body.email } });

    if (!user) {
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword || adminPassword !== body.password) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
      const passwordHash = await hashPassword(body.password);
      user = await db.user.create({ data: { email: body.email, passwordHash } });
    }

    const isValid = await verifyPassword(body.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email });
    return NextResponse.json({ success: true, data: { token, userId: user.id, email: user.email } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
