'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, Eye, Search, Download, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
  id: number;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  service_name: string;
  doctor_name: string;
  date: string;
  time_slot: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Export appointments to CSV
  const exportToCSV = () => {
    const headers = ['Patient Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Status', 'Notes', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...appointments.map(apt => [
        `"${apt.patient_name}"`,
        apt.patient_phone,
        apt.patient_email,
        `"${apt.service_name}"`,
        apt.date,
        apt.time_slot,
        apt.status,
        `"${(apt.notes || '').replace(/"/g, '""')}"`,
        apt.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  useEffect(() => {
    fetchAppointments();
  }, [filter, search]);

  const fetchAppointments = async () => {
    try {
      let url = '/api/admin/appointments';
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      if (params.toString()) url += '?' + params.toString();
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Appointments</h1>
          <p className="text-text/60">Manage patient appointments</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {/* View Toggle */}
          <div className="flex bg-card-bg rounded-lg border border-border p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === 'table' ? 'bg-primary text-text-inverse' : 'text-text-muted hover:text-text'
              }`}
            >
              <List size={16} /> Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === 'calendar' ? 'bg-primary text-text-inverse' : 'text-text-muted hover:text-text'
              }`}
            >
              <Grid size={16} /> Calendar
            </button>
          </div>
          
          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-text-inverse rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download size={16} /> Export CSV
          </button>
          
          {/* Status Filters */}
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Search by patient name, phone, service, or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-text-muted" />
            </button>
            <h3 className="text-lg font-semibold text-text">{monthYear}</h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-text-muted" />
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((day, idx) => {
                if (!day) return <div key={idx} />;
                
                const dayAppointments = getAppointmentsForDay(day);
                const isToday = day === new Date().getDate() && 
                  currentMonth.getMonth() === new Date().getMonth() && 
                  currentMonth.getFullYear() === new Date().getFullYear();
                
                return (
                  <div
                    key={idx}
                    className={`min-h-[80px] p-2 rounded-lg border ${
                      isToday ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-text'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={`w-full text-xs p-1 rounded truncate text-left ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {apt.time_slot} {apt.patient_name.split(' ')[0]}
                        </button>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-text-muted text-center">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      {viewMode === 'table' && (
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-text">{apt.patient_name}</div>
                      <div className="text-sm text-text-muted">{apt.patient_phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text">{apt.service_name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text">{apt.date}</div>
                    <div className="text-sm text-text-muted">{apt.time_slot}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="p-1 text-text-muted hover:text-primary transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, 'cancelled')}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Cancel"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-text/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-xl border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-text-muted hover:text-text"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <div>
                  <div className="font-medium text-text">{selectedAppointment.patient_name}</div>
                  <div className="text-sm text-text-muted">{selectedAppointment.patient_phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span className="text-sm text-text">{selectedAppointment.patient_email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-primary" />
                <span className="text-sm text-text">{selectedAppointment.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-primary" />
                <span className="text-sm text-text">{selectedAppointment.time_slot}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-text/70">{selectedAppointment.notes || 'No additional notes'}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {selectedAppointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      updateStatus(selectedAppointment.id, 'confirmed');
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-2 bg-green-600 text-text-inverse rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedAppointment.id, 'cancelled');
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-2 bg-red-600 text-text-inverse rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
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
