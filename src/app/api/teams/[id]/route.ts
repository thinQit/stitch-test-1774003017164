import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const team = await db.team.findUnique({ where: { id: params.id } });
  if (!team) {
    return NextResponse.json({ success: false, error: 'Team not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { ...team, members: parseMembers(team.members) } });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = UpdateSchema.parse(body);
    const updateData: { name?: string; members?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.members) updateData.members = JSON.stringify(data.members);

    const team = await db.team.update({
      where: { id: params.id },
      data: updateData
    });
    return NextResponse.json({ success: true, data: { ...team, members: parseMembers(team.members) } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update team.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authUserId = getUserId(request);
  if (!authUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await db.team.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete team.' }, { status: 400 });
  }
}
