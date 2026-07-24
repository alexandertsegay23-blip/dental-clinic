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

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const doctors = await prisma.doctor.findMany({
      include: { doctorSocial: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ doctors: doctors.map(serializeDoctor) });
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const socialLinks = toSocialPayload(body);
    
    const doctor = await prisma.doctor.create({
      data: {
        name: body.name,
        qualifications: body.qualifications,
        biography: body.biography || '',
        yearsExperience: body.years_experience || 0,
        photoUrl: body.photo_url || '',
        isActive: body.is_active ? 1 : 0,
        doctorSocial: socialLinks.length > 0 ? { create: socialLinks } : undefined,
      },
      include: { doctorSocial: true },
    });

    return NextResponse.json({ doctor: serializeDoctor(doctor) });
  } catch (error) {
    console.error('Failed to create doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
