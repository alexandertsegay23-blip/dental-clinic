import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getFaqs, createFaq } from '@/lib/repository';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const faqs = await getFaqs();
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const faq = await createFaq({
      question: body.question,
      answer: body.answer,
      category: body.category,
      sort_order: body.sort_order || 0,
      is_active: body.is_active ? 1 : 0,
    });

    return NextResponse.json({ faq });
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
