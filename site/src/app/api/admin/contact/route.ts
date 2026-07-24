import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getContactSubmissions, createContactSubmission } from '@/lib/repository';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const submissions = await getContactSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const submission = await createContactSubmission({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Failed to create contact submission:', error);
    return NextResponse.json({ error: 'Failed to create contact submission' }, { status: 500 });
  }
}
