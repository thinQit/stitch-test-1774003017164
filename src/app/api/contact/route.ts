import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    ContactSchema.parse(body);
    return NextResponse.json({ success: true, data: { message: 'Message sent.' } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid contact request.' }, { status: 400 });
  }
}
