import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getStats } from '@/lib/repository';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  // Fetch stats server-side
  const stats = await getStats();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardClient initialStats={stats} user={user} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-text/10 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-text/10 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-card-bg rounded-xl border border-border p-6 animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-text/10 rounded" />
                <div className="h-8 w-16 bg-text/10 rounded" />
              </div>
              <div className="w-12 h-12 bg-text/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
