'use client';

import React, { useEffect, useState } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_active: number;
}

interface GalleryGridProps {
  initialGallery?: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ initialGallery = [] }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [loading, setLoading] = useState(initialGallery.length === 0);

  useEffect(() => {
    if (initialGallery.length > 0) {
      setGallery(initialGallery);
      setLoading(false);
      return;
    }

    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setGallery(data.gallery || []);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [initialGallery]);

  if (loading) {
    return (
      <section className="py-16 bg-[var(--color-background)]" aria-labelledby="gallery-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-primary text-lg">Loading gallery...</div>
        </div>
      </section>
    );
  }

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--color-background)]" aria-labelledby="gallery-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="gallery-title" className="text-3xl font-bold text-[var(--color-primary)] mb-4">
            Clinic Gallery
          </h2>
          <p className="text-lg text-[var(--color-text)] max-w-2xl mx-auto">
            Take a tour of our modern, state-of-the-art dental facility designed for your comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-500 group cursor-pointer bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10"
            >
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.alt_text || item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-primary)]">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span className="mt-2 text-sm font-medium opacity-60">{item.title}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
