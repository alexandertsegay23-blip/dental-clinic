'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  FileText,
  Image,
  HelpCircle,
  Star,
  MessageSquare
} from 'lucide-react';

const menuItems = [
  { href: '/manage', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manage/appointments', label: 'Appointments', icon: Calendar },
  { href: '/manage/patients', label: 'Patients', icon: Users },
  { href: '/manage/services', label: 'Services', icon: Stethoscope },
  { href: '/manage/doctors', label: 'Doctors', icon: Users },
  { href: '/manage/testimonials', label: 'Testimonials', icon: Star },
  { href: '/manage/blog', label: 'Blog', icon: FileText },
  { href: '/manage/gallery', label: 'Gallery', icon: Image },
  { href: '/manage/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/manage/contact', label: 'Contact', icon: MessageSquare },
  { href: '/manage/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: { username: string };
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/manage/login');
  };

  // Don't show admin layout on login page
  if (pathname === '/manage/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:h-screen lg:flex-row">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-text/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex h-screen min-h-0 w-64 flex-col overflow-hidden border-r border-border bg-surface
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:relative lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/manage" className="text-xl font-bold text-primary">
            Admin Panel
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-muted hover:text-text"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/manage' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-background hover:text-text'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-border bg-surface p-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{user?.username}</p>
              <p className="text-xs text-text-muted">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Top bar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-muted hover:text-text"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold text-text">
              {menuItems.find(item =>
                item.href === pathname ||
                (item.href !== '/manage' && pathname.startsWith(item.href))
              )?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-primary hover:text-secondary transition-colors">
              View Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
