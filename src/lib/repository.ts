import prisma from './prisma';

// Generic types for repository operations
export type TableName = 
  | 'admin_users' 
  | 'sessions' 
  | 'patients' 
  | 'services' 
  | 'doctors' 
  | 'doctor_social' 
  | 'appointments' 
  | 'testimonials' 
  | 'gallery' 
  | 'blog_posts' 
  | 'before_after' 
  | 'faqs' 
  | 'contact_submissions' 
  | 'settings'
  | 'password_reset_tokens';

// ============================================
// ADMIN USERS
// ============================================
export async function getAdminUsers() {
  return prisma.adminUser.findMany();
}

export async function getAdminUserById(id: number) {
  return prisma.adminUser.findUnique({ where: { id } });
}

export async function getAdminUserByUsername(username: string) {
  return prisma.adminUser.findUnique({ where: { username } });
}

export async function createAdminUser(data: {
  username: string;
  password_hash: string;
  role?: string;
}) {
  return prisma.adminUser.create({
    data: {
      username: data.username,
      passwordHash: data.password_hash,
      role: data.role || 'admin',
    },
  });
}

export async function updateAdminUser(id: number, data: Partial<{
  username: string;
  password_hash: string;
  role: string;
}>) {
  return prisma.adminUser.update({
    where: { id },
    data: {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.password_hash !== undefined && { passwordHash: data.password_hash }),
      ...(data.role !== undefined && { role: data.role }),
    },
  });
}

export async function deleteAdminUser(id: number) {
  return prisma.adminUser.delete({ where: { id } });
}

// ============================================
// SESSIONS
// ============================================
export async function getSessions() {
  return prisma.session.findMany();
}

export async function getSessionByToken(token: string) {
  return prisma.session.findUnique({ where: { token } });
}

export async function createSession(data: {
  token: string;
  user_id: number;
  expires_at: string;
  remember_me?: boolean;
}) {
  return prisma.session.create({
    data: {
      token: data.token,
      userId: data.user_id,
      expiresAt: new Date(data.expires_at),
      rememberMe: data.remember_me || false,
    },
  });
}

export async function deleteSession(id: number) {
  return prisma.session.delete({ where: { id } });
}

export async function deleteSessionByToken(token: string) {
  return prisma.session.delete({ where: { token } });
}

export async function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}

// ============================================
// PASSWORD RESET TOKENS
// ============================================
export async function createPasswordResetToken(data: {
  user_id: number;
  token: string;
  expires_at: string;
}) {
  return prisma.passwordResetToken.create({
    data: {
      userId: data.user_id,
      token: data.token,
      expiresAt: new Date(data.expires_at),
    },
  });
}

export async function getPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({ 
    where: { token },
    include: { user: true },
  });
}

export async function markPasswordResetTokenUsed(id: number) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { used: true },
  });
}

export async function deletePasswordResetToken(id: number) {
  return prisma.passwordResetToken.delete({ where: { id } });
}

// ============================================
// PATIENTS
// ============================================
export async function getPatients() {
  return prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getPatientById(id: number) {
  return prisma.patient.findUnique({ where: { id } });
}

export async function createPatient(data: Omit<{
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  dob?: string;
  medical_history?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  allergies?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}, 'id' | 'created_at' | 'updated_at'>) {
  return prisma.patient.create({
    data: {
      fullName: data.full_name,
      phone: data.phone,
      email: data.email,
      dob: data.dob,
      medicalHistory: data.medical_history,
      dateOfBirth: data.date_of_birth,
      gender: data.gender,
      address: data.address,
      emergencyContact: data.emergency_contact,
      emergencyPhone: data.emergency_phone,
      allergies: data.allergies,
      notes: data.notes,
    },
  });
}

export async function updatePatient(id: number, data: Partial<{
  full_name: string;
  phone: string;
  email: string;
  dob: string;
  medical_history: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  allergies: string;
  notes: string;
}>) {
  return prisma.patient.update({
    where: { id },
    data: {
      ...(data.full_name !== undefined && { fullName: data.full_name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.dob !== undefined && { dob: data.dob }),
      ...(data.medical_history !== undefined && { medicalHistory: data.medical_history }),
      ...(data.date_of_birth !== undefined && { dateOfBirth: data.date_of_birth }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.emergency_contact !== undefined && { emergencyContact: data.emergency_contact }),
      ...(data.emergency_phone !== undefined && { emergencyPhone: data.emergency_phone }),
      ...(data.allergies !== undefined && { allergies: data.allergies }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
}

export async function deletePatient(id: number) {
  return prisma.patient.delete({ where: { id } });
}

// ============================================
// SERVICES
// ============================================
export async function getServices() {
  return prisma.service.findMany({ orderBy: { id: 'asc' } });
}

export async function getServiceById(id: number) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(data: Omit<{
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  icon_name: string;
  benefits: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}, 'id' | 'created_at' | 'updated_at'>) {
  return prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      iconName: data.icon_name,
      benefits: data.benefits,
      isActive: data.is_active ?? 1,
    },
  });
}

export async function updateService(id: number, data: Partial<{
  name: string;
  description: string;
  duration: string;
  price: number;
  icon_name: string;
  benefits: string;
  is_active: number;
}>) {
  return prisma.service.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.icon_name !== undefined && { iconName: data.icon_name }),
      ...(data.benefits !== undefined && { benefits: data.benefits }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
    },
  });
}

export async function deleteService(id: number) {
  return prisma.service.delete({ where: { id } });
}

// ============================================
// DOCTORS
// ============================================
export async function getDoctors() {
  return prisma.doctor.findMany({ orderBy: { id: 'asc' } });
}

export async function getDoctorById(id: number) {
  return prisma.doctor.findUnique({ 
    where: { id },
    include: { doctorSocial: true },
  });
}

export async function createDoctor(data: Omit<{
  id: number;
  name: string;
  qualifications: string;
  biography: string;
  years_experience: number;
  photo_url: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}, 'id' | 'created_at' | 'updated_at'>) {
  return prisma.doctor.create({
    data: {
      name: data.name,
      qualifications: data.qualifications,
      biography: data.biography,
      yearsExperience: data.years_experience,
      photoUrl: data.photo_url,
      isActive: data.is_active ?? 1,
    },
  });
}

export async function updateDoctor(id: number, data: Partial<{
  name: string;
  qualifications: string;
  biography: string;
  years_experience: number;
  photo_url: string;
  is_active: number;
}>) {
  return prisma.doctor.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.qualifications !== undefined && { qualifications: data.qualifications }),
      ...(data.biography !== undefined && { biography: data.biography }),
      ...(data.years_experience !== undefined && { yearsExperience: data.years_experience }),
      ...(data.photo_url !== undefined && { photoUrl: data.photo_url }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
    },
  });
}

export async function deleteDoctor(id: number) {
  return prisma.doctor.delete({ where: { id } });
}

// ============================================
// DOCTOR SOCIAL
// ============================================
export async function getDoctorSocial(doctorId: number) {
  return prisma.doctorSocial.findMany({ where: { doctorId } });
}

export async function createDoctorSocial(data: {
  doctor_id: number;
  platform: string;
  url: string;
}) {
  return prisma.doctorSocial.create({
    data: {
      doctorId: data.doctor_id,
      platform: data.platform,
      url: data.url,
    },
  });
}

export async function deleteDoctorSocial(id: number) {
  return prisma.doctorSocial.delete({ where: { id } });
}

// ============================================
// APPOINTMENTS
// ============================================
export async function getAppointments(filters?: {
  status?: string;
  search?: string;
}) {
  const where: any = {};
  
  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status;
  }
  
  if (filters?.search) {
    where.OR = [
      { patient: { fullName: { contains: filters.search, mode: 'insensitive' } } },
      { patient: { phone: { contains: filters.search, mode: 'insensitive' } } },
      { service: { name: { contains: filters.search, mode: 'insensitive' } } },
      { date: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.appointment.findMany({
    where,
    include: {
      patient: true,
      service: true,
      doctor: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAppointmentById(id: number) {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      service: true,
      doctor: true,
    },
  });
}

export async function createAppointment(data: {
  patient_id: number;
  service_id: number;
  doctor_id?: number | null;
  date: string;
  time_slot: string;
  status?: string;
  notes?: string;
  remind_sms?: boolean;
  remind_whatsapp?: boolean;
}) {
  return prisma.appointment.create({
    data: {
      patientId: data.patient_id,
      serviceId: data.service_id,
      doctorId: data.doctor_id ?? undefined,
      date: data.date,
      timeSlot: data.time_slot,
      status: data.status || 'pending',
      notes: data.notes,
      remindSms: data.remind_sms ?? false,
      remindWhatsapp: data.remind_whatsapp ?? false,
    },
    include: {
      patient: true,
      service: true,
      doctor: true,
    },
  });
}

export async function updateAppointment(id: number, data: Partial<{
  status: string;
  notes: string;
  remind_sms: boolean;
  remind_whatsapp: boolean;
  reminder_sent: boolean;
  sms_confirmed: boolean;
}>) {
  return prisma.appointment.update({
    where: { id },
    data: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.remind_sms !== undefined && { remindSms: data.remind_sms }),
      ...(data.remind_whatsapp !== undefined && { remindWhatsapp: data.remind_whatsapp }),
      ...(data.reminder_sent !== undefined && { reminderSent: data.reminder_sent }),
      ...(data.sms_confirmed !== undefined && { smsConfirmed: data.sms_confirmed }),
    },
    include: {
      patient: true,
      service: true,
      doctor: true,
    },
  });
}

export async function deleteAppointment(id: number) {
  return prisma.appointment.delete({ where: { id } });
}

// ============================================
// TESTIMONIALS
// ============================================
export async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getTestimonialById(id: number) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function createTestimonial(data: {
  patient_name: string;
  treatment: string;
  quote: string;
  rating: number;
  is_approved?: number;
}) {
  return prisma.testimonial.create({
    data: {
      patientName: data.patient_name,
      treatment: data.treatment,
      quote: data.quote,
      rating: data.rating,
      isApproved: data.is_approved ?? 0,
    },
  });
}

export async function updateTestimonial(id: number, data: Partial<{
  patient_name: string;
  treatment: string;
  quote: string;
  rating: number;
  is_approved: number;
}>) {
  return prisma.testimonial.update({
    where: { id },
    data: {
      ...(data.patient_name !== undefined && { patientName: data.patient_name }),
      ...(data.treatment !== undefined && { treatment: data.treatment }),
      ...(data.quote !== undefined && { quote: data.quote }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.is_approved !== undefined && { isApproved: data.is_approved }),
    },
  });
}

export async function deleteTestimonial(id: number) {
  return prisma.testimonial.delete({ where: { id } });
}

// ============================================
// GALLERY
// ============================================
export async function getGallery() {
  return prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getGalleryById(id: number) {
  return prisma.galleryImage.findUnique({ where: { id } });
}

export async function createGalleryImage(data: {
  title: string;
  url: string;
  alt_text: string;
  description: string;
  category: string;
  sort_order?: number;
  is_active?: number;
}) {
  return prisma.galleryImage.create({
    data: {
      title: data.title,
      url: data.url,
      altText: data.alt_text,
      description: data.description,
      category: data.category,
      sortOrder: data.sort_order ?? 0,
      isActive: data.is_active ?? 1,
    },
  });
}

export async function updateGalleryImage(id: number, data: Partial<{
  title: string;
  url: string;
  alt_text: string;
  description: string;
  category: string;
  sort_order: number;
  is_active: number;
}>) {
  return prisma.galleryImage.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.alt_text !== undefined && { altText: data.alt_text }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.sort_order !== undefined && { sortOrder: data.sort_order }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
    },
  });
}

export async function deleteGalleryImage(id: number) {
  return prisma.galleryImage.delete({ where: { id } });
}

// ============================================
// BLOG POSTS
// ============================================
export async function getBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getBlogPostById(id: number) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_color: string;
  author: string;
  is_published?: number;
  published_at?: string | null;
}) {
  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverColor: data.cover_color,
      author: data.author,
      isPublished: data.is_published ?? 0,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
    },
  });
}

export async function updateBlogPost(id: number, data: Partial<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_color: string;
  author: string;
  is_published: number;
  published_at: string | null;
}>) {
  return prisma.blogPost.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.cover_color !== undefined && { coverColor: data.cover_color }),
      ...(data.author !== undefined && { author: data.author }),
      ...(data.is_published !== undefined && { isPublished: data.is_published }),
      ...(data.published_at !== undefined && { publishedAt: data.published_at ? new Date(data.published_at) : null }),
    },
  });
}

export async function deleteBlogPost(id: number) {
  return prisma.blogPost.delete({ where: { id } });
}

// ============================================
// BEFORE/AFTER
// ============================================
export async function getBeforeAfter() {
  return prisma.beforeAfter.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getBeforeAfterById(id: number) {
  return prisma.beforeAfter.findUnique({ where: { id } });
}

export async function createBeforeAfter(data: {
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  sort_order?: number;
  is_active?: number;
}) {
  return prisma.beforeAfter.create({
    data: {
      title: data.title,
      description: data.description,
      beforeImageUrl: data.before_image_url,
      afterImageUrl: data.after_image_url,
      sortOrder: data.sort_order ?? 0,
      isActive: data.is_active ?? 1,
    },
  });
}

export async function updateBeforeAfter(id: number, data: Partial<{
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  sort_order: number;
  is_active: number;
}>) {
  return prisma.beforeAfter.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.before_image_url !== undefined && { beforeImageUrl: data.before_image_url }),
      ...(data.after_image_url !== undefined && { afterImageUrl: data.after_image_url }),
      ...(data.sort_order !== undefined && { sortOrder: data.sort_order }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
    },
  });
}

export async function deleteBeforeAfter(id: number) {
  return prisma.beforeAfter.delete({ where: { id } });
}

// ============================================
// FAQS
// ============================================
export async function getFaqs() {
  return prisma.fAQ.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getFaqById(id: number) {
  return prisma.fAQ.findUnique({ where: { id } });
}

export async function createFaq(data: {
  question: string;
  answer: string;
  category: string;
  sort_order?: number;
  is_active?: number;
}) {
  return prisma.fAQ.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category,
      sortOrder: data.sort_order ?? 0,
      isActive: data.is_active ?? 1,
    },
  });
}

export async function updateFaq(id: number, data: Partial<{
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: number;
}>) {
  return prisma.fAQ.update({
    where: { id },
    data: {
      ...(data.question !== undefined && { question: data.question }),
      ...(data.answer !== undefined && { answer: data.answer }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.sort_order !== undefined && { sortOrder: data.sort_order }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
    },
  });
}

export async function deleteFaq(id: number) {
  return prisma.fAQ.delete({ where: { id } });
}

// ============================================
// CONTACT SUBMISSIONS
// ============================================
export async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getContactSubmissionById(id: number) {
  return prisma.contactSubmission.findUnique({ where: { id } });
}

export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    },
  });
}

export async function updateContactSubmission(id: number, data: Partial<{
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
}>) {
  return prisma.contactSubmission.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.message !== undefined && { message: data.message }),
      ...(data.is_read !== undefined && { isRead: data.is_read }),
    },
  });
}

export async function deleteContactSubmission(id: number) {
  return prisma.contactSubmission.delete({ where: { id } });
}

// ============================================
// SETTINGS
// ============================================
export async function getSettings() {
  return prisma.setting.findMany();
}

export async function getSetting(key: string) {
  return prisma.setting.findUnique({ where: { key } });
}

export async function setSetting(key: string, value: string) {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function deleteSetting(key: string) {
  return prisma.setting.delete({ where: { key } });
}

// ============================================
// STATS
// ============================================
export async function getStats() {
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

  return {
    appointments: {
      total: appointments.length,
      pending: appointments.filter((a: any) => a.status === 'pending').length,
      confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
      cancelled: appointments.filter((a: any) => a.status === 'cancelled').length,
    },
    patients: { total: patients.length },
    services: { total: services.length },
    doctors: { total: doctors.length },
    testimonials: {
      total: testimonials.length,
      pending: testimonials.filter((t: any) => t.isApproved === 0).length,
    },
    blog: {
      total: blog.length,
      published: blog.filter((p: any) => p.isPublished === 1).length,
    },
    gallery: { total: gallery.length },
    faqs: { total: faqs.length },
    contact: {
      total: contact.length,
      new: contact.filter((c: any) => c.isRead === false).length,
    },
  };
}

// ============================================
// GENERIC CRUD (for backward compatibility)
// ============================================
export async function getAll<K extends TableName>(table: K): Promise<any[]> {
  switch (table) {
    case 'admin_users': return getAdminUsers();
    case 'sessions': return getSessions();
    case 'patients': return getPatients();
    case 'services': return getServices();
    case 'doctors': return getDoctors();
    case 'doctor_social': return prisma.doctorSocial.findMany();
    case 'appointments': return getAppointments();
    case 'testimonials': return getTestimonials();
    case 'gallery': return getGallery();
    case 'blog_posts': return getBlogPosts();
    case 'before_after': return getBeforeAfter();
    case 'faqs': return getFaqs();
    case 'contact_submissions': return getContactSubmissions();
    case 'settings': return getSettings();
    case 'password_reset_tokens': return prisma.passwordResetToken.findMany();
    default: throw new Error(`Unknown table: ${table}`);
  }
}

export async function getById<K extends TableName>(table: K, id: number): Promise<any | undefined> {
  switch (table) {
    case 'admin_users': return getAdminUserById(id);
    case 'patients': return getPatientById(id);
    case 'services': return getServiceById(id);
    case 'doctors': return getDoctorById(id);
    case 'appointments': return getAppointmentById(id);
    case 'testimonials': return getTestimonialById(id);
    case 'gallery': return getGalleryById(id);
    case 'blog_posts': return getBlogPostById(id);
    case 'before_after': return getBeforeAfterById(id);
    case 'faqs': return getFaqById(id);
    case 'contact_submissions': return getContactSubmissionById(id);
    case 'settings': return getSetting(id.toString());
    default: throw new Error(`Unknown table: ${table}`);
  }
}

export async function createRecord<K extends TableName>(
  table: K, 
  item: Omit<any, 'id'>
): Promise<any> {
  switch (table) {
    case 'admin_users': return createAdminUser(item as any);
    case 'patients': return createPatient(item as any);
    case 'services': return createService(item as any);
    case 'doctors': return createDoctor(item as any);
    case 'appointments': return createAppointment(item as any);
    case 'testimonials': return createTestimonial(item as any);
    case 'gallery': return createGalleryImage(item as any);
    case 'blog_posts': return createBlogPost(item as any);
    case 'before_after': return createBeforeAfter(item as any);
    case 'faqs': return createFaq(item as any);
    case 'contact_submissions': return createContactSubmission(item as any);
    case 'settings': return setSetting(item.key, item.value);
    case 'sessions': return createSession(item as any);
    case 'password_reset_tokens': return createPasswordResetToken(item as any);
    default: throw new Error(`Unknown table: ${table}`);
  }
}

export async function updateRecord<K extends TableName>(
  table: K, 
  id: number, 
  updates: Partial<any>
): Promise<any | undefined> {
  switch (table) {
    case 'admin_users': return updateAdminUser(id, updates);
    case 'patients': return updatePatient(id, updates);
    case 'services': return updateService(id, updates);
    case 'doctors': return updateDoctor(id, updates);
    case 'appointments': return updateAppointment(id, updates);
    case 'testimonials': return updateTestimonial(id, updates);
    case 'gallery': return updateGalleryImage(id, updates);
    case 'blog_posts': return updateBlogPost(id, updates);
    case 'before_after': return updateBeforeAfter(id, updates);
    case 'faqs': return updateFaq(id, updates);
    case 'contact_submissions': return updateContactSubmission(id, updates);
    case 'settings': return setSetting(id.toString(), updates.value);
    default: throw new Error(`Unknown table: ${table}`);
  }
}

export async function removeRecord<K extends TableName>(table: K, id: number): Promise<boolean> {
  try {
    switch (table) {
      case 'admin_users': await deleteAdminUser(id); return true;
      case 'patients': await deletePatient(id); return true;
      case 'services': await deleteService(id); return true;
      case 'doctors': await deleteDoctor(id); return true;
      case 'appointments': await deleteAppointment(id); return true;
      case 'testimonials': await deleteTestimonial(id); return true;
      case 'gallery': await deleteGalleryImage(id); return true;
      case 'blog_posts': await deleteBlogPost(id); return true;
      case 'before_after': await deleteBeforeAfter(id); return true;
      case 'faqs': await deleteFaq(id); return true;
      case 'contact_submissions': await deleteContactSubmission(id); return true;
      case 'settings': await deleteSetting(id.toString()); return true;
      case 'sessions': await prisma.session.delete({ where: { id } }); return true;
      case 'password_reset_tokens': await prisma.passwordResetToken.delete({ where: { id } }); return true;
      default: throw new Error(`Unknown table: ${table}`);
    }
  } catch {
    return false;
  }
}
