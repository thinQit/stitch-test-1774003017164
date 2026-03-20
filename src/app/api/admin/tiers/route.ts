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

export async function GET(request: NextRequest) {
  try {
    assertAdmin(request);
    const tiers = await db.pricingTier.findMany();
    const data = tiers.map((tier) => ({
      ...tier,
      features: parseFeatures(tier.features)
    }));
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 401;
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    assertAdmin(request);
    const data = schema.parse(await request.json());
    const tier = await db.pricingTier.create({
      data: {
        name: data.name ?? null,
        pricePerMonth: data.pricePerMonth ?? null,
        currency: data.currency ?? null,
        features: JSON.stringify(data.features ?? []),
        stripePriceId: data.stripePriceId ?? null,
        isCustom: data.isCustom ?? false
      }
    });
    return NextResponse.json({ success: true, data: { ...tier, features: data.features ?? [] } }, { status: 201 });
  } catch (error: unknown) {
    const status = (error as Error & { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
