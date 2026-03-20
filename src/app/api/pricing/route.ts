import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const pricingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  price_per_month: z.number().nullable().optional(),
  currency: z.string().min(1),
  features: z.array(z.string()).optional(),
  is_custom_contact: z.boolean().optional()
});

function getUserIdFromRequest(request: NextRequest): string | null {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (payload && typeof payload === 'object' && 'userId' in payload && typeof payload.userId === 'string') {
      return payload.userId;
    }
    return null;
  } catch {
    return null;
  }
}

function parseFeatures(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export async function GET(_request: NextRequest) {
  const plans = await db.pricingPlan.findMany();
  const data = plans.map((plan) => ({
    ...plan,
    features: parseFeatures(plan.features)
  }));
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = pricingSchema.parse(await request.json());
    const data = {
      name: body.name,
      price_per_month: body.price_per_month ?? null,
      currency: body.currency,
      features: JSON.stringify(body.features ?? []),
      is_custom_contact: body.is_custom_contact ?? false
    };

    let plan;
    if (body.id) {
      const existing = await db.pricingPlan.findUnique({ where: { id: body.id } });
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Pricing plan not found' }, { status: 404 });
      }
      plan = await db.pricingPlan.update({ where: { id: body.id }, data });
    } else {
      plan = await db.pricingPlan.create({ data });
    }

    return NextResponse.json(
      { success: true, data: { ...plan, features: parseFeatures(plan.features) } },
      { status: body.id ? 200 : 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
