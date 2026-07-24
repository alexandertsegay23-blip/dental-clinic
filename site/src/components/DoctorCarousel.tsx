'use client';

import React, { useEffect, useState } from 'react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Linkedin, Twitter, Instagram, Award } from '@/components/social-icons';

interface Doctor {
  id: number;
  name: string;
  qualifications: string;
  biography: string;
  years_experience: number;
  photo_url: string;
  is_active: number;
  social?: Record<string, string>;
}

interface DoctorCarouselProps {
  initialDoctors?: Doctor[];
}

export const DoctorCarousel: React.FC<DoctorCarouselProps> = ({ initialDoctors = [] }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [loading, setLoading] = useState(initialDoctors.length === 0);

  useEffect(() => {
    if (initialDoctors.length > 0) {
      setDoctors(initialDoctors);
      setLoading(false);
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.doctors || []);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [initialDoctors]);

  if (loading) {
    return (
      <section className="py-20 bg-[var(--color-background)]" aria-labelledby="doctors-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-primary text-lg">Loading doctors...</div>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[var(--color-background)]" aria-labelledby="doctors-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <span className="overline text-[var(--color-accent)] block mb-4">Our Team</span>
          <h2 id="doctors-title" className="heading-2 text-[var(--color-primary)] mb-4">
            Meet Our Specialists
          </h2>
          <p className="body-lg text-[var(--color-text)]/70 max-w-2xl mx-auto">
            Our team of highly qualified dental professionals is dedicated to providing you with the best possible care.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.12}>
          {doctors.map((doctor) => (
            <StaggerItem key={doctor.id}>
              <div className="group bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Photo area */}
                <div className="relative h-72 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center overflow-hidden">
                  {doctor.photo_url ? (
                    <img
                      src={doctor.photo_url}
                      alt={doctor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-[var(--color-card-bg)] shadow-card flex items-center justify-center text-[var(--color-primary)] text-3xl font-bold border-4 border-[var(--color-border)]">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-primary)]/20 to-transparent h-20" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm font-medium text-[var(--color-accent)] mb-3">
                    {(doctor.qualifications || '').split(',').map(q => q.trim()).join(', ')}
                  </p>
                  <p className="text-[var(--color-text)]/70 mb-5 text-sm leading-relaxed line-clamp-3">
                    {doctor.biography || ''}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--color-text)]/60">
                      <Award size={14} className="text-[var(--color-accent)]" />
                      {doctor.years_experience}+ Years
                    </div>
                    <div className="flex gap-2">
                      {doctor.social?.linkedin && (
                        <a href={doctor.social.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                          <Linkedin size={14} />
                        </a>
                      )}
                      {doctor.social?.twitter && (
                        <a href={doctor.social.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                          <Twitter size={14} />
                        </a>
                      )}
                      {doctor.social?.instagram && (
                        <a href={doctor.social.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                          <Instagram size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
