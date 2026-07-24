import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    // Seed admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        passwordHash: adminPasswordHash,
        role: 'admin',
      },
    });

    // Seed services
    const services = [
      { name: 'General Dentistry', description: 'Comprehensive dental care including cleanings, fillings, and preventive treatments.', duration: '60 min', price: 150, iconName: 'smile', benefits: 'Removes plaque', isActive: 1 },
      { name: 'Cosmetic Dentistry', description: 'Transform your smile with veneers, whitening, and bonding treatments.', duration: '90 min', price: 500, iconName: 'sparkles', benefits: 'Whitens teeth', isActive: 1 },
      { name: 'Dental Implants', description: 'Permanent tooth replacement solutions that look and feel natural.', duration: '120 min', price: 2500, iconName: 'activity', benefits: 'Permanent solution', isActive: 1 },
      { name: 'Orthodontics', description: 'Straighten your teeth with modern braces and clear aligners.', duration: '180 min', price: 3000, iconName: 'smile', benefits: 'Straightens teeth', isActive: 1 },
      { name: 'Teeth Whitening', description: 'Professional whitening for a brighter, more confident smile.', duration: '45 min', price: 300, iconName: 'sun', benefits: 'Brightens smile', isActive: 1 },
      { name: 'Emergency Care', description: '24/7 emergency dental services for urgent dental issues.', duration: '30 min', price: 200, iconName: 'alert-triangle', benefits: '24/7 support', isActive: 1 }
    ];

    for (const service of services) {
      await prisma.service.create({ data: service });
    }

    // Seed doctors
    const doctors = [
      { name: 'Dr. Sarah Johnson', qualifications: 'DDS, Harvard School of Dental Medicine', biography: 'With over 15 years of experience, Dr. Johnson provides comprehensive dental care with a gentle touch.', yearsExperience: 15, photoUrl: '/images/doctor-1.jpg', isActive: 1 },
      { name: 'Dr. Michael Chen', qualifications: 'DDS, UCLA School of Dentistry', biography: 'Dr. Chen is a renowned cosmetic dentist specializing in smile makeovers and veneers.', yearsExperience: 12, photoUrl: '/images/doctor-2.jpg', isActive: 1 },
      { name: 'Dr. Emily Rodriguez', qualifications: 'DDS, Columbia University', biography: 'Dr. Rodriguez is a board-certified orthodontist passionate about creating perfect smiles.', yearsExperience: 10, photoUrl: '/images/doctor-3.jpg', isActive: 1 },
      { name: 'Dr. James Wilson', qualifications: 'DDS, NYU College of Dentistry', biography: 'Dr. Wilson specializes in complex extractions and dental implant procedures.', yearsExperience: 18, photoUrl: '/images/doctor-4.jpg', isActive: 1 }
    ];

    for (const doctor of doctors) {
      await prisma.doctor.create({ data: doctor });
    }

    // Seed testimonials
    const testimonials = [
      { patientName: 'John Smith', treatment: 'General checkup', quote: 'Amazing experience! The staff was friendly and professional. My smile has never looked better.', rating: 5, isApproved: 1 },
      { patientName: 'Sarah Williams', treatment: 'Implants', quote: 'I was nervous about getting dental implants, but Dr. Chen made the whole process comfortable. Highly recommend!', rating: 5, isApproved: 1 },
      { patientName: 'Michael Brown', treatment: 'Cleaning', quote: 'Best dental clinic in the area. Clean facilities, modern equipment, and excellent care.', rating: 5, isApproved: 1 },
      { patientName: 'Emily Davis', treatment: 'Orthodontics', quote: 'The orthodontic treatment changed my life. I can finally smile with confidence!', rating: 5, isApproved: 1 }
    ];

    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial });
    }

    // Seed gallery
    const galleryItems = [
      { title: 'Modern Reception Area', url: '/images/gallery-1.jpg', altText: 'Our welcoming reception area', description: 'Modern reception area', category: 'general', sortOrder: 1, isActive: 1 },
      { title: 'Treatment Room', url: '/images/gallery-2.jpg', altText: 'State-of-the-art treatment rooms', description: 'Treatment room', category: 'general', sortOrder: 2, isActive: 1 },
      { title: 'Smile Makeover', url: '/images/gallery-3.jpg', altText: 'Before and after smile transformation', description: 'Smile makeover', category: 'general', sortOrder: 3, isActive: 1 },
      { title: 'Dental Equipment', url: '/images/gallery-4.jpg', altText: 'Latest dental technology', description: 'Dental equipment', category: 'general', sortOrder: 4, isActive: 1 }
    ];

    for (const item of galleryItems) {
      await prisma.galleryImage.create({ data: item });
    }

    // Seed FAQs
    const faqs = [
      { question: 'How often should I visit the dentist?', answer: 'We recommend visiting the dentist every six months for regular checkups and cleanings.', category: 'general', sortOrder: 1, isActive: 1 },
      { question: 'Do you accept insurance?', answer: 'Yes, we accept most major dental insurance plans. Please contact our office to verify your coverage.', category: 'general', sortOrder: 2, isActive: 1 },
      { question: 'What should I do in a dental emergency?', answer: 'Call our emergency line immediately. For after-hours emergencies, please visit the nearest emergency room.', category: 'general', sortOrder: 3, isActive: 1 },
      { question: 'How long does teeth whitening last?', answer: 'Professional teeth whitening typically lasts 1-3 years with proper care and maintenance.', category: 'general', sortOrder: 4, isActive: 1 }
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }

    // Seed settings
    const settings = [
      { key: 'clinic_name', value: 'Your Dental Clinic' },
      { key: 'clinic_phone', value: '+1 (555) 000-0000' },
      { key: 'clinic_email', value: 'info@yourclinic.com' },
      { key: 'clinic_address', value: 'Your Clinic Address, City, Country' },
      { key: 'clinic_hours', value: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM, Sun: Closed' },
      { key: 'site_description', value: 'Your Dental Clinic provides comprehensive dental care services including general dentistry, cosmetic dentistry, dental implants, and orthodontics.' },
      { key: 'site_keywords', value: 'dentist, dental clinic, teeth whitening, dental implants, orthodontics, cosmetic dentistry' }
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    console.log('Database seeded successfully!');
    console.log('Default admin credentials: admin / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
