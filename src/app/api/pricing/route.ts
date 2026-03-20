import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const parseFeatures = (value: string | null): string[] => {
  if (!value) return [];
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
