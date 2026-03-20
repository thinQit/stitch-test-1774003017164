import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const featureSchema = z.array(z.string());

const createSchema = z.object({
  name: z.string().min(1),
  priceMonthly: z.number().int().nullable().optional(),
  billingInterval: z.string().nullable().optional(),
  features: z.array(z.string()).nullable().optional(),
  isCustom: z.boolean().optional()
});

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

function isAuthorized(request: NextRequest): boolean {
  const adminToken = request.headers.get('x-admin-token');
  if (adminToken && process.env.ADMIN_TOKEN && adminToken === process.env.ADMIN_TOKEN) {
    return true;
  }

  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  const cookieToken = request.cookies.get('pf_admin')?.value;
  const token = headerToken ?? cookieToken;
  if (!token) return false;

  try {
    verifyToken(token);
    return true;
  } catch (_error) {
    return false;
  }
}

export async function GET(_request: NextRequest) {
  try {
    z.object({}).parse({});
    const plans = await db.subscriptionPlan.findMany({
      orderBy: { priceMonthly: 'asc' }
    });

    const data = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      billingInterval: plan.billingInterval,
      features: parseFeatures(plan.features),
      isCustom: plan.isCustom
    }));

    return NextResponse.json({ success: true, data });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load subscription plans.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const body = createSchema.parse(await request.json());
    const plan = await db.subscriptionPlan.create({
      data: {
        name: body.name,
        priceMonthly: body.priceMonthly ?? null,
        billingInterval: body.billingInterval ?? null,
        features: body.features ? JSON.stringify(body.features) : null,
        isCustom: body.isCustom ?? false
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: plan.id,
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        billingInterval: plan.billingInterval,
        features: parseFeatures(plan.features),
        isCustom: plan.isCustom
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Invalid subscription plan data.' },
      { status: 400 }
    );
  }
}
