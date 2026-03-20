import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  companyName: z.string().min(1).optional(),
  contactName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  message: z.string().min(10).optional()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contact = await db.enterpriseContact.findUnique({ where: { id: params.id } });
    if (!contact) {
      return NextResponse.json({ success: false, error: 'Enterprise contact not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id,
        companyName: contact.companyName,
        contactName: contact.contactName,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch enterprise contact' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const contact = await db.enterpriseContact.update({
      where: { id: params.id },
      data: parsed
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id,
        companyName: contact.companyName,
        contactName: contact.contactName,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to update enterprise contact' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.enterpriseContact.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete enterprise contact' }, { status: 400 });
  }
}
