'use client';

import React, { useEffect, useState } from 'react';
import { useClinic } from '@/components/ClinicProvider';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface SeoProps {
  initialFaqs?: FAQ[];
}

export const Seo: React.FC<SeoProps> = ({ initialFaqs = [] }) => {
  const { settings } = useClinic();
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);

  useEffect(() => {
    if (initialFaqs.length > 0) {
      setFaqs(initialFaqs);
      return;
    }

    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.faqs || []);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs for SEO:', error);
      }
    };
    fetchFaqs();
  }, [initialFaqs]);

  const workingHours = settings.clinic_working_hours?.split(',').filter(Boolean) || [];
  const openingHours = workingHours.map(h => {
    const dayMap: Record<string, string> = {
      'Mon': 'Monday', 'Mon – Fri': 'Monday',
      'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday',
      'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday',
    };
    const day = Object.keys(dayMap).find(d => h.startsWith(d));
    return day ? dayMap[day] : 'Monday';
  });

  const schemas = [
    // LocalBusiness / Dentist
    {
      '@context': 'https://schema.org',
      '@type': 'Dentist',
      name: settings.clinic_name || 'Dental Clinic',
      image: '/logo.svg',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://www.example.com',
      telephone: settings.clinic_phone,
      email: settings.clinic_email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.clinic_address,
        addressLocality: settings.clinic_address?.split(',')[1]?.trim() || settings.clinic_address?.split(',')[0]?.trim() || 'City',
        addressRegion: settings.clinic_address?.split(',')[1]?.trim() || settings.clinic_address?.split(',')[0]?.trim() || 'Region',
        postalCode: '1000',
        addressCountry: 'ET',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 9.0320,
        longitude: 38.7469,
      },
      openingHoursSpecification: workingHours
        .filter(h => !h.includes('Closed'))
        .map(h => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: h.includes('14:00') ? '14:00' : '18:00',
        })),
      sameAs: [
        settings.clinic_social_facebook,
        settings.clinic_social_instagram,
        settings.clinic_social_twitter,
        settings.clinic_social_linkedin,
      ].filter(Boolean),
      priceRange: 'ETB 1,500 – Custom',
      medicalSpecialty: 'Dentistry',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Dental Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Professional Teeth Cleaning' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Teeth Whitening' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dental Implants' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Orthodontics / Braces' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Porcelain Veneers' } },
        ],
      },
    },

    // FAQPage schema
    ...(faqs.length > 0 ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }] : []),

    // BreadcrumbList (homepage)
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://www.example.com',
        },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Open Graph extras */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:creator" content={settings.clinic_social_twitter?.replace('https://twitter.com/', '').replace('https://x.com/', '') || 'clinic'} />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Theme color */}
      <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#F8FAFC" media="(prefers-color-scheme: light)" />

      {/* Canonical hint */}
      <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : 'https://www.example.com'} />
    </>
  );
};
