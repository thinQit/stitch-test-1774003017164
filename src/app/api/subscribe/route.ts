import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  company: z.string().optional(),
  planInterest: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const data = schema.parse(await request.json());
    const lead = await db.lead.create({
      data: {
        email: data.email,
        name: data.name,
        company: data.company ?? null,
        planInterest: data.planInterest ?? null
      }
    });
    return NextResponse.json({
      success: true,
      data: { id: lead.id, email: lead.email, createdAt: lead.createdAt.toISOString() }
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
