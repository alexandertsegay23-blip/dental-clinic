import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getGallery, createGalleryImage } from '@/lib/repository';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const images = await getGallery();
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const image = await createGalleryImage({
      title: body.title,
      url: body.url,
      alt_text: body.alt_text,
      description: body.description,
      category: body.category,
      sort_order: body.sort_order || 0,
      is_active: body.is_active ? 1 : 0,
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Failed to create gallery image:', error);
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}
