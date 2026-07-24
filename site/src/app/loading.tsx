'use client';

import { HeroSkeleton, SectionSkeleton, CardSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <SectionSkeleton />
      
      {/* Services Grid */}
      <section className="py-20 bg-section-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
      
      <SectionSkeleton />
    </>
  );
}
