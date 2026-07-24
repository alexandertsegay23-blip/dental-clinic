import { NextResponse } from 'next/server';
import { createContactSubmission } from '@/lib/repository';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: (result.error as any).issues }, { status: 400 });
    }

    const submission = await createContactSubmission({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      message: result.data.message,
    });

    return NextResponse.json({ message: 'Message sent successfully', submission });
  } catch (error) {
    console.error('Failed to send contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
