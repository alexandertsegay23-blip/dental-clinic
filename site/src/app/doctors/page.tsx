import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Linkedin, Twitter, Instagram, Award, ArrowRight } from '@/components/social-icons';
import { getAll, Doctor } from '@/lib/storage';

export default async function DoctorsPage() {
  const doctors = (await getAll('doctors')).filter((d: Doctor) => d.is_active !== 0);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Our Team</span>
            <h1 className="display text-text-inverse mb-6">Meet Our Specialists</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              A team of board-certified specialists passionate about dentistry and dedicated to your comfort.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="heading-2 text-primary mb-4">Expert Hands, Gentle Care</h2>
            <p className="body-lg text-text/70 max-w-2xl mx-auto">
              Each of our dentists brings specialized training and years of experience to give you the best possible outcome.
            </p>
          </FadeIn>

          {doctors.length === 0 ? (
            <div className="text-center text-text/60 py-12">No doctors available at the moment.</div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.12}>
              {doctors.map((doctor) => (
                <StaggerItem key={doctor.id}>
                    <div className="bg-card-bg rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Avatar */}
                    <div className="relative h-56 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        {doctor.photo_url ? (
                          <img
                            src={doctor.photo_url}
                            alt={doctor.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-text-inverse/10 backdrop-blur-sm border-2 border-text-inverse/20 flex items-center justify-center text-text-inverse text-3xl font-bold">
                            {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-secondary text-text-inverse text-xs font-bold px-3 py-1 rounded-full">
                          {doctor.years_experience}+ Years
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-primary mb-1">{doctor.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(doctor.qualifications || '').split(',').map((q: string) => (
                          <span key={q.trim()} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                            {q.trim()}
                          </span>
                        ))}
                      </div>
                      <p className="text-text/60 mb-6 leading-relaxed text-sm flex-1">{doctor.biography || ''}</p>

                      {/* Social */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1.5 text-sm text-text/60">
                          <Award size={14} className="text-primary" />
                          {doctor.years_experience}+ Years Exp.
                        </div>
                        <div className="flex gap-2">
                          {doctor.social?.linkedin && (
                            <a href={doctor.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-text-inverse transition-all">
                              <Linkedin size={14} />
                            </a>
                          )}
                          {doctor.social?.twitter && (
                            <a href={doctor.social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-text-inverse transition-all">
                              <Twitter size={14} />
                            </a>
                          )}
                          {doctor.social?.instagram && (
                            <a href={doctor.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-text-inverse transition-all">
                              <Instagram size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-text-inverse text-center">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="heading-2 mb-4">See a Specialist Today</h2>
            <p className="body-lg text-text-inverse/70 mb-8">Book your appointment and meet the team dedicated to your smile.</p>
            <Link href="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Book Appointment <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
