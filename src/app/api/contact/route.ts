import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);

    const lead = await db.lead.create({
      data: {
        email: parsed.email,
        name: parsed.name,
        company: parsed.company ?? null,
        message: parsed.message,
        source: 'contact'
      }
    });

    return NextResponse.json({ success: true, data: { success: true, contactId: lead.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
