'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Smile, Sparkles, Shield, Heart, Star, Scan, Award } from '@/components/social-icons';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  icon_name: string;
  benefits: string;
  is_active: number;
}

interface FeaturedServicesProps {
  initialServices?: Service[];
}

const getServiceIcon = (name: string) => {
  if (!name) return Smile;
  switch (name.toLowerCase()) {
    case 'smile': return Smile;
    case 'sparkles': return Sparkles;
    case 'shield': return Shield;
    case 'heart': return Heart;
    case 'star': return Star;
    case 'scan': return Scan;
    case 'award': return Award;
    default: return Smile;
  }
};

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ initialServices = [] }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [loading, setLoading] = useState(initialServices.length === 0);

  useEffect(() => {
    if (initialServices.length > 0) {
      setServices(initialServices);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data.services?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [initialServices]);

  if (loading) {
    return (
      <section className="py-20 bg-[var(--color-background)]" aria-labelledby="services-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-primary text-lg">Loading services...</div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[var(--color-background)]" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <span className="overline text-[var(--color-accent)] block mb-4">What We Offer</span>
          <h2 id="services-title" className="heading-2 text-[var(--color-primary)] mb-4">
            Our Premium Services
          </h2>
          <p className="body-lg text-[var(--color-text)]/70 max-w-2xl mx-auto">
            Experience world-class dental care. We offer a comprehensive range of treatments tailored to give you the perfect smile.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.12}>
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon_name || 'smile');
            const benefitsList = service.benefits.split(',').map(b => b.trim()).filter(Boolean);
            return (
              <StaggerItem key={service.id}>
                <div className="group bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Image placeholder area */}
                  <div className="relative h-48 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 flex items-center justify-center overflow-hidden">
                    <Icon size={48} className="text-[var(--color-primary)]/30 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/5 transition-colors duration-300" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text)]/60 mb-3">
                      <Clock size={14} />
                      {service.duration}
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3 group-hover:text-[var(--color-secondary)] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-[var(--color-text)]/70 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {benefitsList.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="text-sm text-[var(--color-text)]/70 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/services#${service.id}`}
                      className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium hover:text-[var(--color-accent)] transition-colors"
                    >
                      Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeIn delay={0.3} className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 font-medium"
          >
            View All Services
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
