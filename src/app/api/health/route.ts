import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(_request: NextRequest) {
  try {
    z.object({}).parse({});
    return NextResponse.json({
      success: true,
      data: { status: 'ok', timestamp: new Date().toISOString() }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read health status.' },
      { status: 500 }
    );
  }
}
