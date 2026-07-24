'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useClinic } from './ClinicProvider';

interface PageMeta {
  title: string;
  description: string;
}

const pageMetaMap: Record<string, PageMeta> = {
  '/': {
    title: 'Home',
    description: 'Premium dental care services. Expert dentists, modern facilities, and compassionate care for your perfect smile.',
  },
  '/about': {
    title: 'About Us',
    description: 'Learn about our dental clinic, our mission, values, and the expert team dedicated to your oral health.',
  },
  '/services': {
    title: 'Our Services',
    description: 'Comprehensive dental services including preventive care, cosmetic dentistry, orthodontics, and emergency care.',
  },
  '/doctors': {
    title: 'Our Doctors',
    description: 'Meet our team of board-certified dental specialists committed to providing exceptional care.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with our dental clinic. Schedule appointments, ask questions, or visit us today.',
  },
  '/appointment': {
    title: 'Book Appointment',
    description: 'Schedule your dental appointment online. Easy booking, instant confirmation, and appointment reminders.',
  },
  '/blog': {
    title: 'Dental Blog',
    description: 'Expert dental health tips, news, and advice from our professional team.',
  },
  '/gallery': {
    title: 'Gallery',
    description: 'Explore our clinic, state-of-the-art facilities, and patient transformations.',
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about dental care, appointments, and our services.',
  },
  '/testimonials': {
    title: 'Patient Testimonials',
    description: 'Read what our patients say about their experience with our dental services.',
  },
  '/before-after': {
    title: 'Before & After',
    description: 'See remarkable dental transformations and smile makeovers by our expert team.',
  },
  '/video-testimonials': {
    title: 'Video Testimonials',
    description: 'Watch real patient stories and experiences with our dental care services.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information.',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Read our terms and conditions for using our dental services.',
  },
};

export function PageMetaUpdater() {
  const pathname = usePathname();
  const { settings } = useClinic();
  const clinicName = settings.clinic_name || 'Dental Clinic';

  useEffect(() => {
    // Find matching page meta
    const meta = pageMetaMap[pathname] || {
      title: 'Page',
      description: settings.site_description || `Visit ${clinicName} for premium dental care.`,
    };

    // Update document title
    document.title = `${meta.title} | ${clinicName}`;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.description);
    }

    // Update Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', `${meta.title} | ${clinicName}`);
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    // Update Twitter
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterTitle) twitterTitle.setAttribute('content', `${meta.title} | ${clinicName}`);
    if (twitterDesc) twitterDesc.setAttribute('content', meta.description);

  }, [pathname, clinicName, settings.site_description]);

  return null;
}
