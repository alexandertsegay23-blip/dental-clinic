import { getCurrentUser } from '@/lib/auth';
import { getStats } from '@/lib/repository';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  // Fetch stats server-side
  let stats;
  try {
    stats = await getStats();
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    stats = {
      appointments: { total: 0, pending: 0, confirmed: 0, cancelled: 0 },
      patients: { total: 0 },
      services: { total: 0 },
      doctors: { total: 0 },
      testimonials: { total: 0, pending: 0 },
      blog: { total: 0, published: 0 },
      gallery: { total: 0 },
      faqs: { total: 0 },
      contact: { total: 0, new: 0 },
    };
  }

  return <AdminDashboardClient initialStats={stats} user={user} />;
}
