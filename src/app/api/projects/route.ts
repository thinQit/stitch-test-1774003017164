import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional()
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

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const projects = await db.project.findMany({ where: { ownerId: userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ success: true, data: projects });
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = ProjectSchema.parse(body);
    const project = await db.project.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        ownerId: userId,
        status: 'active'
      }
    });
    return NextResponse.json({ success: true, data: project });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid project data.' }, { status: 400 });
  }
}
