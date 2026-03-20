import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.parse(body);

    const lead = await db.lead.create({
      data: {
        email: parsed.email,
        name: parsed.name ?? null,
        source: parsed.source ?? 'newsletter'
      }
    });

    return NextResponse.json({
      success: true,
      data: { success: true, leadId: lead.id, message: 'Subscribed.' }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
  }
}
