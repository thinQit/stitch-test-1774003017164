import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({
  tierId: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const { tierId } = schema.parse(await request.json());
    const tier = await db.pricingTier.findUnique({ where: { id: tierId } });
    if (!tier) {
      return NextResponse.json({ success: false, error: 'Tier not found' }, { status: 404 });
    }

    if (tier.isCustom) {
      return NextResponse.json({
        success: true,
        data: { message: 'Contact sales for enterprise onboarding.', contact: '/contact' }
      });
    }

    const sessionId = `cs_test_${Math.random().toString(36).slice(2)}`;
    const url = `https://checkout.stripe.com/pay/${sessionId}`;
    return NextResponse.json({ success: true, data: { sessionId, url } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
