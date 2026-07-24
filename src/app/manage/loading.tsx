import { LayoutDashboard, Calendar, Users, FileText, Star, MessageSquare } from 'lucide-react';

export default function ManageLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:h-screen lg:flex-row">
      {/* Sidebar skeleton */}
      <aside className="fixed inset-y-0 left-0 z-50 flex h-screen min-h-0 w-64 flex-col overflow-hidden border-r border-border bg-surface lg:relative lg:z-auto">
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="h-6 w-24 bg-text/10 rounded animate-pulse" />
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto p-4 space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-text/5 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </nav>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
          <div className="h-6 w-32 bg-text/10 rounded animate-pulse" />
        </header>
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Stats grid skeleton */}
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
        </main>
      </div>
    </div>
  );
}
