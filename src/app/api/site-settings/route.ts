import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const createSchema = z.object({
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

export async function GET(_request: NextRequest) {
  try {
    z.object({}).parse({});
    const settings = await db.siteSettings.findMany({ orderBy: { createdAt: 'desc' } });

    const data = settings.map((item) => ({
      id: item.id,
      primaryColor: item.primaryColor,
      secondaryColor: item.secondaryColor,
      tertiaryColor: item.tertiaryColor,
      heroTitle: item.heroTitle,
      heroSubtitle: item.heroSubtitle
    }));

    return NextResponse.json({ success: true, data });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load site settings.' },
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
    const setting = await db.siteSettings.create({
      data: {
        primaryColor: body.primaryColor ?? null,
        secondaryColor: body.secondaryColor ?? null,
        tertiaryColor: body.tertiaryColor ?? null,
        heroTitle: body.heroTitle ?? null,
        heroSubtitle: body.heroSubtitle ?? null
      }
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
      { success: false, error: 'Invalid site settings data.' },
      { status: 400 }
    );
  }
}
