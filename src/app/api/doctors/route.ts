import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: 1 },
      include: { doctorSocial: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ doctors: doctors.map(serializeDoctor) });
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
