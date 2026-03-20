import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const lead = await db.enterpriseContact.create({ data: parsed });

    return NextResponse.json({
      success: true,
      data: {
        message: 'We will reach out shortly.',
        leadId: lead.id
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to send your request' }, { status: 400 });
  }
}
