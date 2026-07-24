import Hero from '@/components/Hero';
import { TrustBadges } from '@/components/TrustBadges';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { FeaturedServices } from '@/components/FeaturedServices';
import { DoctorCarousel } from '@/components/DoctorCarousel';
import { Statistics } from '@/components/Statistics';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { GalleryGrid } from '@/components/GalleryGrid';
import { FAQSection } from '@/components/FAQSection';
import { PricingSection } from '@/components/PricingSection';
import { ContactSection } from '@/components/ContactSection';
import { FinalCTA } from '@/components/FinalCTA';
import { Seo } from '@/components/Seo';

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/home`, { 
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch home data');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      {/* SEO */}
      <Seo initialFaqs={data?.faqs || []} />

      {/* Hero */}
      <Hero initialDoctors={data?.doctors || []} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Why Choose Us */}
      <WhyChooseUs clinicName={data?.settings?.clinic_name || 'our clinic'} />

      {/* Featured Services */}
      <FeaturedServices initialServices={data?.services || []} />

      {/* Statistics */}
      <Statistics 
        initialDoctors={data?.doctors || []} 
        initialTestimonials={data?.testimonials || []} 
      />

      {/* Meet Our Doctors */}
      <DoctorCarousel initialDoctors={data?.doctors || []} />

      {/* Testimonials */}
      <TestimonialSlider initialTestimonials={data?.testimonials || []} />

      {/* Gallery */}
      <GalleryGrid initialGallery={data?.gallery || []} />

      {/* FAQ */}
      <FAQSection initialFaqs={data?.faqs || []} />

      {/* Pricing */}
      <PricingSection />

      {/* Contact */}
      <ContactSection 
        clinicAddress={data?.settings?.clinic_address}
        clinicPhone={data?.settings?.clinic_phone}
        clinicWhatsapp={data?.settings?.clinic_whatsapp}
        clinicEmail={data?.settings?.clinic_email}
        clinicWorkingHours={data?.settings?.clinic_working_hours}
        googleMapsEmbedUrl={data?.settings?.google_maps_embed_url}
      />

      {/* Final Call To Action */}
      <FinalCTA clinicName={data?.settings?.clinic_name || 'our clinic'} />
    </>
  );
}
