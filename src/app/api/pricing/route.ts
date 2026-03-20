import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const featureSchema = z.array(z.string());

const defaultPlans = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    billingInterval: 'month',
    features: ['Up to 10 teammates', 'AI scheduling for 3 projects', 'Basic reporting'],
    isCustom: false
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 79,
    billingInterval: 'month',
    features: ['Unlimited teammates', 'Automated reporting', 'Advanced team insights'],
    isCustom: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: null,
    billingInterval: 'month',
    features: ['Custom workflows', 'Dedicated CSM', 'Security & compliance reviews'],
    isCustom: true
  }
];

function parseFeatures(value: string | null): string[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    const result = featureSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch (_error) {
    return null;
  }
}

export async function GET(_request: NextRequest) {
  try {
    z.object({}).parse({});
    const plans = await db.subscriptionPlan.findMany({
      orderBy: { priceMonthly: 'asc' }
    });

    const data = plans.length
      ? plans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          priceMonthly: plan.priceMonthly,
          billingInterval: plan.billingInterval,
          features: parseFeatures(plan.features),
          isCustom: plan.isCustom
        }))
      : defaultPlans;

    return NextResponse.json({ success: true, data });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load pricing.' },
      { status: 500 }
    );
  }
}
