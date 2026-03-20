import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = SignUpSchema.parse(body);

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash
      }
    });

    const token = signToken({ userId: user.id });
    const response = NextResponse.json({ success: true, data: { userId: user.id } });
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return response;
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to sign up.' }, { status: 400 });
  }
}
