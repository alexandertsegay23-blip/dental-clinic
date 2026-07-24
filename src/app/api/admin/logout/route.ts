import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, destroySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await destroySession();
  return NextResponse.json({ message: 'Logged out successfully' });
}
