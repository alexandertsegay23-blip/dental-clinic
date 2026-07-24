import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Star, ArrowRight } from '@/components/social-icons';
import { getAll, Testimonial, Setting } from '@/lib/storage';

export async function generateMetadata() {
  const settings = (await getAll('settings')).reduce((acc: Record<string, string>, s: Setting) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const clinicName = settings.clinic_name || 'Dental Clinic';

  return {
    title: `Testimonials — ${clinicName}`,
    description: `Read what our patients say about their experience with ${clinicName}.`,
  };
}

export default async function TestimonialsPage() {
  const testimonials: Testimonial[] = (await getAll('testimonials')).filter((t: Testimonial) => t.is_approved !== 0);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-secondary rounded-full blur-3xl translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Patient Stories</span>
            <h1 className="display text-text-inverse mb-6">What Our Patients Say</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              Real stories from real people. Over 10,000 patients have trusted us with their smiles.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <div className="text-center text-text/60 py-12">No testimonials available at the moment.</div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {testimonials.map((t) => (
                <StaggerItem key={t.id}>
                    <div className="bg-card-bg rounded-2xl border border-border p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={18} className="text-primary fill-current" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-text/70 leading-relaxed mb-8 flex-1">
                      "{t.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-border">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-text-inverse font-bold text-lg">
                        {t.patient_name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{t.patient_name}</div>
                        <div className="text-xs text-text/40">Verified Patient</div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Stats banner */}
          <FadeIn className="mt-16 bg-primary rounded-2xl p-10 text-center">
            <div className="flex flex-wrap justify-center gap-12">
              <div>
                <div className="text-4xl font-bold text-text-inverse">10,000+</div>
                <div className="text-sm text-text-inverse/60 mt-1">Happy Patients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-text-inverse">4.9</div>
                <div className="flex justify-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-text-inverse fill-current" />)}
                </div>
                <div className="text-sm text-text-inverse/60 mt-1">Average Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-text-inverse">15+</div>
                <div className="text-sm text-text-inverse/60 mt-1">Years Experience</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="heading-2 text-primary mb-4">Become Our Next Success Story</h2>
            <p className="body-lg text-text/60 mb-8">Join thousands of satisfied patients. Your perfect smile is one appointment away.</p>
            <Link href="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Book Your Appointment <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
