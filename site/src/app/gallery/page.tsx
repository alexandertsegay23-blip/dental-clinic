'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from '@/components/social-icons';

const photos = [
  { id: 1, category: 'Clinic', label: 'Reception & Waiting Area', color: 'from-primary to-secondary' },
  { id: 2, category: 'Treatment', label: 'Modern Treatment Room', color: 'from-secondary to-primary' },
  { id: 3, category: 'Team', label: 'Our Specialist Team', color: 'from-primary to-secondary' },
  { id: 4, category: 'Clinic', label: 'State-of-the-Art Equipment', color: 'from-secondary to-primary' },
  { id: 5, category: 'Result', label: 'Patient Smile Makeover', color: 'from-primary to-secondary' },
  { id: 6, category: 'Result', label: 'Before & After Treatment', color: 'from-secondary to-primary' },
  { id: 7, category: 'Clinic', label: 'Digital X-Ray Suite', color: 'from-primary to-secondary' },
  { id: 8, category: 'Treatment', label: 'Whitening Session in Progress', color: 'from-secondary to-primary' },
  { id: 9, category: 'Team', label: 'Dr. Alemu at Work', color: 'from-primary to-secondary' },
  { id: 10, category: 'Clinic', label: 'Kids-Friendly Play Area', color: 'from-secondary to-primary' },
  { id: 11, category: 'Result', label: 'Veneer Treatment Result', color: 'from-primary to-secondary' },
  { id: 12, category: 'Clinic', label: 'Sterilization & Hygiene Zone', color: 'from-secondary to-primary' },
];

const categories = ['All', 'Clinic', 'Treatment', 'Result', 'Team'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Our Clinic</span>
            <h1 className="display text-text-inverse mb-6">Gallery</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              Take a peek inside our clinic — from our modern facilities to the smiles we've helped create.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category Filter */}
          <FadeIn className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-text-inverse'
                    : 'bg-background text-text/60 border border-border hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </FadeIn>

          {/* Photo Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
            {filtered.map((photo) => (
              <StaggerItem key={photo.id}>
                <div className="group relative overflow-hidden rounded-xl cursor-pointer">
                  {/* Placeholder visual */}
                  <div className={`aspect-[4/3] bg-gradient-to-br ${photo.color} flex items-center justify-center`}>
                    <div className="text-center text-text-inverse/30">
                      <div className="text-5xl font-bold mb-2">{photo.id}</div>
                      <div className="text-sm">{photo.category}</div>
                    </div>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6">
                    <div className="text-xs text-text-inverse font-semibold uppercase tracking-wider mb-2">{photo.category}</div>
                    <div className="text-text-inverse font-semibold">{photo.label}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
