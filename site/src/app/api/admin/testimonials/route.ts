import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getTestimonials, createTestimonial } from '@/lib/repository';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const testimonials = await getTestimonials();
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const testimonial = await createTestimonial({
      patient_name: body.patient_name,
      treatment: body.treatment,
      quote: body.quote,
      rating: body.rating || 5,
      is_approved: body.is_approved ? 1 : 0,
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
