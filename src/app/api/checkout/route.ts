import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSchema = z.object({
  planId: z.string().min(1),
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  try {
    const body = checkoutSchema.parse(await request.json());
    return NextResponse.json({
      success: true,
      data: {
        checkoutSessionId: `chk_${body.planId}_${Date.now()}`,
        redirectUrl: `/signup?plan=${body.planId}`
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
