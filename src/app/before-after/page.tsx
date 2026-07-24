'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { useState } from 'react';
import { ArrowRight, Smile, Sparkles } from '@/components/social-icons';
import Link from 'next/link';

const cases = [
  {
    id: 1,
    treatment: 'Laser Teeth Whitening',
    patient: 'Eleni T.',
    duration: '60 min session',
    description: 'Stubborn coffee and tea stains removed in a single session.',
    beforeColor: '#C4A882',
    afterColor: '#F5F0E8',
    resultColor: '#0EA5E9',
  },
  {
    id: 2,
    treatment: 'Porcelain Veneers',
    patient: 'Samuel D.',
    duration: '2 visits over 3 weeks',
    description: 'Gaps and misshapen teeth corrected with custom ceramic veneers.',
    beforeColor: '#B8A090',
    afterColor: '#FAFAF8',
    resultColor: '#059669',
  },
  {
    id: 3,
    treatment: 'Invisalign Clear Aligners',
    patient: 'Marta K.',
    duration: '12 months treatment',
    description: 'Crowding and bite misalignment corrected without metal braces.',
    beforeColor: '#9A8A7A',
    afterColor: '#F0EDE8',
    resultColor: '#8B5CF6',
  },
  {
    id: 4,
    treatment: 'Dental Implants',
    patient: 'Daniel A.',
    duration: '6 months (including healing)',
    description: 'Missing front tooth replaced with a natural-looking implant and crown.',
    beforeColor: '#C89A7A',
    afterColor: '#F8F0E8',
    resultColor: '#0EA5E9',
  },
  {
    id: 5,
    treatment: 'Full Smile Makeover',
    patient: 'Frehiwot B.',
    duration: '4 months, multiple procedures',
    description: 'Combination of whitening, veneers, and gum contouring for a complete transformation.',
    beforeColor: '#B09080',
    afterColor: '#FFFFFF',
    resultColor: '#D97706',
  },
  {
    id: 6,
    treatment: 'Composite Bonding',
    patient: 'Henok M.',
    duration: 'Single 90-minute visit',
    description: 'Chipped and uneven teeth repaired with tooth-colored composite resin.',
    beforeColor: '#C4A882',
    afterColor: '#F5F0E8',
    resultColor: '#059669',
  },
];

const categories = ['All', 'Whitening', 'Veneers', 'Implants', 'Orthodontics', 'Bonding'];

export default function BeforeAfterPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openId, setOpenId] = useState<number | null>(null);

  const categoryMap: Record<string, string[]> = {
    'Whitening': ['Laser Teeth Whitening'],
    'Veneers': ['Porcelain Veneers', 'Full Smile Makeover'],
    'Implants': ['Dental Implants'],
    'Orthodontics': ['Invisalign Clear Aligners'],
    'Bonding': ['Composite Bonding'],
  };

  const filtered = activeCategory === 'All'
    ? cases
    : cases.filter(c => categoryMap[activeCategory]?.includes(c.treatment));

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Real Results</span>
            <h1 className="display text-text-inverse mb-6">Before & After Gallery</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              See the transformations for yourself. Every smile tells a story — here are some of our favorites.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-primary/10 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <p className="text-sm text-text/60 text-center">
            <span className="font-semibold text-primary">Individual results vary.</span> Each case shown reflects a real patient. Actual treatment outcomes depend on individual conditions.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-10 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-text-inverse'
                    : 'bg-background text-text/60 border border-border hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Cases */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
            {filtered.map(c => (
              <StaggerItem key={c.id}>
                <div className="bg-card-bg rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Before/After Visual */}
                  <div className="relative">
                    <div className="grid grid-cols-2">
                      <div className={`relative h-48 flex flex-col items-center justify-center p-4`} style={{ backgroundColor: c.beforeColor }}>
                        <span className="absolute top-3 left-3 text-xs font-bold text-text-inverse/80 uppercase tracking-wider backdrop-blur-sm bg-text/20 px-2 py-1 rounded">Before</span>
                        <div className="w-16 h-16 mb-2 rounded-2xl bg-text-inverse/15 flex items-center justify-center">
                          <Smile size={34} className="text-text-inverse" />
                        </div>
                        <span className="text-xs text-text-inverse/60 font-medium">Before Treatment</span>
                      </div>
                      <div className={`relative h-48 flex flex-col items-center justify-center p-4`} style={{ backgroundColor: c.afterColor }}>
                        <span className="absolute top-3 left-3 text-xs font-bold text-text/80 uppercase tracking-wider backdrop-blur-sm bg-text/10 px-2 py-1 rounded">After</span>
                        <div className="w-16 h-16 mb-2 rounded-2xl bg-text/10 flex items-center justify-center">
                          <Sparkles size={34} className="text-text" />
                        </div>
                        <span className="text-xs text-text/40 font-medium">After Treatment</span>
                      </div>
                    </div>
                    {/* Treatment badge */}
                    <div className="absolute top-3 right-3" style={{ backgroundColor: c.resultColor }}>
                      <span className="text-xs text-text-inverse font-bold px-3 py-1 rounded-full">
                        {c.treatment}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-primary">{c.patient}</h3>
                      <span className="text-xs text-text/40">{c.duration}</span>
                    </div>
                    <p className="text-sm text-text/60 mb-5">{c.description}</p>
                    <button
                      onClick={() => setOpenId(openId === c.id ? null : c.id)}
                      className="w-full text-sm text-primary font-semibold hover:underline"
                    >
                      {openId === c.id ? 'Hide details' : 'View details'}
                    </button>
                    {openId === c.id && (
                      <div className="mt-4 p-4 bg-background rounded-xl text-sm text-text/60 space-y-2">
                        <div className="flex justify-between">
                          <span>Treatment:</span>
                          <span className="font-semibold text-primary">{c.treatment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Patient:</span>
                          <span className="font-semibold text-primary">{c.patient}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-semibold text-primary">{c.duration}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-text-inverse text-center">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="heading-2 mb-4">Ready for Your Transformation?</h2>
            <p className="body-lg text-text-inverse/70 mb-8">
              Book a consultation and let's create your perfect smile together.
            </p>
            <Link href="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Start Your Journey <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
