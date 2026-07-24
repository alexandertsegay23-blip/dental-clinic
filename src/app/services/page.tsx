import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { ArrowRight, Clock, Check, Smile, Sparkles, Shield, Heart, Scan, Award } from '@/components/social-icons';
import { getServices } from '@/lib/repository';

const process = [
  { step: '01', title: 'Book Appointment', description: 'Schedule online or via WhatsApp. We confirm within 2 hours.' },
  { step: '02', title: 'Consultation', description: 'Meet your dentist for a thorough exam and digital imaging.' },
  { step: '03', title: 'Treatment Plan', description: 'Receive a personalized plan with transparent pricing.' },
  { step: '04', title: 'Care & Follow-up', description: 'Enjoy your treatment and follow our aftercare guidance.' },
];

const getServiceIcon = (name?: string) => {
  const iconName = (name || '').toLowerCase();
  switch (iconName) {
    case 'smile': return Smile;
    case 'sparkles': return Sparkles;
    case 'shield': return Shield;
    case 'heart': return Heart;
    case 'scan': return Scan;
    case 'award': return Award;
    default: return Smile;
  }
};

export default async function ServicesPage() {
  const services = (await getServices()).filter((s: any) => s.isActive !== 0);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-1/2 w-96 h-96 bg-text-inverse/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">What We Offer</span>
            <h1 className="display text-text-inverse mb-6">Our Dental Services</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              From routine cleanings to complete smile makeovers, we offer a full spectrum of dental care under one roof.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* All Services */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="heading-2 text-primary mb-4">Comprehensive Care</h2>
            <p className="body-lg text-text/70 max-w-2xl mx-auto">
              Each service is tailored to your needs, using the latest techniques and materials.
            </p>
          </FadeIn>

          {services.length === 0 ? (
            <div className="text-center text-text/60 py-12">No services available at the moment.</div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {services.map((service) => {
                const Icon = getServiceIcon(service.iconName);
                const benefitsList = (service.benefits || '').split(',').map((b: string) => b.trim()).filter(Boolean);
                return (
                  <StaggerItem key={service.id}>
                    <div className="group bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-40 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon size={56} className="text-text-inverse/30 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-text-inverse/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Clock size={12} className="text-text-inverse" />
                          <span className="text-xs text-text-inverse">{service.duration}</span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-primary mb-3">{service.name}</h3>
                        <p className="text-text/60 mb-4 leading-relaxed text-sm flex-1">{service.description}</p>
                        <ul className="space-y-2 mb-6">
                          {benefitsList.map((b: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-text/70">
                              <Check size={14} className="text-primary flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/appointment"
                          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm"
                        >
                          Book This Service <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-section-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="overline text-primary block mb-4">How It Works</span>
            <h2 className="heading-2 text-primary">Your Visit in 4 Steps</h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.12}>
            {process.map((p) => (
              <StaggerItem key={p.step}>
                <div className="relative bg-card-bg rounded-xl border border-border p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="text-5xl font-bold text-primary/10 mb-4">{p.step}</div>
                  <h3 className="text-lg font-semibold text-primary mb-3">{p.title}</h3>
                  <p className="text-sm text-text/60 leading-relaxed">{p.description}</p>
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
            <h2 className="heading-2 mb-4">Ready to Transform Your Smile?</h2>
            <p className="body-lg text-text-inverse/70 mb-8">Book your consultation today and take the first step.</p>
            <Link href="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Book Appointment <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
