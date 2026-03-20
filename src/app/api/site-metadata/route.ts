import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      brandName: 'ProjectFlow',
      primaryColor: '#7c3aed',
      secondaryColor: '#3b82f6',
      tertiaryColor: '#06b6d4',
      fonts: ['Manrope', 'Inter']
    }
  });
}
