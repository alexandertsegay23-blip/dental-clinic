import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/home-data';

export async function GET() {
  try {
    const data = await getHomeData();
    
    if (!data) {
      return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}
