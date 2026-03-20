import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  plan: z.enum(['starter', 'pro', 'enterprise']).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    SubscribeSchema.parse(body);
    return NextResponse.json({ success: true, data: { message: 'Subscribed successfully.' } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid subscription data.' }, { status: 400 });
  }
}
