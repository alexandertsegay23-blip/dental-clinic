import { NextResponse } from 'next/server';
import { getAll, updateRecord } from '@/lib/repository';
import { sendSMS } from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isVercelCron = request.headers.get('x-vercel-signature');
    
    if (!cronSecret) {
      console.error('CRON_SECRET is not configured!');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const hasValidSecret = authHeader === `Bearer ${cronSecret}`;
    
    if (!hasValidSecret && !isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getAll('settings');
    const settingsMap: Record<string, string> = {};
    settings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });

    if (settingsMap.reminder_enabled !== 'true') {
      return NextResponse.json({ message: 'Reminders are disabled', sent: 0 });
    }

    const hoursBefore = parseInt(settingsMap.reminder_hours_before || '24', 10);
    const now = new Date();

    const appointments = await getAll('appointments');

    let sentCount = 0;

    for (const apt of appointments) {
      if (apt.reminderSent || apt.status !== 'confirmed') {
        continue;
      }

      if (!apt.remindSms && !apt.remindWhatsapp) {
        continue;
      }

      const appointmentDateTime = new Date(`${apt.date}T${apt.timeSlot || '00:00'}`);
      const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilAppointment < 0 || hoursUntilAppointment > hoursBefore) {
        continue;
      }

      const patient = apt.patient;
      if (!patient) continue;

      const patientPhone = patient.phone || '';
      const patientName = patient.fullName || 'Patient';
      const clinicName = settingsMap.clinic_name || 'Dental Clinic';
      const serviceName = apt.service?.name || 'appointment';
      const doctorName = apt.doctor?.name ? ` with ${apt.doctor.name}` : '';
      const messageTemplate = settingsMap.reminder_message || 'this is a reminder about your appointment.';
      const message = `Hi ${patientName}, ${messageTemplate} ${serviceName}${doctorName} is scheduled for ${apt.date} at ${apt.timeSlot} at ${clinicName}.`;
      let reminderSent = false;

      if (settingsMap.reminder_sms_enabled === 'true' && apt.remindSms && patientPhone) {
        reminderSent = await sendSMS(patientPhone, message, settingsMap) || reminderSent;
      }

      if (settingsMap.reminder_whatsapp_enabled === 'true' && apt.remindWhatsapp && patientPhone) {
        reminderSent = await sendWhatsAppReminder(patientPhone, message) || reminderSent;
      }

      if (reminderSent) {
        await updateRecord('appointments', apt.id, { reminder_sent: true });
        sentCount++;
      }
    }

    return NextResponse.json({
      message: `Sent ${sentCount} reminders`,
      sent: sentCount
    });
  } catch (error) {
    console.error('Failed to send reminders:', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}

async function sendWhatsAppReminder(phone: string, message: string) {
  const cleanPhone = phone.replace(/\+/g, '');
  console.warn(`[WhatsApp Reminder] Provider not implemented. Message not sent to ${cleanPhone}: ${message}`);
  return false;
}
