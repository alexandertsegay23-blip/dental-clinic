'use client';

import React, { useEffect, useState } from 'react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Smile, Award, Star, Users } from '@/components/social-icons';

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

interface Testimonial {
  id: number;
  patient_name: string;
  treatment: string;
  quote: string;
  rating: number;
  is_approved: number;
}

interface StatisticsProps {
  initialDoctors?: Doctor[];
  initialTestimonials?: Testimonial[];
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export const Statistics: React.FC<StatisticsProps> = ({ 
  initialDoctors = [], 
  initialTestimonials = [] 
}) => {
  const [doctorCount, setDoctorCount] = useState(initialDoctors.length > 0 ? initialDoctors.length : 12);
  const [testimonialCount, setTestimonialCount] = useState(initialTestimonials.length > 0 ? initialTestimonials.length : 0);

  useEffect(() => {
    if (initialDoctors.length > 0 && initialTestimonials.length > 0) {
      setDoctorCount(initialDoctors.length);
      setTestimonialCount(initialTestimonials.length);
      return;
    }

    const fetchStats = async () => {
      try {
        const [doctorsRes, testimonialsRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/testimonials'),
        ]);

        if (doctorsRes.ok) {
          const data = await doctorsRes.json();
          setDoctorCount(data.doctors?.length || 0);
        }

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          setTestimonialCount(data.testimonials?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, [initialDoctors, initialTestimonials]);

  const stats = [
    { label: 'Happy Patients', value: Math.max(testimonialCount * 200, 10000), suffix: '+', icon: Smile },
    { label: 'Years Experience', value: 15, suffix: '+', icon: Award },
    { label: 'Dental Awards', value: 25, suffix: '', icon: Star },
    { label: 'Expert Doctors', value: doctorCount, suffix: '', icon: Users },
  ];

  return (
    <section
      className="py-20 bg-primary relative overflow-hidden"
      aria-labelledby="stats-title"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-text-inverse/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Section Header */}
      <FadeIn className="text-center mb-14 px-6 lg:px-8 max-w-7xl mx-auto">
        <span className="overline text-text-inverse block mb-4">Our Achievements</span>
        <h2
          id="stats-title"
          className="heading-2 text-text-inverse mb-4"
        >
          Numbers That Speak for Themselves
        </h2>
        <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
          Years of dedication, thousands of smiles restored, and a reputation built on trust.
        </p>
      </FadeIn>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" staggerDelay={0.12}>
          {stats.map((stat, i) => (
            <StaggerItem key={i}>
              <div className="relative group">
                {/* Card background */}
                <div className="bg-text-inverse/10 backdrop-blur-sm border border-text-inverse/20 rounded-2xl p-6 lg:p-8 text-center hover:bg-text-inverse/20 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-text-inverse/10 flex items-center justify-center">
                    <stat.icon size={28} className="text-text-inverse" />
                  </div>

                  {/* Value */}
                  <div className="text-4xl lg:text-5xl font-bold text-text-inverse mb-2 tracking-tight">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <div className="text-sm text-text-inverse/70 font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-text-inverse rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Bottom decorative line */}
      <div className="mt-16 flex justify-center">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-text-inverse/50 to-transparent" />
      </div>
    </section>
  );
};
