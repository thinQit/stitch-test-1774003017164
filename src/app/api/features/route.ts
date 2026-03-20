import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const features = await db.featureCard.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ success: true, data: features });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to load features.' }, { status: 500 });
  }
}
