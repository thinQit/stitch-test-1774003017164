import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());
    const existing = await db.user.findUnique({ where: { email: body.email } });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User already exists.' },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(body.password);
    const user = await db.user.create({
      data: { name: body.name ?? null, email: body.email, password: hashed }
    });

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
      { success: false, error: 'Invalid registration request.' },
      { status: 400 }
    );
  }
}
