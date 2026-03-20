import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const subscribeSchema = z.object({
  planId: z.string().min(1),
  customerEmail: z.string().email(),
  returnUrl: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = subscribeSchema.parse(await request.json());
    const plan = await db.subscriptionPlan.findUnique({ where: { id: body.planId } });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found.' },
        { status: 404 }
      );
    }

    if (plan.isCustom) {
      return NextResponse.json({
        success: true,
        data: { message: 'Enterprise plan requires sales contact.' }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_example',
        message: `Checkout created for ${body.customerEmail}.`
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Invalid subscription request.' },
      { status: 400 }
    );
  }
}
