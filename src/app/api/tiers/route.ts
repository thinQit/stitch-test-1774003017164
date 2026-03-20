import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const parseFeatures = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch (_error) {
    return [];
  }
};

export async function GET(_request: NextRequest) {
  try {
    const tiers = await db.pricingTier.findMany();
    const data = tiers.map((tier) => ({
      ...tier,
      features: parseFeatures(tier.features)
    }));
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load tiers';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
