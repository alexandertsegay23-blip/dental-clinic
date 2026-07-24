import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getPatientById, updatePatient, deletePatient } from '@/lib/repository';

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
    const patient = await getPatientById(parseInt(id));
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
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
    
    const patient = await updatePatient(parseInt(id), {
      ...(body.full_name !== undefined && { full_name: body.full_name }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.dob !== undefined && { dob: body.dob }),
      ...(body.medical_history !== undefined && { medical_history: body.medical_history }),
      ...(body.date_of_birth !== undefined && { date_of_birth: body.date_of_birth }),
      ...(body.gender !== undefined && { gender: body.gender }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.emergency_contact !== undefined && { emergency_contact: body.emergency_contact }),
      ...(body.emergency_phone !== undefined && { emergency_phone: body.emergency_phone }),
      ...(body.allergies !== undefined && { allergies: body.allergies }),
      ...(body.notes !== undefined && { notes: body.notes }),
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('Failed to update patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
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
    const success = await deletePatient(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Failed to delete patient:', error);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
