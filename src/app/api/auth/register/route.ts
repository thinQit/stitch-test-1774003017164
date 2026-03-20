import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const existing = await db.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.password);
    const user = await db.user.create({
      data: {
        email: parsed.email,
        name: parsed.name,
        passwordHash
      }
    });

    const token = signToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt.toISOString()
        }
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to register user' }, { status: 400 });
  }
}
