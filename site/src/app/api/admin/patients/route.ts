import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getPatients, createPatient, updatePatient, deletePatient } from '@/lib/repository';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    let patients = await getPatients();
    
    if (search) {
      patients = patients.filter((patient: any) =>
        patient.fullName.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone.includes(search) ||
        (patient.email && patient.email.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const patient = await createPatient({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email,
      dob: body.dob,
      medical_history: body.medical_history,
      date_of_birth: body.date_of_birth,
      gender: body.gender,
      address: body.address,
      emergency_contact: body.emergency_contact,
      emergency_phone: body.emergency_phone,
      allergies: body.allergies,
      notes: body.notes,
    });

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('Failed to create patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
