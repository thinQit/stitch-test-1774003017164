import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  name: z.string().min(1),
  monthlyPrice: z.number().nonnegative(),
  isCustom: z.boolean().optional(),
  features: z.array(z.string().min(1))
});

const parseFeatures = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch (_error) {
    return [];
  }
};

export async function GET(_request: NextRequest) {
  try {
    const tiers = await db.pricingTier.findMany();
    const mapped = tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      monthlyPrice: tier.monthlyPrice,
      isCustom: tier.isCustom,
      features: parseFeatures(tier.features)
    }));

    return NextResponse.json({ success: true, data: { tiers: mapped } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch pricing tiers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const tier = await db.pricingTier.create({
      data: {
        name: parsed.name,
        monthlyPrice: parsed.monthlyPrice,
        isCustom: parsed.isCustom ?? false,
        features: JSON.stringify(parsed.features)
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: tier.id,
        name: tier.name,
        monthlyPrice: tier.monthlyPrice,
        isCustom: tier.isCustom,
        features: parsed.features
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to create pricing tier' }, { status: 400 });
  }
}
