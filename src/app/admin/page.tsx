'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  FileText, 
  Star, 
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  appointments: { total: number; pending: number; confirmed: number; cancelled: number };
  patients: { total: number };
  services: { total: number };
  doctors: { total: number };
  testimonials: { total: number; pending: number };
  blog: { total: number; published: number };
  gallery: { total: number };
  faqs: { total: number };
  contact: { total: number; new: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { title: 'Appointments', value: stats?.appointments.total || 0, icon: Calendar, href: '/admin/appointments', color: 'bg-blue-500', pending: stats?.appointments.pending },
    { title: 'Patients', value: stats?.patients.total || 0, icon: Users, href: '/admin/patients', color: 'bg-green-500' },
    { title: 'Services', value: stats?.services.total || 0, icon: FileText, href: '/admin/services', color: 'bg-purple-500' },
    { title: 'Doctors', value: stats?.doctors.total || 0, icon: Users, href: '/admin/doctors', color: 'bg-orange-500' },
    { title: 'Testimonials', value: stats?.testimonials.total || 0, icon: Star, href: '/admin/testimonials', color: 'bg-yellow-500', pending: stats?.testimonials.pending },
    { title: 'Blog Posts', value: stats?.blog.total || 0, icon: FileText, href: '/admin/blog', color: 'bg-indigo-500', published: stats?.blog.published },
    { title: 'Gallery', value: stats?.gallery.total || 0, icon: MessageSquare, href: '/admin/gallery', color: 'bg-pink-500' },
    { title: 'FAQs', value: stats?.faqs.total || 0, icon: MessageSquare, href: '/admin/faqs', color: 'bg-teal-500' },
    { title: 'Contact', value: stats?.contact.total || 0, icon: MessageSquare, href: '/admin/contact', color: 'bg-red-500', new: stats?.contact.new },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-text/60">Welcome to your clinic management panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-card-bg rounded-xl border border-border p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-text">{card.value}</p>
                  {card.pending !== undefined && card.pending > 0 && (
                    <p className="text-sm text-yellow-600 mt-1">{card.pending} pending</p>
                  )}
                  {card.published !== undefined && (
                    <p className="text-sm text-green-600 mt-1">{card.published} published</p>
                  )}
                  {card.new !== undefined && card.new > 0 && (
                    <p className="text-sm text-red-600 mt-1">{card.new} new</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${card.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={`text-[${card.color.replace('bg-', 'text-')}]`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card-bg rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-text-inverse rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Calendar size={18} />
            View Appointments
          </Link>
          <Link
            href="/admin/patients"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-text-inverse rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Users size={18} />
            Manage Patients
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-text-inverse rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText size={18} />
            Write Blog Post
          </Link>
        </div>
      </div>
    </div>
  );
}
