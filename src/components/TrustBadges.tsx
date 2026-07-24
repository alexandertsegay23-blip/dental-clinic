import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Clock } from '@/components/social-icons';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';

interface TrustBadge {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  description: string;
}

const badges: TrustBadge[] = [
  { icon: ShieldCheck, label: 'Certified Professionals', description: 'Board-certified specialists' },
  { icon: Award, label: 'Award-Winning Care', description: 'Recognized excellence in dentistry' },
  { icon: HeartHandshake, label: 'Patient-First Approach', description: 'Personalized treatment plans' },
  { icon: Clock, label: 'Flexible Scheduling', description: 'Evening & weekend appointments' },
];

export const TrustBadges: React.FC = () => (
  <section className="py-14 bg-[var(--color-background)]" aria-label="Trust badges">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
        {badges.map((b, i) => (
          <StaggerItem key={i}>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-3">
                <b.icon size={22} strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-sm text-[var(--color-text)]">{b.label}</span>
              <span className="text-xs text-[var(--color-text)]/60 mt-1">{b.description}</span>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);
