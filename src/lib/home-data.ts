import prisma from '@/lib/prisma';

export interface HomeData {
  settings: Record<string, string>;
  doctors: any[];
  services: any[];
  testimonials: any[];
  gallery: any[];
  faqs: any[];
}

export async function getHomeData(): Promise<HomeData | null> {
  try {
    const [settings, doctors, services, testimonials, gallery, faqs] = await Promise.all([
      prisma.setting.findMany(),
      prisma.doctor.findMany({
        where: { isActive: 1 },
        include: { doctorSocial: true },
        orderBy: { id: 'asc' },
      }),
      prisma.service.findMany({
        where: { isActive: 1 },
        orderBy: { id: 'asc' },
      }),
      prisma.testimonial.findMany({
        where: { isApproved: 1 },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.galleryImage.findMany({
        where: { isActive: 1 },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.fAQ.findMany({
        where: { isActive: 1 },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    const settingsMap: Record<string, string> = {};
    settings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });

    return {
      settings: settingsMap,
      doctors: doctors.map((d: any) => ({
        id: d.id,
        name: d.name,
        qualifications: d.qualifications,
        biography: d.biography || '',
        years_experience: d.yearsExperience,
        photo_url: d.photoUrl || '',
        is_active: d.isActive,
        social: d.doctorSocial?.reduce((acc: any, item: any) => {
          acc[item.platform] = item.url;
          return acc;
        }, {}),
      })),
      services: services.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        duration: s.duration,
        price: s.price,
        icon_name: s.iconName,
        benefits: s.benefits,
        is_active: s.isActive,
      })),
      testimonials: testimonials.map((t: any) => ({
        id: t.id,
        patient_name: t.patientName,
        treatment: t.treatment,
        quote: t.quote,
        rating: t.rating,
        is_approved: t.isApproved,
      })),
      gallery: gallery.map((g: any) => ({
        id: g.id,
        title: g.title,
        url: g.url,
        alt_text: g.altText,
        sort_order: g.sortOrder,
        is_active: g.isActive,
      })),
      faqs: faqs.map((f: any) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sort_order: f.sortOrder,
        is_active: f.isActive,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return null;
  }
}