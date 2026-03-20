import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

const fallbackContent = {
  hero_title: null,
  hero_subtitle: null,
  footer_text: null,
};

export async function GET(_request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(fallbackContent);
  }

  try {
    const content = await prisma.siteContent.findFirst();
    return NextResponse.json(content ?? fallbackContent);
  } catch (error) {
    return NextResponse.json(fallbackContent);
  }
}
