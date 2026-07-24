import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: 1 },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
