'use client';

import { useEffect, useState } from 'react';
import { Search, Mail, Phone, User, MessageSquare, Eye, X } from 'lucide-react';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function ContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      const url = filter === 'all' ? '/api/admin/contact' : `/api/admin/contact?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(search.toLowerCase()) ||
    submission.email.toLowerCase().includes(search.toLowerCase()) ||
    submission.subject?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary text-lg">Loading contact submissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Contact Submissions</h1>
          <p className="text-text/60">Manage contact form submissions</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-text-inverse'
                  : 'bg-card-bg text-text-muted hover:bg-background'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search submissions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Submissions Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {submission.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-text">{submission.name}</div>
                        <div className="text-sm text-text-muted">{submission.phone || 'No phone'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text">{submission.email}</td>
                  <td className="px-6 py-4 text-sm text-text">{submission.subject || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="p-1 text-text-muted hover:text-primary transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      {submission.status === 'new' && (
                        <button
                          onClick={() => updateStatus(submission.id, 'read')}
                          className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-text/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-xl border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Message Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-text-muted hover:text-text"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <div>
                  <div className="font-medium text-text">{selectedSubmission.name}</div>
                  <div className="text-sm text-text-muted">{selectedSubmission.email}</div>
                </div>
              </div>
              {selectedSubmission.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-primary" />
                  <span className="text-sm text-text">{selectedSubmission.phone}</span>
                </div>
              )}
              {selectedSubmission.subject && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <span className="text-sm text-text">{selectedSubmission.subject}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MessageSquare size={18} className="text-primary mt-0.5" />
                <p className="text-sm text-text">{selectedSubmission.message}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {selectedSubmission.status === 'new' && (
                <button
                  onClick={() => {
                    updateStatus(selectedSubmission.id, 'read');
                    setSelectedSubmission(null);
                  }}
                  className="flex-1 py-2 bg-yellow-600 text-text-inverse rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedSubmission(null)}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-background transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
