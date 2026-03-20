import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: body.email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(body.password, user.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const token = signToken({ id: user.id, email: user.email });
    const response = NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, token }
    });

    response.cookies.set('pf_admin', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return response;
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Invalid login request.' },
      { status: 400 }
    );
  }
}
