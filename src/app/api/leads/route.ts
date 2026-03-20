import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  interestTier: z.string().optional().nullable()
});

const querySchema = z.object({
  tier: z.string().optional()
});

const updateSchema = z.object({
  id: z.string().min(1),
  contacted: z.boolean()
});

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

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const params = querySchema.parse({
      tier: request.nextUrl.searchParams.get('tier') ?? undefined
    });

    const leads = await db.lead.findMany({
      where: params.tier
        ? { interestTier: { equals: params.tier, mode: 'insensitive' } }
        : undefined,
      orderBy: { createdAt: 'desc' }
    });

    const data = leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      message: lead.message,
      interestTier: lead.interestTier,
      contacted: lead.contacted,
      createdAt: lead.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, data });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load leads.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = createLeadSchema.parse(await request.json());
    const lead = await db.lead.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company ?? null,
        message: body.message ?? null,
        interestTier: body.interestTier ?? null
      }
    });

    return NextResponse.json({
      success: true,
      data: { leadId: lead.id, message: 'Lead received.' }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Invalid lead submission.' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const body = updateSchema.parse(await request.json());
    const lead = await db.lead.findUnique({ where: { id: body.id } });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found.' },
        { status: 404 }
      );
    }

    const updated = await db.lead.update({
      where: { id: body.id },
      data: { contacted: body.contacted }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        contacted: updated.contacted
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to update lead.' },
      { status: 400 }
    );
  }
}
