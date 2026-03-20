import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const updateSchema = z.object({
  name: z.string().optional(),
  price_monthly: z.number().nullable().optional(),
  billing_description: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  is_custom: z.boolean().optional()
});

function parseFeatures(features: string): string[] {
  try {
    const parsed = JSON.parse(features) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (_error) {
    return [];
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const plan = await db.plan.update({
      where: { id: params.id },
      data: {
        name: parsed.name,
        price_monthly: parsed.price_monthly,
        billing_description: parsed.billing_description ?? undefined,
        features: parsed.features ? JSON.stringify(parsed.features) : undefined,
        is_custom: parsed.is_custom
      }
    });

    return NextResponse.json({
      success: true,
      data: { plan: { ...plan, features: parseFeatures(plan.features) } }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update plan' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.plan.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete plan' }, { status: 400 });
  }
}
