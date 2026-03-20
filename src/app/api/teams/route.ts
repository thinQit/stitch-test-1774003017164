import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const TeamSchema = z.object({
  name: z.string().min(1),
  members: z.array(z.string()).optional()
});

function parseMembers(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((member) => typeof member === 'string') : [];
  } catch (_error) {
    return [];
  }
}

function getUserId(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  const cookieToken = request.cookies.get('token')?.value;
  const token = headerToken || cookieToken || null;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch (_error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const teams = await db.team.findMany({ orderBy: { createdAt: 'desc' } });
  const data = teams.map((team) => ({
    ...team,
    members: parseMembers(team.members)
  }));
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = TeamSchema.parse(body);
    const team = await db.team.create({
      data: {
        name: data.name,
        members: JSON.stringify(data.members ?? [])
      }
    });
    return NextResponse.json({
      success: true,
      data: { ...team, members: parseMembers(team.members) }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to create team.' }, { status: 400 });
  }
}
