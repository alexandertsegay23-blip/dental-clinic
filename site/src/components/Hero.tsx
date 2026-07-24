'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from '@/components/social-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useClinic } from '@/components/ClinicProvider';
import { useLanguage } from '@/components/LanguageProvider';

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

interface HeroProps {
  initialDoctors?: Doctor[];
}

export default function Hero({ initialDoctors = [] }: HeroProps) {
  const { settings } = useClinic();
  const { t } = useLanguage();
  const [doctorCount, setDoctorCount] = useState<number | null>(initialDoctors.length > 0 ? initialDoctors.length : null);

  useEffect(() => {
    if (initialDoctors.length > 0) {
      setDoctorCount(initialDoctors.length);
      return;
    }

    const fetchDoctorCount = async () => {
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctorCount(data.doctors?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch doctor count:', error);
      }
    };
    fetchDoctorCount();
  }, [initialDoctors]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Dental clinic interior"
        fill
        priority
        className="object-cover"
      />

      {/* Gradient Overlay - ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          {/* Overline */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overline text-primary block mb-6"
          >
            {settings.clinic_address ? `${t('hero.overline')} ${settings.clinic_address.split(',')[0]}` : t('hero.overline')}
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="display text-text-inverse mb-6"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="body-lg text-text-inverse/80 mb-10 max-w-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/appointment"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              {t('hero.cta')}
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-8 py-4 bg-text-inverse/10 text-text-inverse font-semibold rounded-lg border border-text-inverse/20 hover:bg-text-inverse/20 transition-all duration-300 backdrop-blur-sm"
            >
              <Play size={18} />
              {t('doctors.title')}
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 pt-8 border-t border-text-inverse/10 flex flex-wrap gap-8"
          >
            <div>
              <div className="text-2xl font-bold text-text-inverse">15+</div>
              <div className="text-sm text-text-inverse/60">{t('hero.yearsExperience')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-inverse">10k+</div>
              <div className="text-sm text-text-inverse/60">{t('hero.happyPatients')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-inverse">
                {doctorCount !== null ? doctorCount : '12'}
              </div>
              <div className="text-sm text-text-inverse/60">{t('hero.expertDoctors')}</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-text-inverse/30 flex items-start justify-center p-1"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-text-inverse/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
