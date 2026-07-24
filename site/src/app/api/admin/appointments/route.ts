import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

function serializeAppointment(appointment: any) {
  return {
    id: appointment.id,
    patient_id: appointment.patientId,
    patient_name: appointment.patient?.fullName || '',
    patient_phone: appointment.patient?.phone || '',
    patient_email: appointment.patient?.email || '',
    service_id: appointment.serviceId,
    service_name: appointment.service?.name || '',
    doctor_id: appointment.doctorId ?? null,
    doctor_name: appointment.doctor?.name || '',
    date: appointment.date,
    time_slot: appointment.timeSlot,
    status: appointment.status,
    notes: appointment.notes || '',
    remind_sms: appointment.remindSms,
    remind_whatsapp: appointment.remindWhatsapp,
    reminder_sent: appointment.reminderSent,
    sms_confirmed: appointment.smsConfirmed,
    created_at: appointment.createdAt,
    updated_at: appointment.updatedAt,
  };
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { phone: { contains: search, mode: 'insensitive' } } },
        { service: { name: { contains: search, mode: 'insensitive' } } },
        { date: { contains: search, mode: 'insensitive' } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        service: true,
        doctor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ appointments: appointments.map(serializeAppointment) });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patient_id,
        serviceId: body.service_id,
        doctorId: body.doctor_id ?? undefined,
        date: body.date,
        timeSlot: body.time_slot,
        status: body.status || 'pending',
        notes: body.notes || '',
        remindSms: body.remind_sms || false,
        remindWhatsapp: body.remind_whatsapp || false,
      },
      include: {
        patient: true,
        service: true,
        doctor: true,
      },
    });

    return NextResponse.json({ appointment: serializeAppointment(appointment) });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
