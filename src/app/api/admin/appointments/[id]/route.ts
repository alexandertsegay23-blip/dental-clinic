import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateAppointment, deleteAppointment, getAppointmentById, getSettings } from '@/lib/repository';
import { sendSMS } from '@/lib/notifications';

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

async function getSettingsMap() {
  const settings = await getSettings();
  const settingsMap: Record<string, string> = {};
  settings.forEach((setting: any) => {
    settingsMap[setting.key] = setting.value;
  });
  return settingsMap;
}

async function sendAppointmentStatusMessage(appointment: any, status: string) {
  const patientPhone = appointment.patient?.phone?.trim();
  if (!patientPhone) {
    return false;
  }

  const settingsMap = await getSettingsMap();
  if (settingsMap.reminder_sms_enabled !== 'true') {
    return false;
  }

  const clinicName = settingsMap.clinic_name || 'Dental Clinic';
  const patientName = appointment.patient?.fullName || 'Patient';
  const serviceName = appointment.service?.name || 'your appointment';
  const appointmentDate = appointment.date;
  const appointmentTime = appointment.timeSlot;
  const doctorName = appointment.doctor?.name ? ` with ${appointment.doctor.name}` : '';

  const message =
    status === 'confirmed'
      ? `Hi ${patientName}, your ${serviceName} appointment${doctorName} at ${clinicName} is confirmed for ${appointmentDate} at ${appointmentTime}.`
      : `Hi ${patientName}, your ${serviceName} appointment${doctorName} at ${clinicName} scheduled for ${appointmentDate} at ${appointmentTime} has been cancelled. Please contact us to reschedule.`;

  return sendSMS(patientPhone, message, settingsMap);
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
    const appointment = await getAppointmentById(parseInt(id));
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment: serializeAppointment(appointment) });
  } catch (error) {
    console.error('Failed to fetch appointment:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
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
    const appointmentId = parseInt(id);
    const previousAppointment = await getAppointmentById(appointmentId);

    if (!previousAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    const appointment = await updateAppointment(appointmentId, {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.remind_sms !== undefined && { remind_sms: body.remind_sms }),
      ...(body.remind_whatsapp !== undefined && { remind_whatsapp: body.remind_whatsapp }),
      ...(body.reminder_sent !== undefined && { reminder_sent: body.reminder_sent }),
      ...(body.sms_confirmed !== undefined && { sms_confirmed: body.sms_confirmed }),
    });

    if (body.status !== undefined && body.status !== previousAppointment.status && ['confirmed', 'cancelled'].includes(body.status)) {
      const smsSent = await sendAppointmentStatusMessage(appointment, body.status);

      if (smsSent) {
        await updateAppointment(appointmentId, { sms_confirmed: true });
        appointment.smsConfirmed = true;
      }
    }

    return NextResponse.json({ appointment: serializeAppointment(appointment) });
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
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
    const success = await deleteAppointment(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
