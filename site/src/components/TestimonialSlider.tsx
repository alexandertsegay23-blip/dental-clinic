'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from '@/components/social-icons';

interface Testimonial {
  id: number;
  patient_name: string;
  treatment: string;
  quote: string;
  rating: number;
  is_approved: number;
}

interface TestimonialSliderProps {
  initialTestimonials?: Testimonial[];
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ initialTestimonials = [] }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(initialTestimonials.length === 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialTestimonials.length > 0) {
      setTestimonials(initialTestimonials);
      setLoading(false);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [initialTestimonials]);

  const next = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-16 bg-[var(--color-background)] overflow-hidden" aria-labelledby="testimonials-title">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-primary text-lg">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--color-background)] overflow-hidden" aria-labelledby="testimonials-title">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
        <h2 id="testimonials-title" className="text-3xl font-bold text-[var(--color-primary)] mb-12">
          What Our Patients Say
        </h2>

        <div className="relative min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full px-12"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-[var(--color-accent)] fill-current" />
                ))}
              </div>
              <p className="text-xl md:text-2xl font-medium text-[var(--color-text)] mb-6 italic">
                "{testimonials[currentIndex].quote}"
              </p>
              <div>
                <h4 className="font-bold text-[var(--color-primary)]">
                  {testimonials[currentIndex].patient_name}
                </h4>
                <p className="text-sm text-[var(--color-text)]/60">
                  {testimonials[currentIndex].treatment}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};
