import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = SignInSchema.parse(body);

    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = signToken({ userId: user.id });
    const response = NextResponse.json({ success: true, data: { token } });
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return response;
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to sign in.' }, { status: 400 });
  }
}
