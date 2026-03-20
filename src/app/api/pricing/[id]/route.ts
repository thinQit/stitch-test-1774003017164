import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  price_per_month: z.number().nullable().optional(),
  currency: z.string().min(1).optional(),
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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const plan = await db.pricingPlan.findUnique({ where: { id: params.id } });
  if (!plan) {
    return NextResponse.json({ success: false, error: 'Pricing plan not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { ...plan, features: parseFeatures(plan.features) } });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const existing = await db.pricingPlan.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Pricing plan not found' }, { status: 404 });
    }

    const data = {
      name: body.name ?? existing.name,
      price_per_month: body.price_per_month ?? existing.price_per_month,
      currency: body.currency ?? existing.currency,
      features: body.features ? JSON.stringify(body.features) : existing.features,
      is_custom_contact: body.is_custom_contact ?? existing.is_custom_contact
    };

    const plan = await db.pricingPlan.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: { ...plan, features: parseFeatures(plan.features) } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await db.pricingPlan.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Pricing plan not found' }, { status: 404 });
  }

  await db.pricingPlan.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, data: null });
}
