'use client';

import { HeroSkeleton, CardSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      
      {/* Doctors Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card-bg rounded-2xl border border-border overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="p-8">
                  <div className="h-6 w-3/4 mb-2 bg-primary/10 rounded animate-pulse" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-primary/10 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-primary/10 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full mb-1 bg-primary/10 rounded animate-pulse" />
                  <div className="h-4 w-3/4 mb-6 bg-primary/10 rounded animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-primary/10 rounded-full animate-pulse" />
                      <div className="h-8 w-8 bg-primary/10 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
