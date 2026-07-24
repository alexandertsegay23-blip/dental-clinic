import { NextResponse } from 'next/server';
import { getSettings, setSetting } from '@/lib/repository';

const SENSITIVE_KEYS = [
  'afromessage_api_key',
  'afromessage_sender_id',
  'afromessage_identifier_id',
  'afromessage_base_url',
  'tawk_to_property_id',
];

export async function GET() {
  try {
    const settings = await getSettings();
    const settingsMap: Record<string, any> = {};
    settings.forEach((s: any) => {
      if (!SENSITIVE_KEYS.includes(s.key)) {
        settingsMap[s.key] = s.value;
      }
    });
    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = body.settings || body;
    
    for (const [key, value] of Object.entries(settings)) {
      await setSetting(key, String(value));
    }
    
    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
