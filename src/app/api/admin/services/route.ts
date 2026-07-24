import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getServices, createService } from '@/lib/repository';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const services = await getServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const service = await createService({
      name: body.name,
      description: body.description,
      duration: body.duration,
      price: body.price,
      icon_name: body.icon_name || 'smile',
      benefits: body.benefits || '',
      is_active: body.is_active ? 1 : 0,
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
