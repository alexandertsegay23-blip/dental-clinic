import { PrismaClient } from '../src/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '../site/.env' });

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaLibSql({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });
  console.log(`✅ Admin user created: ${adminUsername} / ${adminPassword}`);

  // Seed services
  const services = [
    { name: 'General Dentistry', description: 'Comprehensive dental care including cleanings, fillings, and preventive treatments.', duration: '60 min', price: 150, iconName: 'smile', benefits: 'Removes plaque, Prevents cavities' },
    { name: 'Cosmetic Dentistry', description: 'Transform your smile with veneers, whitening, and bonding treatments.', duration: '90 min', price: 500, iconName: 'sparkles', benefits: 'Whitens teeth, Boosts confidence' },
    { name: 'Dental Implants', description: 'Permanent tooth replacement solutions that look and feel natural.', duration: '120 min', price: 2500, iconName: 'shield', benefits: 'Permanent solution, Natural look' },
    { name: 'Orthodontics', description: 'Straighten your teeth with modern braces and clear aligners.', duration: '180 min', price: 3000, iconName: 'smile', benefits: 'Straightens teeth, Improves bite' },
    { name: 'Teeth Whitening', description: 'Professional whitening for a brighter, more confident smile.', duration: '45 min', price: 300, iconName: 'sparkles', benefits: 'Brightens smile, Quick results' },
    { name: 'Emergency Care', description: '24/7 emergency dental services for urgent dental issues.', duration: '30 min', price: 200, iconName: 'heart', benefits: '24/7 support, Immediate relief' },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: service,
      create: service,
    });
  }
  console.log('✅ Services seeded');

  // Seed doctors
  const doctors = [
    { name: 'Dr. Sarah Johnson', qualifications: 'DDS, Harvard School of Dental Medicine', biography: 'With over 15 years of experience, Dr. Johnson provides comprehensive dental care with a gentle touch.', yearsExperience: 15, photoUrl: '/images/doctor-1.jpg' },
    { name: 'Dr. Michael Chen', qualifications: 'DDS, UCLA School of Dentistry', biography: 'Dr. Chen is a renowned cosmetic dentist specializing in smile makeovers and veneers.', yearsExperience: 12, photoUrl: '/images/doctor-2.jpg' },
    { name: 'Dr. Emily Rodriguez', qualifications: 'DDS, Columbia University', biography: 'Dr. Rodriguez is a board-certified orthodontist passionate about creating perfect smiles.', yearsExperience: 10, photoUrl: '/images/doctor-3.jpg' },
    { name: 'Dr. James Wilson', qualifications: 'DDS, NYU College of Dentistry', biography: 'Dr. Wilson specializes in complex extractions and dental implant procedures.', yearsExperience: 18, photoUrl: '/images/doctor-4.jpg' },
  ];

  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { id: doctors.indexOf(doctor) + 1 },
      update: doctor,
      create: doctor,
    });
  }
  console.log('✅ Doctors seeded');

  // Seed testimonials
  const testimonials = [
    { patientName: 'John Smith', treatment: 'General checkup', quote: 'Amazing experience! The staff was friendly and professional. My smile has never looked better.', rating: 5 },
    { patientName: 'Sarah Williams', treatment: 'Implants', quote: 'I was nervous about getting dental implants, but Dr. Chen made the whole process comfortable. Highly recommend!', rating: 5 },
    { patientName: 'Michael Brown', treatment: 'Cleaning', quote: 'Best dental clinic in the area. Clean facilities, modern equipment, and excellent care.', rating: 5 },
    { patientName: 'Emily Davis', treatment: 'Orthodontics', quote: 'The orthodontic treatment changed my life. I can finally smile with confidence!', rating: 5 },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: { ...testimonial, isApproved: 1 } });
  }
  console.log('✅ Testimonials seeded');

  // Seed gallery
  const galleryItems = [
    { title: 'Modern Reception Area', url: '/images/gallery-1.jpg', altText: 'Our welcoming reception area', description: 'Modern reception area', category: 'general' },
    { title: 'Treatment Room', url: '/images/gallery-2.jpg', altText: 'State-of-the-art treatment rooms', description: 'Treatment room', category: 'general' },
    { title: 'Smile Makeover', url: '/images/gallery-3.jpg', altText: 'Before and after smile transformation', description: 'Smile makeover', category: 'general' },
    { title: 'Dental Equipment', url: '/images/gallery-4.jpg', altText: 'Latest dental technology', description: 'Dental equipment', category: 'general' },
  ];

  for (const item of galleryItems) {
    await prisma.galleryImage.create({ data: item });
  }
  console.log('✅ Gallery seeded');

  // Seed FAQs
  const faqs = [
    { question: 'How often should I visit the dentist?', answer: 'We recommend visiting the dentist every six months for regular checkups and cleanings.', category: 'general' },
    { question: 'Do you accept insurance?', answer: 'Yes, we accept most major dental insurance plans. Please contact our office to verify your coverage.', category: 'general' },
    { question: 'What should I do in a dental emergency?', answer: 'Call our emergency line immediately. For after-hours emergencies, please visit the nearest emergency room.', category: 'general' },
    { question: 'How long does teeth whitening last?', answer: 'Professional teeth whitening typically lasts 1-3 years with proper care and maintenance.', category: 'general' },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQs seeded');

  // Seed settings
  const settings = [
    { key: 'clinic_name', value: 'Ethio Smile Dental Clinic' },
    { key: 'clinic_phone', value: '+251 911 234 567' },
    { key: 'clinic_email', value: 'info@ethiosmile.com' },
    { key: 'clinic_address', value: 'Bole Road, Addis Ababa, Ethiopia' },
    { key: 'clinic_whatsapp', value: '+251911234567' },
    { key: 'clinic_working_hours', value: 'Mon – Fri: 08:00 – 18:00, Sat: 09:00 – 14:00, Sun: Closed' },
    { key: 'google_maps_embed_url', value: '' },
    { key: 'site_description', value: 'Ethio Smile Dental Clinic provides comprehensive dental care services including general dentistry, cosmetic dentistry, dental implants, and orthodontics.' },
    { key: 'site_keywords', value: 'dentist, dental clinic, teeth whitening, dental implants, orthodontics, cosmetic dentistry, Ethiopia' },
    { key: 'clinic_social_facebook', value: '' },
    { key: 'clinic_social_instagram', value: '' },
    { key: 'clinic_social_twitter', value: '' },
    { key: 'clinic_social_linkedin', value: '' },
    { key: 'tawk_to_property_id', value: '' },
    { key: 'reminder_enabled', value: 'true' },
    { key: 'reminder_sms_enabled', value: 'true' },
    { key: 'reminder_whatsapp_enabled', value: 'false' },
    { key: 'reminder_hours_before', value: '24' },
    { key: 'reminder_message', value: 'Reminder: You have an appointment scheduled with Ethio Smile Dental Clinic. Please confirm your attendance.' },
    { key: 'afromessage_api_key', value: '' },
    { key: 'afromessage_sender_id', value: 'EthioSmile' },
    { key: 'afromessage_base_url', value: 'https://api.afromessage.com/api' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Settings seeded');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📋 Admin Login:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
