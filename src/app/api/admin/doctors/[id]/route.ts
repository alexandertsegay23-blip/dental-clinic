import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

function toSocialPayload(body: any) {
  return [
    body.linkedin ? { platform: 'linkedin', url: body.linkedin } : null,
    body.twitter ? { platform: 'twitter', url: body.twitter } : null,
    body.instagram ? { platform: 'instagram', url: body.instagram } : null,
  ].filter(Boolean) as Array<{ platform: string; url: string }>;
}

function serializeDoctor(doctor: any) {
  const social: Record<string, string> = {};
  (doctor.doctorSocial || []).forEach((item: any) => {
    social[item.platform] = item.url;
  });

  return {
    id: doctor.id,
    name: doctor.name,
    qualifications: doctor.qualifications,
    biography: doctor.biography || '',
    years_experience: doctor.yearsExperience,
    photo_url: doctor.photoUrl || '',
    is_active: doctor.isActive,
    social,
  };
}

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
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: { doctorSocial: true },
    });
    
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor: serializeDoctor(doctor) });
  } catch (error) {
    console.error('Failed to fetch doctor:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
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
    const socialLinks = toSocialPayload(body);
    
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.qualifications !== undefined && { qualifications: body.qualifications }),
        ...(body.biography !== undefined && { biography: body.biography }),
        ...(body.years_experience !== undefined && { yearsExperience: body.years_experience }),
        ...(body.photo_url !== undefined && { photoUrl: body.photo_url }),
        ...(body.is_active !== undefined && { isActive: body.is_active ? 1 : 0 }),
        doctorSocial: {
          deleteMany: {},
          ...(socialLinks.length > 0 ? { create: socialLinks } : {}),
        },
      },
      include: { doctorSocial: true },
    });

    return NextResponse.json({ doctor: serializeDoctor(doctor) });
  } catch (error) {
    console.error('Failed to update doctor:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
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
    await prisma.doctor.delete({ where: { id: parseInt(id) } });
    
    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Failed to delete doctor:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
