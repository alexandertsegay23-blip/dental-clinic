import { NextResponse } from 'next/server';
import { getAll } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const sendSmsSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  message: z.string().optional().or(z.literal('')),
});

export async function GET() {
  return NextResponse.json({ 
    message: 'Send SMS Test Endpoint',
    usage: 'POST to this endpoint with { "phone": "YOUR_PHONE", "message": "YOUR_MESSAGE" }',
    example: {
      phone: '0962238776',
      message: 'Hello from Dental Clinic!'
    }
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = sendSmsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: (result.error as any).issues }, { status: 400 });
    }

    const { phone, message } = result.data;

    const settings = getAll<any>('settings');
    const settingsMap: Record<string, string> = {};
    settings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });

    const apiKey = settingsMap.afromessage_api_key;
    const senderId = settingsMap.afromessage_sender_id;
    const baseUrl = settingsMap.afromessage_base_url || 'https://api.afromessage.com/api';

    if (!apiKey || !senderId) {
      return NextResponse.json({ error: 'AfroMessage not configured' }, { status: 500 });
    }

    const cleanPhone = phone.replace(/\+/g, '');
    const fullMessage = message || 'Test message from Dental Clinic - AfroMessage API test.';

    const response = await fetch(`${baseUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: cleanPhone,
        message: fullMessage,
        senderId: senderId,
      }),
    });

    const responseText = await response.text();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      phone: cleanPhone,
      message: fullMessage,
    });

  } catch (error) {
    console.error('Send SMS error:', error);
    return NextResponse.json({ 
      error: 'Failed to send SMS',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
