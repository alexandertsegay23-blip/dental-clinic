import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const [
      appointments,
      patients,
      services,
      doctors,
      testimonials,
      blog,
      gallery,
      faqs,
      contact,
    ] = await Promise.all([
      prisma.appointment.findMany(),
      prisma.patient.findMany(),
      prisma.service.findMany(),
      prisma.doctor.findMany(),
      prisma.testimonial.findMany(),
      prisma.blogPost.findMany(),
      prisma.galleryImage.findMany(),
      prisma.fAQ.findMany(),
      prisma.contactSubmission.findMany(),
    ]);

    return NextResponse.json({
      stats: {
        appointments: {
          total: appointments.length,
          pending: appointments.filter((a: any) => a.status === 'pending').length,
          confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
          cancelled: appointments.filter((a: any) => a.status === 'cancelled').length
        },
        patients: { total: patients.length },
        services: { total: services.length },
        doctors: { total: doctors.length },
        testimonials: {
          total: testimonials.length,
          pending: testimonials.filter((t: any) => t.isApproved === 0).length
        },
        blog: {
          total: blog.length,
          published: blog.filter((p: any) => p.isPublished === 1).length
        },
        gallery: { total: gallery.length },
        faqs: { total: faqs.length },
        contact: {
          total: contact.length,
          new: contact.filter((c: any) => c.isRead === false).length
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
