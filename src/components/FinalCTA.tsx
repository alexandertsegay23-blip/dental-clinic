'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from '@/components/social-icons';

interface FinalCTAProps {
  clinicName?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ clinicName = 'our clinic' }) => {
  return (
    <section className="py-20 bg-primary text-text-inverse text-center" aria-labelledby="cta-title">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2 id="cta-title" className="text-4xl md:text-5xl font-bold mb-6">
          Ready to achieve your perfect smile?
        </h2>
        <p className="text-xl text-text-inverse/80 mb-10 max-w-2xl mx-auto">
          Schedule your consultation today and take the first step towards a healthier, more beautiful smile with {clinicName}.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/appointment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-bold rounded-lg hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20"
          >
            <CalendarDays size={20} />
            Book an Appointment
          </Link>
          <a
            href={`tel:${process.env.NEXT_PUBLIC_CLINIC_PHONE || ''}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-text-inverse/30 text-text-inverse font-bold rounded-lg hover:bg-text-inverse/10 transition-all duration-300"
          >
            Call Us Today
          </a>
        </div>
      </div>
    </section>
  );
};
