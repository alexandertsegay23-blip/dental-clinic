import { initDatabase, create } from './storage';
import { hashPassword } from './auth';

export async function seedDatabase() {
  await initDatabase();

  // Seed admin user
  const adminPasswordHash = await hashPassword('admin123');
  await create('admin_users', {
    username: 'admin',
    password_hash: adminPasswordHash,
    role: 'admin',
    created_at: new Date().toISOString()
  });

  // Seed services
  const services = [
    { name: 'General Dentistry', description: 'Comprehensive dental care including cleanings, fillings, and preventive treatments.', duration: '60 min', price: 150, icon_name: 'smile', benefits: 'Removes plaque, Prevents cavities', is_active: 1 },
    { name: 'Cosmetic Dentistry', description: 'Transform your smile with veneers, whitening, and bonding treatments.', duration: '90 min', price: 500, icon_name: 'sparkles', benefits: 'Whitens teeth, Boosts confidence', is_active: 1 },
    { name: 'Dental Implants', description: 'Permanent tooth replacement solutions that look and feel natural.', duration: '120 min', price: 2500, icon_name: 'shield', benefits: 'Permanent solution, Natural look', is_active: 1 },
    { name: 'Orthodontics', description: 'Straighten your teeth with modern braces and clear aligners.', duration: '180 min', price: 3000, icon_name: 'smile', benefits: 'Straightens teeth, Improves bite', is_active: 1 },
    { name: 'Teeth Whitening', description: 'Professional whitening for a brighter, more confident smile.', duration: '45 min', price: 300, icon_name: 'sparkles', benefits: 'Brightens smile, Quick results', is_active: 1 },
    { name: 'Emergency Care', description: '24/7 emergency dental services for urgent dental issues.', duration: '30 min', price: 200, icon_name: 'heart', benefits: '24/7 support, Immediate relief', is_active: 1 }
  ];

  for (const service of services) {
    await create('services', { ...service, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any);
  }

  // Seed doctors
  const doctors = [
    { name: 'Dr. Sarah Johnson', qualifications: 'DDS, Harvard School of Dental Medicine', biography: 'With over 15 years of experience, Dr. Johnson provides comprehensive dental care with a gentle touch.', years_experience: 15, photo_url: '/images/doctor-1.jpg', is_active: 1 },
    { name: 'Dr. Michael Chen', qualifications: 'DDS, UCLA School of Dentistry', biography: 'Dr. Chen is a renowned cosmetic dentist specializing in smile makeovers and veneers.', years_experience: 12, photo_url: '/images/doctor-2.jpg', is_active: 1 },
    { name: 'Dr. Emily Rodriguez', qualifications: 'DDS, Columbia University', biography: 'Dr. Rodriguez is a board-certified orthodontist passionate about creating perfect smiles.', years_experience: 10, photo_url: '/images/doctor-3.jpg', is_active: 1 },
    { name: 'Dr. James Wilson', qualifications: 'DDS, NYU College of Dentistry', biography: 'Dr. Wilson specializes in complex extractions and dental implant procedures.', years_experience: 18, photo_url: '/images/doctor-4.jpg', is_active: 1 }
  ];

  for (const doctor of doctors) {
    await create('doctors', { ...doctor, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any);
  }

  // Seed testimonials
  const testimonials = [
    { patient_name: 'John Smith', treatment: 'General checkup', quote: 'Amazing experience! The staff was friendly and professional. My smile has never looked better.', rating: 5, is_approved: 1, created_at: new Date().toISOString() },
    { patient_name: 'Sarah Williams', treatment: 'Implants', quote: 'I was nervous about getting dental implants, but Dr. Chen made the whole process comfortable. Highly recommend!', rating: 5, is_approved: 1, created_at: new Date().toISOString() },
    { patient_name: 'Michael Brown', treatment: 'Cleaning', quote: 'Best dental clinic in the area. Clean facilities, modern equipment, and excellent care.', rating: 5, is_approved: 1, created_at: new Date().toISOString() },
    { patient_name: 'Emily Davis', treatment: 'Orthodontics', quote: 'The orthodontic treatment changed my life. I can finally smile with confidence!', rating: 5, is_approved: 1, created_at: new Date().toISOString() }
  ];

  for (const testimonial of testimonials) {
    await create('testimonials', testimonial as any);
  }

  // Seed gallery
  const galleryItems = [
    { title: 'Modern Reception Area', url: '/images/gallery-1.jpg', alt_text: 'Our welcoming reception area', description: 'Modern reception area', category: 'general', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
    { title: 'Treatment Room', url: '/images/gallery-2.jpg', alt_text: 'State-of-the-art treatment rooms', description: 'Treatment room', category: 'general', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
    { title: 'Smile Makeover', url: '/images/gallery-3.jpg', alt_text: 'Before and after smile transformation', description: 'Smile makeover', category: 'general', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },
    { title: 'Dental Equipment', url: '/images/gallery-4.jpg', alt_text: 'Latest dental technology', description: 'Dental equipment', category: 'general', sort_order: 4, is_active: 1, created_at: new Date().toISOString() }
  ];

  for (const item of galleryItems) {
    await create('gallery', item as any);
  }

  // Seed FAQs
  const faqs = [
    { question: 'How often should I visit the dentist?', answer: 'We recommend visiting the dentist every six months for regular checkups and cleanings.', category: 'general', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
    { question: 'Do you accept insurance?', answer: 'Yes, we accept most major dental insurance plans. Please contact our office to verify your coverage.', category: 'general', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
    { question: 'What should I do in a dental emergency?', answer: 'Call our emergency line immediately. For after-hours emergencies, please visit the nearest emergency room.', category: 'general', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },
    { question: 'How long does teeth whitening last?', answer: 'Professional teeth whitening typically lasts 1-3 years with proper care and maintenance.', category: 'general', sort_order: 4, is_active: 1, created_at: new Date().toISOString() }
  ];

  for (const faq of faqs) {
    await create('faqs', faq as any);
  }

  // Seed settings - MATCH the keys used in components
  const settings = [
    { key: 'clinic_name', value: 'Ethio Smile Dental Clinic' },
    { key: 'clinic_phone', value: '+251 911 234 567' },
    { key: 'clinic_email', value: 'info@ethiosmile.com' },
    { key: 'clinic_address', value: 'Bole Road, Addis Ababa, Ethiopia' },
    { key: 'clinic_whatsapp', value: '+251911234567' },
    { key: 'clinic_working_hours', value: 'Mon – Fri: 08:00 – 18:00, Sat: 09:00 – 14:00, Sun: Closed' },
    { key: 'google_maps_embed_url', value: '' },
    { key: 'site_description', value: 'Ethio Smile Dental Clinic provides comprehensive dental care services including general dentistry, cosmetic dentistry, dental implants, and orthodontics. Experience premium dental care in Ethiopia.' },
    { key: 'site_keywords', value: 'dentist, dental clinic, teeth whitening, dental implants, orthodontics, cosmetic dentistry, Ethiopia, Addis Ababa' },
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
    { key: 'afromessage_base_url', value: 'https://api.afromessage.com/api' }
  ];

  for (const setting of settings) {
    await create('settings', setting as any);
  }

  console.log('Database seeded successfully!');
  console.log('Default admin credentials: admin / admin123');
}
