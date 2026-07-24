import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'clinic.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Define strict interfaces for all tables
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export interface Session {
  id: number;
  token: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

export interface Patient {
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
}

export interface Service {
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
}

export interface Doctor {
  id: number;
  name: string;
  qualifications: string;
  biography: string;
  years_experience: number;
  photo_url: string;
  is_active: number;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id?: number;
  service_id: number;
  date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  remind_sms?: boolean;
  remind_whatsapp?: boolean;
  reminder_sent?: boolean;
  sms_confirmed?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  patient_name: string;
  treatment: string;
  quote: string;
  rating: number;
  is_approved: number;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  url: string;
  alt_text: string;
  description: string;
  category: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_color: string;
  author: string;
  is_published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BeforeAfter {
  id: number;
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DoctorSocial {
  id: number;
  doctor_id: number;
  platform: string;
  url: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface Database {
  admin_users: AdminUser[];
  sessions: Session[];
  patients: Patient[];
  services: Service[];
  doctors: Doctor[];
  doctor_social: DoctorSocial[];
  appointments: Appointment[];
  testimonials: Testimonial[];
  gallery: GalleryImage[];
  blog_posts: BlogPost[];
  before_after: BeforeAfter[];
  faqs: FAQ[];
  contact_submissions: ContactSubmission[];
  settings: Setting[];
}

const defaultData: Database = {
  admin_users: [],
  sessions: [],
  patients: [],
  services: [],
  doctors: [],
  doctor_social: [],
  appointments: [],
  testimonials: [],
  gallery: [],
  blog_posts: [],
  before_after: [],
  faqs: [],
  contact_submissions: [],
  settings: []
};

// Very basic mutex for JSON file writes to prevent race conditions during concurrent API requests
let isWriting = false;
const writeQueue: Array<() => void> = [];

function processQueue() {
  if (writeQueue.length > 0 && !isWriting) {
    const nextTask = writeQueue.shift();
    if (nextTask) nextTask();
  }
}

function readData(): Database {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf-8');
      return JSON.parse(data) as Database;
    }
  } catch (err) {
    console.error('Error reading JSON DB', err);
  }
  return { ...defaultData };
}

function writeData(data: Database): Promise<void> {
  return new Promise((resolve) => {
    const task = () => {
      isWriting = true;
      try {
        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('Error writing JSON DB', err);
      } finally {
        isWriting = false;
        resolve();
        processQueue();
      }
    };
    writeQueue.push(task);
    processQueue();
  });
}

export async function initDatabase() {
  const data = readData();
  
  if (data.services.length === 0) {
    data.services = [
      { id: 1, name: 'Teeth Cleaning', description: 'Professional dental cleaning.', duration: '45 min', price: 500, icon_name: 'smile', benefits: 'Removes plaque', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ];
    await writeData(data);
  }
  // Simplified seeding for brevity, existing data is preserved by readData
}

// Map of table names to their Types
type TableTypeMap = {
  admin_users: AdminUser;
  sessions: Session;
  patients: Patient;
  services: Service;
  doctors: Doctor;
  doctor_social: DoctorSocial;
  appointments: Appointment;
  testimonials: Testimonial;
  gallery: GalleryImage;
  blog_posts: BlogPost;
  before_after: BeforeAfter;
  faqs: FAQ;
  contact_submissions: ContactSubmission;
  settings: Setting;
};

// Generic CRUD operations
export function getAll<K extends keyof Database>(table: K): Database[K] {
  const data = readData();
  return data[table];
}

export function getById<K extends keyof Database>(table: K, id: number): TableTypeMap[K] | undefined {
  const items = getAll(table) as Array<{ id: number }>;
  return items.find(item => item.id === id) as TableTypeMap[K] | undefined;
}

export async function create<K extends keyof Database>(
  table: K, 
  item: Omit<TableTypeMap[K], 'id'>
): Promise<TableTypeMap[K]> {
  const data = readData();
  const items = (data[table] as Array<{ id: number }>);
  const newItem = { ...item, id: Date.now() } as unknown as TableTypeMap[K];
  (data[table] as Array<any>).push(newItem);
  await writeData(data);
  return newItem;
}

export async function update<K extends keyof Database>(
  table: K, 
  id: number, 
  updates: Partial<TableTypeMap[K]>
): Promise<TableTypeMap[K] | undefined> {
  const data = readData();
  const items = data[table] as Array<{ id: number }>;
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  
  items[index] = { ...items[index], ...updates };
  await writeData(data);
  return items[index] as TableTypeMap[K];
}

export async function remove<K extends keyof Database>(table: K, id: number): Promise<boolean> {
  const data = readData();
  const items = data[table] as Array<{ id: number }>;
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  items.splice(index, 1);
  await writeData(data);
  return true;
}

export function getSetting(key: string): string | undefined {
  const data = readData();
  const setting = data.settings.find(s => s.key === key);
  return setting?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const data = readData();
  const existingIndex = data.settings.findIndex(s => s.key === key);
  if (existingIndex >= 0) {
    data.settings[existingIndex].value = value;
  } else {
    data.settings.push({ key, value });
  }
  await writeData(data);
}
