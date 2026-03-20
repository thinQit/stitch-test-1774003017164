import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  name: z.string().min(1).optional(),
  monthlyPrice: z.number().nonnegative().optional(),
  isCustom: z.boolean().optional(),
  features: z.array(z.string().min(1)).optional()
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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tier = await db.pricingTier.findUnique({ where: { id: params.id } });
    if (!tier) {
      return NextResponse.json({ success: false, error: 'Pricing tier not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: tier.id,
        name: tier.name,
        monthlyPrice: tier.monthlyPrice,
        isCustom: tier.isCustom,
        features: parseFeatures(tier.features)
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch pricing tier' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const tier = await db.pricingTier.update({
      where: { id: params.id },
      data: {
        name: parsed.name,
        monthlyPrice: parsed.monthlyPrice,
        isCustom: parsed.isCustom,
        features: parsed.features ? JSON.stringify(parsed.features) : undefined
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: tier.id,
        name: tier.name,
        monthlyPrice: tier.monthlyPrice,
        isCustom: tier.isCustom,
        features: parseFeatures(tier.features)
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update pricing tier' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.pricingTier.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete pricing tier' }, { status: 400 });
  }
}
