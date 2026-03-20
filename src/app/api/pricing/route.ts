import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      tiers: [
        {
          id: 'starter',
          name: 'Starter',
          priceMonthly: 29,
          benefits: ['AI sprint planning', 'Weekly reports', 'Up to 5 projects']
        },
        {
          id: 'pro',
          name: 'Pro',
          priceMonthly: 79,
          benefits: ['Advanced insights', 'Unlimited projects', 'Priority support']
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          priceMonthly: 'custom',
          benefits: ['Custom integrations', 'Dedicated success', 'Enterprise security']
        }
      ]
    }
  });
}
