import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const schema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function GET(_request: NextRequest) {
  try {
    const contacts = await db.enterpriseContact.findMany({ orderBy: { createdAt: 'desc' } });
    const mapped = contacts.map((contact) => ({
      id: contact.id,
      companyName: contact.companyName,
      contactName: contact.contactName,
      email: contact.email,
      message: contact.message,
      createdAt: contact.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, data: { contacts: mapped } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch enterprise contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const contact = await db.enterpriseContact.create({ data: parsed });

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
    return NextResponse.json({ success: false, error: 'Unable to create enterprise contact' }, { status: 400 });
  }
}
