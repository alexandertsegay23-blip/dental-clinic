'use client';

import React, { useEffect, useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import {
  Calendar, User, Phone, Mail, Clock, Check, ArrowRight, ArrowLeft,
  CalendarDays, Sparkles, Shield, Smile, Heart, Scan, Award, AlertCircle
} from '@/components/social-icons';
import { CheckCircle } from '@/components/social-icons';
import { useClinic } from '@/components/ClinicProvider';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  iconName: string;
  benefits: string;
  is_active: number;
}

type Step = 1 | 2 | 3 | 4;

interface FormData {
  serviceId: string;
  date: string;
  timeSlot: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  remindSms: boolean;
  remindWhatsapp: boolean;
}

const timeSlots = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
];

// Validation helpers
const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  // Accept various formats: +251..., 251..., 09..., 0...
  const cleaned = phone.replace(/[\s\-]/g, '');
  return /^(\+?251|251|0)?[19]\d{8}$/.test(cleaned);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

const steps = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Date & Time' },
  { num: 3, label: 'Your Info' },
  { num: 4, label: 'Confirm' },
];

const getServiceIcon = (name: string) => {
  if (!name) return Smile;
  const iconName = name.toLowerCase();
  switch (iconName) {
    case 'smile': return Smile;
    case 'sparkles': return Sparkles;
    case 'shield': return Shield;
    case 'heart': return Heart;
    case 'scan': return Scan;
    case 'award': return Award;
    default: return Smile;
  }
};

export function AppointmentForm() {
  const { settings } = useClinic();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    serviceId: '',
    date: '',
    timeSlot: '',
    fullName: '',
    email: '',
    phone: '',
    notes: '',
    remindSms: false,
    remindWhatsapp: false,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const selectedService = services.find(s => s.id.toString() === formData.serviceId);
  const ServiceIcon = formData.serviceId && selectedService ? getServiceIcon(selectedService.iconName || 'smile') : null;

  const handleNext = () => {
    // Validate step 3 before proceeding
    if (step === 3) {
      // Mark all fields as touched
      setTouched({ fullName: true, phone: true, email: true });
      if (!validateStep3()) {
        return;
      }
    }
    setStep(s => (s < 4 ? ((s + 1) as Step) : s));
  };
  const handleBack = () => setStep(s => (s > 1 ? ((s - 1) as Step) : s));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: parseInt(formData.serviceId),
          date: formData.date,
          time_slot: formData.timeSlot,
          notes: formData.notes || '',
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          remind_sms: formData.remindSms,
          remind_whatsapp: formData.remindWhatsapp,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        console.error('Failed to submit appointment');
        alert('Failed to submit appointment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      alert('Failed to submit appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName: string) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full px-4 py-3 border rounded-lg bg-card-bg text-text focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'
    }`;
  };
  const labelClass = "block text-sm font-medium text-text mb-2";

  // Validate step 3 fields
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!validateName(formData.fullName)) {
      newErrors.fullName = 'Please enter a valid name (at least 2 characters)';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Ethiopian phone number';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  if (isSuccess) {
    return (
      <FadeIn className="text-center py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-success/10">
          <CheckCircle size={40} className="text-success" />
        </div>
        <h3 className="heading-2 text-primary mb-4">Appointment Requested!</h3>
        <p className="text-text/60 mb-8 max-w-md mx-auto body-lg">
          Thank you, {formData.fullName.split(' ')[0]}! Our team will review your request and contact you via phone or WhatsApp to confirm.
        </p>
        <div className="bg-background rounded-xl p-6 max-w-sm mx-auto text-left space-y-3">
          <div className="flex items-center gap-3">
            <CalendarDays size={16} className="text-primary" />
            <span className="text-sm text-text">{formData.date} at {formData.timeSlot}</span>
          </div>
          <div className="flex items-center gap-3">
            {ServiceIcon && <ServiceIcon size={16} />}
            <span className="text-sm text-text">{selectedService?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-primary" />
            <span className="text-sm text-text">{formData.phone}</span>
          </div>
        </div>
        <a
          href={`https://wa.me/${(settings.clinic_whatsapp || '').replace(/\+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#25D366] text-text-inverse font-semibold rounded-lg hover:bg-[#128C7E] transition-all"
        >
          Chat on WhatsApp
        </a>
      </FadeIn>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-primary text-lg">Loading services...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s.num
                  ? 'bg-primary text-text-inverse scale-110'
                  : step > s.num
                    ? 'bg-success text-text-inverse'
                    : 'bg-border text-text/40'
              }`}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                step === s.num ? 'text-primary' : 'text-text/40'
              }`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.num ? 'bg-success' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 — Select Service */}
      {step === 1 && (
        <FadeIn className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Choose a Service</h3>
            <p className="text-sm text-text/60">Select the treatment you'd like to book.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {services.filter(s => s.is_active !== 0).map(service => {
              const Icon = getServiceIcon(service.iconName || 'smile');
              const isSelected = formData.serviceId === service.id.toString();
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id.toString() }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-text-inverse' : 'bg-background text-primary'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-primary">{service.name}</div>
                    <div className="text-sm text-text/60">{service.description}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={12} className="text-primary" />
                      <span className="text-xs text-text/40">{service.duration}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <Check size={12} className="text-text-inverse" />}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!formData.serviceId}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight size={18} />
          </button>
        </FadeIn>
      )}

      {/* Step 2 — Date & Time */}
      {step === 2 && (
        <FadeIn className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Pick a Date & Time</h3>
            <p className="text-sm text-text/60">We confirm within 2 hours of your request.</p>
          </div>
          <div>
            <label className={labelClass}>Preferred Date</label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border rounded-lg bg-card-bg text-text focus:outline-none focus:ring-2 focus:border-transparent transition-all border-border focus:ring-primary"
            />
          </div>
          <div>
            <label className={labelClass}>Preferred Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot.value }))}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    formData.timeSlot === slot.value
                      ? 'border-primary bg-primary/5 text-primary font-bold'
                      : 'border-border text-text/60 hover:border-primary/30'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-background rounded-xl p-4 flex items-start gap-3">
            <CalendarDays size={20} className="text-primary mt-0.5" />
            <div className="text-sm text-text/60">
              <span className="font-medium text-text">{selectedService?.name}</span> · {formData.date || 'No date selected'} · {formData.timeSlot || 'No time selected'}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-text hover:bg-background transition-all">
              <ArrowLeft size={18} /> Back
            </button>
            <button type="button" onClick={handleNext} disabled={!formData.date || !formData.timeSlot} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Continue <ArrowRight size={18} />
            </button>
          </div>
        </FadeIn>
      )}

      {/* Step 3 — Personal Info */}
      {step === 3 && (
        <FadeIn className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Your Information</h3>
            <p className="text-sm text-text/60">We'll use this to confirm your appointment.</p>
          </div>
          <div>
            <label className={labelClass}>Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} 
                onBlur={() => handleBlur('fullName')}
                placeholder="Abebe Kebede" 
                className={`${getInputClass('fullName')} pl-10`} 
              />
            </div>
            {touched.fullName && errors.fullName && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <AlertCircle size={12} /> {errors.fullName}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} 
                  onBlur={() => handleBlur('phone')}
                  placeholder="+251 911 234 567" 
                  className={`${getInputClass('phone')} pl-10`} 
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} /> {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Email (optional)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} 
                  onBlur={() => handleBlur('email')}
                  placeholder="abebe@example.com" 
                  className={`${getInputClass('email')} pl-10`} 
                />
              </div>
              {touched.email && errors.email && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Any symptoms, concerns, or special requests..." className={getInputClass('notes')} />
          </div>
          {(settings.reminder_sms_enabled === 'true' || settings.reminder_whatsapp_enabled === 'true') && (
            <div className="bg-background rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-text">Appointment Reminders</p>
              {settings.reminder_sms_enabled === 'true' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remindSms}
                    onChange={e => setFormData(p => ({ ...p, remindSms: e.target.checked }))}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-text">Send me SMS reminders before my appointment</span>
                </label>
              )}
              {settings.reminder_whatsapp_enabled === 'true' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remindWhatsapp}
                    onChange={e => setFormData(p => ({ ...p, remindWhatsapp: e.target.checked }))}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-text">Send me WhatsApp reminders before my appointment</span>
                </label>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-text hover:bg-background transition-all">
              <ArrowLeft size={18} /> Back
            </button>
            <button type="button" onClick={handleNext} disabled={!formData.fullName || !formData.phone} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Review Booking <ArrowRight size={18} />
            </button>
          </div>
        </FadeIn>
      )}

      {/* Step 4 — Confirm */}
      {step === 4 && (
        <FadeIn className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Review & Confirm</h3>
            <p className="text-sm text-text/60">Double-check your details before submitting.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-background rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text/60">Service</span>
                <span className="text-sm font-semibold text-primary">{selectedService?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text/60">Date</span>
                <span className="text-sm font-semibold text-primary">{formData.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text/60">Time</span>
                <span className="text-sm font-semibold text-primary">{formData.timeSlot}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm text-text/60">Duration</span>
                <span className="text-sm font-semibold text-primary">{selectedService?.duration}</span>
              </div>
            </div>
            <div className="bg-background rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text/60">Name</span>
                <span className="text-sm font-semibold text-primary">{formData.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text/60">Phone</span>
                <span className="text-sm font-semibold text-primary">{formData.phone}</span>
              </div>
              {formData.email && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text/60">Email</span>
                  <span className="text-sm font-semibold text-primary">{formData.email}</span>
                </div>
              )}
              {formData.notes && (
                <div className="border-t border-border pt-3">
                  <span className="text-sm text-text/60">Notes: </span>
                  <span className="text-sm text-text">{formData.notes}</span>
                </div>
              )}
              {(formData.remindSms || formData.remindWhatsapp) && (
                <div className="border-t border-border pt-3">
                  <span className="text-sm text-text/60">Reminders: </span>
                  <span className="text-sm text-text">
                    {[formData.remindSms && 'SMS', formData.remindWhatsapp && 'WhatsApp'].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-text/70">
            We'll confirm your appointment via WhatsApp or phone within <span className="font-semibold text-primary">2 hours</span>. You'll receive a calendar invite once confirmed.
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-text hover:bg-background transition-all">
              <ArrowLeft size={18} /> Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>Confirm Appointment <Check size={18} /></>
              )}
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
