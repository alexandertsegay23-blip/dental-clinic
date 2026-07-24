import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAppointment, getAppointments } from '@/lib/repository';
import { z } from 'zod';

const appointmentBookingSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  service_id: z.coerce.number().min(1, 'Service is required'),
  doctor_id: z.coerce.number().optional().nullable(),
  date: z.string().min(1, 'Date is required'),
  time_slot: z.string().min(1, 'Time slot is required'),
  notes: z.string().optional().or(z.literal('')),
  remind_sms: z.boolean().optional(),
  remind_whatsapp: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = appointmentBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: (result.error as any).issues }, { status: 400 });
    }

    const { full_name, phone, email, service_id, doctor_id, date, time_slot, notes, remind_sms, remind_whatsapp } = result.data;

    // Create a patient record from the public booking form data
    const patient = await prisma.patient.create({
      data: {
        fullName: full_name || 'Guest',
        phone: phone || '',
        email: email || '',
      },
    });

    // Create the appointment linked to the patient
    const appointment = await createAppointment({
      patient_id: patient.id,
      service_id,
      doctor_id: doctor_id || undefined,
      date,
      time_slot,
      status: 'pending',
      notes: notes || '',
      remind_sms: remind_sms || false,
      remind_whatsapp: remind_whatsapp || false,
    });

    // NO SMS on booking - admin will send confirmation after review
    console.log(`[Booking] New appointment created (ID: ${appointment.id}) - Status: pending - No SMS sent`);

    return NextResponse.json({ 
      id: appointment.id, 
      message: 'Appointment request submitted. Our team will review and confirm shortly.' 
    });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: 'Failed to submit appointment request' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const appointments = await getAppointments({ status, search });
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
