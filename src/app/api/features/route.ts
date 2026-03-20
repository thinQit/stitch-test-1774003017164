import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const features = [
  {
    id: 'smart-scheduling',
    title: 'Smart Scheduling',
    description: 'AI prioritizes work and surfaces delivery risks before they block launches.',
    iconName: '✨'
  },
  {
    id: 'automated-reporting',
    title: 'Automated Reporting',
    description: 'Generate weekly stakeholder updates with zero manual status chasing.',
    iconName: '📊'
  },
  {
    id: 'team-insights',
    title: 'Team Insights',
    description: 'Balance workloads and monitor sentiment across squads in real time.',
    iconName: '👥'
  }
];

export async function GET(_request: NextRequest) {
  try {
    z.object({}).parse({});
    return NextResponse.json({ success: true, data: features });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Unable to load features.' },
      { status: 500 }
    );
  }
}
