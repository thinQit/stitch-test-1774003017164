import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  email: z.string().email(),
  planInterest: z.string().optional(),
  source: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const existing = await db.subscriber.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'You are already subscribed.',
          subscriberId: existing.id
        }
      });
    }

    const subscriber = await db.subscriber.create({
      data: {
        email: parsed.email,
        planInterest: parsed.planInterest
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Thanks for signing up!',
        subscriberId: subscriber.id
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to process subscription' }, { status: 400 });
  }
}
