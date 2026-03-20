import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const UpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.string().optional()
});

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
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const project = await db.project.findFirst({ where: { id: params.id, ownerId: userId } });
  if (!project) {
    return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: project });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const existing = await db.project.findFirst({ where: { id: params.id, ownerId: userId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
  }
  try {
    const body = await request.json();
    const data = UpdateSchema.parse(body);
    const project = await db.project.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: project });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update project.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const existing = await db.project.findFirst({ where: { id: params.id, ownerId: userId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
  }
  try {
    await db.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete project.' }, { status: 400 });
  }
}
