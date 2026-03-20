import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const paramsSchema = z.object({ id: z.string().min(1) });
const updateSchema = z.object({
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  tertiaryColor: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable()
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

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const params = paramsSchema.parse(context.params);
    const setting = await db.siteSettings.findUnique({ where: { id: params.id } });

    if (!setting) {
      return NextResponse.json(
        { success: false, error: 'Site settings not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: setting.id,
        primaryColor: setting.primaryColor,
        secondaryColor: setting.secondaryColor,
        tertiaryColor: setting.tertiaryColor,
        heroTitle: setting.heroTitle,
        heroSubtitle: setting.heroSubtitle
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load site settings.' },
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
      primaryColor?: string | null;
      secondaryColor?: string | null;
      tertiaryColor?: string | null;
      heroTitle?: string | null;
      heroSubtitle?: string | null;
    } = {};

    if (body.primaryColor !== undefined) data.primaryColor = body.primaryColor;
    if (body.secondaryColor !== undefined) data.secondaryColor = body.secondaryColor;
    if (body.tertiaryColor !== undefined) data.tertiaryColor = body.tertiaryColor;
    if (body.heroTitle !== undefined) data.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) data.heroSubtitle = body.heroSubtitle;

    const setting = await db.siteSettings.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({
      success: true,
      data: {
        id: setting.id,
        primaryColor: setting.primaryColor,
        secondaryColor: setting.secondaryColor,
        tertiaryColor: setting.tertiaryColor,
        heroTitle: setting.heroTitle,
        heroSubtitle: setting.heroSubtitle
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to update site settings.' },
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
    const setting = await db.siteSettings.findUnique({ where: { id: params.id } });

    if (!setting) {
      return NextResponse.json(
        { success: false, error: 'Site settings not found.' },
        { status: 404 }
      );
    }

    await db.siteSettings.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to delete site settings.' },
      { status: 400 }
    );
  }
}
