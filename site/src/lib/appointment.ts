import { z } from 'zod';

export const appointmentSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(9, 'Valid phone number is required'),
  date: z.string().min(1, 'Date is required'),
  serviceId: z.string().min(1, 'Please select a service'),
  message: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export async function submitAppointment(data: AppointmentFormData) {
  // In a real application, this would be an API call to a backend (e.g. Supabase, Firebase, or Next.js route)
  // We simulate a network request here.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('--- NEW APPOINTMENT SUBMITTED ---');
      console.log(data);
      console.log('---------------------------------');
      resolve({ success: true });
    }, 1000);
  });
}
