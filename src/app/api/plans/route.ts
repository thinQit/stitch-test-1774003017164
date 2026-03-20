import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const planSchema = z.object({
  name: z.string().min(1),
  price_monthly: z.number().nullable(),
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

export async function GET(_request: NextRequest) {
  try {
    const plans = await db.plan.findMany();
    const data = plans.map((plan) => ({
      ...plan,
      features: parseFeatures(plan.features)
    }));
    return NextResponse.json({ success: true, data: { plans: data } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = planSchema.parse(body);

    const plan = await db.plan.create({
      data: {
        name: parsed.name,
        price_monthly: parsed.price_monthly,
        billing_description: parsed.billing_description ?? null,
        features: JSON.stringify(parsed.features ?? []),
        is_custom: parsed.is_custom ?? false
      }
    });

    return NextResponse.json({
      success: true,
      data: { plan: { ...plan, features: parseFeatures(plan.features) } }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
