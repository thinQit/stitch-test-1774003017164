import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/admin';

const schema = z.object({
  name: z.string().optional(),
  pricePerMonth: z.number().nullable().optional(),
  currency: z.string().optional(),
  features: z.array(z.string()).optional(),
  stripePriceId: z.string().optional(),
  isCustom: z.boolean().optional()
});

const parseFeatures = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch (_error) {
    return [];
  }
};

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const data = schema.parse(await request.json());
    const existing = await db.pricingTier.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Tier not found' }, { status: 404 });
    }
    const tier = await db.pricingTier.update({
      where: { id: params.id },
      data: {
        name: data.name ?? undefined,
        pricePerMonth: data.pricePerMonth ?? undefined,
        currency: data.currency ?? undefined,
        features: data.features ? JSON.stringify(data.features) : undefined,
        stripePriceId: data.stripePriceId ?? undefined,
        isCustom: data.isCustom ?? undefined
      }
    });
    return NextResponse.json({ success: true, data: { ...tier, features: parseFeatures(tier.features) } });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    assertAdmin(request);
    const existing = await db.pricingTier.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Tier not found' }, { status: 404 });
    }
    await db.pricingTier.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
