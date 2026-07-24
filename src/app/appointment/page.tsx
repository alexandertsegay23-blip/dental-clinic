'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { AppointmentForm } from '@/components/AppointmentForm';
import { Calendar, Phone, Clock, ArrowRight } from '@/components/social-icons';
import { useClinic } from '@/components/ClinicProvider';

const steps = [
  { icon: Calendar, title: 'Choose a Date', description: 'Select your preferred date and time slot.' },
  { icon: Phone, title: 'Confirm Details', description: 'We verify your info and reach out via WhatsApp or phone.' },
  { icon: Clock, title: 'Arrive & Relax', description: 'Show up — we handle everything from there.' },
];

export default function AppointmentPage() {
  const { settings } = useClinic();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-96 h-96 bg-text-inverse/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Easy Booking</span>
            <h1 className="display text-text-inverse mb-6">Book Your Appointment</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              Scheduling takes less than 2 minutes. We confirm your appointment within 2 hours.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" staggerDelay={0.12}>
            {steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                    <s.icon size={28} />
                  </div>
                  <div className="text-4xl font-bold text-border mb-2">0{i + 1}</div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-text/60">{s.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <FadeIn direction="left" className="lg:col-span-3">
              <div className="bg-card-bg rounded-2xl border border-border p-8 lg:p-10 shadow-card">
                <h2 className="heading-2 text-primary mb-2">Request an Appointment</h2>
                <p className="text-text/60 mb-8">Fill in the form below and we'll get back to you shortly.</p>
                <AppointmentForm />
              </div>
            </FadeIn>

            {/* Info */}
            <FadeIn direction="right" className="lg:col-span-2">
              <div className="space-y-6">
                <div className="bg-primary rounded-2xl p-8 text-text-inverse">
                  <h3 className="font-semibold text-lg mb-4">Contact Us Directly</h3>
                  <div className="space-y-4">
                    <a href={`tel:${settings.clinic_phone}`} className="flex items-center gap-3 text-text-inverse/80 hover:text-text-inverse transition-colors">
                      <Phone size={18} />
                      {settings.clinic_phone}
                    </a>
                    <a href={`https://wa.me/${(settings.clinic_whatsapp || '').replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-inverse/80 hover:text-text-inverse transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      WhatsApp Us
                    </a>
                  </div>
                </div>

                <div className="bg-card-bg rounded-2xl border border-border p-8">
                  <h3 className="font-semibold text-primary mb-4">Working Hours</h3>
                  <div className="space-y-3">
                    {settings.clinic_working_hours?.split(',').map((h, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-text/70">
                        <Clock size={14} className="text-primary" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8">
                  <h3 className="font-semibold text-primary mb-2">Same-Day Appointments</h3>
                  <p className="text-sm text-text/60 mb-4">Call us before noon and we'll try to fit you in the same day.</p>
                  <a href={`tel:${settings.clinic_phone}`} className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                    Call Now <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
