'use client';

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Award, Heart, Star, Users, ArrowRight } from '@/components/social-icons';
import { useClinic } from '@/components/ClinicProvider';

const values = [
  {
    icon: Heart,
    title: 'Patient First',
    description: 'Every treatment plan is built around your unique needs, comfort, and long-term oral health goals.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We invest in the latest technology and continuous training to deliver consistently exceptional results.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Serving our community with pride, we treat every patient like family — with warmth and genuine care.',
  },
  {
    icon: Award,
    title: 'Integrity',
    description: 'Honest assessments, transparent pricing, and no unnecessary procedures. Your trust means everything to us.',
  },
];

const milestones = [
  { year: '2010', text: 'Clinic founded' },
  { year: '2014', text: 'Introduced digital X-ray and imaging systems' },
  { year: '2018', text: 'Launched cosmetic dentistry & smile design' },
  { year: '2021', text: 'Reached 10,000+ happy patients milestone' },
  { year: '2024', text: 'Expanded services and team' },
];

export default function AboutPage() {
  const { settings } = useClinic();
  const clinicName = settings.clinic_name || 'our clinic';

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-text-inverse/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Our Story</span>
            <h1 className="display text-text-inverse mb-6">
              About {clinicName}
            </h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              For over 15 years, we've been transforming smiles and building lasting relationships with our community.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div>
                <span className="overline text-primary block mb-4">Who We Are</span>
                <h2 className="heading-2 text-primary mb-6">
                  Ethiopia's Trusted Dental Care Partner
                </h2>
                <p className="body-lg text-text/70 mb-6">
                  Founded in 2010, {clinicName} began as a small family practice with a big vision: to bring world-class dental care to our community. What started in a modest two-chair clinic has grown into one of the area's most trusted dental destinations.
                </p>
                <p className="text-text/60 mb-8 leading-relaxed">
                  Today, our team of 12 specialist dentists serves over 10,000 patients, combining advanced technology with a warm, human approach. We believe everyone deserves a healthy, beautiful smile — and we've made it our mission to make that accessible to our community.
                </p>
                <Link
                  href="/appointment"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all"
                >
                  Book a Consultation <ArrowRight size={18} />
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-10 text-text-inverse">
                  <div className="text-6xl font-bold text-text-inverse mb-2">15+</div>
                  <div className="text-lg font-medium mb-6">Years of Excellence</div>
                  <div className="space-y-4">
                    {milestones.map((m) => (
                      <div key={m.year} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-semibold text-text-inverse">{m.year}</div>
                        <div className="flex-1 h-px bg-text-inverse/20" />
                        <div className="text-sm text-text-inverse/80">{m.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-full -z-10" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-section-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="overline text-primary block mb-4">What Drives Us</span>
            <h2 className="heading-2 text-primary">Our Core Values</h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                  <div className="bg-card-bg p-8 rounded-xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full text-center">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                    <v.icon size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">{v.title}</h3>
                  <p className="text-sm text-text/60 leading-relaxed">{v.description}</p>
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
            <h2 className="heading-2 mb-4">Want to Meet Our Team?</h2>
            <p className="body-lg text-text-inverse/70 mb-8">
              Get to know the dedicated professionals behind your smile.
            </p>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all"
            >
              Meet Our Doctors <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
