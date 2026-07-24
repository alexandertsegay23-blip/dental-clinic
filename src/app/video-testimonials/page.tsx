'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Star, Play, ArrowRight } from '@/components/social-icons';
import Link from 'next/link';
import { useState } from 'react';

const videoTestimonials = [
  {
    id: 1,
    name: 'Eleni T.',
    treatment: 'Smile Makeover',
    duration: '45 sec',
    quote: 'I never smiled in photos before. Now I can\'t stop. The whole team made me feel so comfortable.',
    rating: 5,
    thumbnailColor: 'from-primary/60 to-secondary',
    initials: 'ET',
  },
  {
    id: 2,
    name: 'Samuel D.',
    treatment: 'Dental Implants',
    duration: '1 min 12 sec',
    quote: 'Dr. Michael explained everything before my surgery. Zero pain, amazing results. I eat everything I want now.',
    rating: 5,
    thumbnailColor: 'from-primary to-secondary',
    initials: 'SD',
  },
  {
    id: 3,
    name: 'Marta K.',
    treatment: 'Invisalign Treatment',
    duration: '52 sec',
    quote: 'The aligners were so comfortable, I forgot I was wearing them. My teeth are perfectly straight now.',
    rating: 5,
    thumbnailColor: 'from-[#8B5CF6]/70 to-primary',
    initials: 'MK',
  },
  {
    id: 4,
    name: 'Daniel A.',
    treatment: 'Teeth Whitening',
    duration: '38 sec',
    quote: 'One session and my teeth were 7 shades lighter. The confidence boost is unreal.',
    rating: 5,
    thumbnailColor: 'from-[#25D366]/60 to-primary',
    initials: 'DA',
  },
  {
    id: 5,
    name: 'Frehiwot B.',
    treatment: 'Full Smile Makeover',
    duration: '1 min 30 sec',
    quote: 'This clinic changed my life. I smile in meetings now. I smile on Zoom calls. I smile at strangers.',
    rating: 5,
    thumbnailColor: 'from-[#0EA5E9]/60 to-primary',
    initials: 'FB',
  },
  {
    id: 6,
    name: 'Henok M.',
    treatment: 'Composite Bonding',
    duration: '44 sec',
    quote: 'Fast, painless, and the results look completely natural. My wife didn\'t even believe it was dental work.',
    rating: 5,
    thumbnailColor: 'from-[#EF4444]/40 to-primary',
    initials: 'HM',
  },
];

export default function VideoTestimonialsPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Patient Stories</span>
            <h1 className="display text-text-inverse mb-6">Video Testimonials</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              Don't just take our word for it. Hear directly from the patients whose smiles we've transformed.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-10 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-text/40 mt-1">Happy Patients</div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary">
                <span>4.9</span>
                <Star size={24} className="fill-current" aria-hidden="true" />
              </div>
              <div className="text-sm text-text/40 mt-1">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">6</div>
              <div className="text-sm text-text/40 mt-1">Video Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {videoTestimonials.map(vt => (
              <StaggerItem key={vt.id}>
                <div className="bg-card-bg rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Video thumbnail */}
                  <div className="relative">
                    <div className={`h-52 bg-gradient-to-br ${vt.thumbnailColor} flex items-center justify-center relative`}>
                      {/* Patient avatar */}
                      <div className="w-20 h-20 rounded-full bg-text-inverse/20 backdrop-blur-sm border-2 border-text-inverse/20 flex items-center justify-center text-text-inverse text-2xl font-bold">
                        {vt.initials}
                      </div>
                      {/* Play button overlay */}
                      <button
                        onClick={() => setPlayingId(vt.id)}
                        className="absolute inset-0 flex items-center justify-center bg-text/20 hover:bg-text/30 transition-colors group"
                        aria-label={`Play ${vt.name}'s testimonial`}
                      >
                        <div className="w-16 h-16 rounded-full bg-text-inverse/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play size={28} className="text-primary ml-1" />
                        </div>
                      </button>
                      {/* Duration */}
                      <div className="absolute bottom-3 right-3 bg-text/50 text-text-inverse text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {vt.duration}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-primary">{vt.name}</div>
                        <div className="text-xs text-text/40">{vt.treatment}</div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(vt.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-primary fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-text/60 italic leading-relaxed">
                      "{vt.quote}"
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Video Modal */}
      {playingId && (
        <div
          className="fixed inset-0 z-50 bg-text/80 flex items-center justify-center p-6"
          onClick={() => setPlayingId(null)}
        >
          <div className="bg-card-bg rounded-2xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div>
                <div className="font-semibold text-primary">
                  {videoTestimonials.find(v => v.id === playingId)?.name}
                </div>
                <div className="text-xs text-text/40">
                  {videoTestimonials.find(v => v.id === playingId)?.treatment}
                </div>
              </div>
              <button onClick={() => setPlayingId(null)} className="text-text/40 hover:text-text transition-colors text-2xl leading-none">
                ×
              </button>
            </div>
            <div className="aspect-video bg-text flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-text-inverse/20 bg-text-inverse/10 text-text-inverse/40">
                    <Play size={28} />
                  </div>
                </div>
                <p className="text-text-inverse/50 text-sm">Video player would load here.</p>
                <p className="text-text-inverse/30 text-xs mt-1">Connect to YouTube/Vimeo API to enable playback</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary text-text-inverse text-center">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="heading-2 mb-4">Be Our Next Success Story</h2>
            <p className="body-lg text-text-inverse/70 mb-8">
              Thousands of patients trust us with their smiles. Your turn is next.
            </p>
            <Link href="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Book Your Consultation <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
