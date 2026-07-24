'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Scan, Coffee, Heart } from '@/components/social-icons';

interface WhyChooseUsProps {
  clinicName?: string;
}

const features = [
  {
    icon: Scan,
    title: 'State-of-the-Art Technology',
    description: 'Digital imaging, painless anesthesia, and modern equipment for precise diagnostics.',
  },
  {
    icon: Coffee,
    title: 'Comfort-First Environment',
    description: 'Relaxing interiors designed to ease anxiety and make every visit pleasant.',
  },
  {
    icon: Heart,
    title: 'Patient-Centred Care',
    description: 'Personalized treatment plans with clear communication at every step.',
  },
];

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ clinicName = 'our clinic' }) => {
  return (
    <section className="py-20 bg-[var(--color-background)]" aria-labelledby="why-choose-us-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <span className="overline text-[var(--color-accent)] block mb-4">Why Us</span>
          <h2 id="why-choose-us-title" className="heading-2 text-[var(--color-primary)] mb-4">
            Why Choose {clinicName}?
          </h2>
          <p className="body-lg text-[var(--color-text)]/70 max-w-2xl mx-auto">
            Our clinic combines cutting-edge technology, a comfortable environment, and a team of highly qualified dentists to give you the best dental experience.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.12}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="bg-[var(--color-card-bg)] p-8 rounded-xl border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">{feature.title}</h3>
                <p className="text-[var(--color-text)]/70 leading-relaxed">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
