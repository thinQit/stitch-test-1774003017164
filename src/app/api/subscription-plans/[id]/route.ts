import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const featureSchema = z.array(z.string());
const paramsSchema = z.object({ id: z.string().min(1) });

const updateSchema = z.object({
  name: z.string().min(1).optional(),
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

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const params = paramsSchema.parse(context.params);
    const plan = await db.subscriptionPlan.findUnique({ where: { id: params.id } });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Subscription plan not found.' },
        { status: 404 }
      );
    }

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
      { success: false, error: 'Unable to load subscription plan.' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const params = paramsSchema.parse(context.params);
    const body = updateSchema.parse(await request.json());

    const data: {
      name?: string;
      priceMonthly?: number | null;
      billingInterval?: string | null;
      features?: string | null;
      isCustom?: boolean;
    } = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.priceMonthly !== undefined) data.priceMonthly = body.priceMonthly;
    if (body.billingInterval !== undefined) data.billingInterval = body.billingInterval;
    if (body.features !== undefined) data.features = body.features ? JSON.stringify(body.features) : null;
    if (body.isCustom !== undefined) data.isCustom = body.isCustom;

    const plan = await db.subscriptionPlan.update({
      where: { id: params.id },
      data
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
      { success: false, error: 'Unable to update subscription plan.' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  return PUT(request, context);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const params = paramsSchema.parse(context.params);
    const existing = await db.subscriptionPlan.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Subscription plan not found.' },
        { status: 404 }
      );
    }

    await db.subscriptionPlan.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to delete subscription plan.' },
      { status: 400 }
    );
  }
}
