import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getGalleryById, updateGalleryImage, deleteGalleryImage } from '@/lib/repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const image = await getGalleryById(parseInt(id));
    
    if (!image) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Failed to fetch gallery image:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery image' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    
    const image = await updateGalleryImage(parseInt(id), {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.url !== undefined && { url: body.url }),
      ...(body.alt_text !== undefined && { alt_text: body.alt_text }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.sort_order !== undefined && { sort_order: body.sort_order }),
      ...(body.is_active !== undefined && { is_active: body.is_active }),
    });

    if (!image) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Failed to update gallery image:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteGalleryImage(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
