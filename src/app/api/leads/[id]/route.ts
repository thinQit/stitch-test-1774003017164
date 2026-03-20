import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const paramsSchema = z.object({ id: z.string().min(1) });

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  company: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  interestTier: z.string().optional().nullable(),
  contacted: z.boolean().optional()
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

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const params = paramsSchema.parse(context.params);
    const lead = await db.lead.findUnique({ where: { id: params.id } });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        message: lead.message,
        interestTier: lead.interestTier,
        contacted: lead.contacted,
        createdAt: lead.createdAt.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load lead.' },
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
      email?: string;
      company?: string | null;
      message?: string | null;
      interestTier?: string | null;
      contacted?: boolean;
    } = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email;
    if (body.company !== undefined) data.company = body.company;
    if (body.message !== undefined) data.message = body.message;
    if (body.interestTier !== undefined) data.interestTier = body.interestTier;
    if (body.contacted !== undefined) data.contacted = body.contacted;

    const updated = await db.lead.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        company: updated.company,
        message: updated.message,
        interestTier: updated.interestTier,
        contacted: updated.contacted,
        createdAt: updated.createdAt.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to update lead.' },
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
    const lead = await db.lead.findUnique({ where: { id: params.id } });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found.' },
        { status: 404 }
      );
    }

    await db.lead.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to delete lead.' },
      { status: 400 }
    );
  }
}
