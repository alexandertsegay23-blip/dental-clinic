'use client';

import { BlogCardSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="h-12 w-48 mx-auto mb-4 bg-text-inverse/10 rounded animate-pulse" />
          <div className="h-6 w-full max-w-2xl mx-auto bg-text-inverse/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex gap-3 mb-14 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-primary/10 rounded-full animate-pulse" />
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
