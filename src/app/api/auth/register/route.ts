import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const existing = await db.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.password);
    const user = await db.user.create({
      data: {
        email: parsed.email,
        name: parsed.name,
        passwordHash,
        role: 'admin'
      }
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
    });
    response.cookies.set('projectflow_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
    return response;
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
