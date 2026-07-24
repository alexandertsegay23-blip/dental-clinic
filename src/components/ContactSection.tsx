'use client';

import React, { useMemo, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from '@/components/social-icons';
import { FadeIn } from '@/components/FadeIn';
import { useLanguage } from '@/components/LanguageProvider';

interface ContactSectionProps {
  clinicAddress?: string;
  clinicPhone?: string;
  clinicWhatsapp?: string;
  clinicEmail?: string;
  clinicWorkingHours?: string;
  googleMapsEmbedUrl?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  clinicAddress = '',
  clinicPhone = '',
  clinicWhatsapp = '',
  clinicEmail = '',
  clinicWorkingHours = '',
  googleMapsEmbedUrl = '',
}) => {
  const [mapError, setMapError] = useState(false);
  const { t } = useLanguage();

  type MapEmbedConfig = {
    src: string;
    allowFullScreen?: boolean;
    loading?: 'eager' | 'lazy';
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  };

  const isValidEmbedUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return (
        parsed.hostname.includes('google.com') &&
        parsed.pathname.includes('/maps/embed')
      );
    } catch {
      return false;
    }
  };

  const allowedReferrerPolicies = new Set<React.HTMLAttributeReferrerPolicy>([
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
  ]);

  const extractGoogleMapsEmbedConfig = (input: string): MapEmbedConfig | null => {
    const trimmed = input.trim();
    if (!trimmed) {
      return null;
    }

    // If user pasted full <iframe> HTML, extract the src attribute
    if (trimmed.startsWith('<iframe')) {
      const srcMatch = trimmed.match(/src\s*=\s*["'`]\s*([^"'`]+?)\s*["'`]/i);
      if (!srcMatch?.[1]) {
        return null;
      }

      const loadingMatch = trimmed.match(/loading\s*=\s*["'`]\s*(lazy|eager)\s*["'`]/i);
      const referrerMatch = trimmed.match(/referrerpolicy\s*=\s*["'`]\s*([^"'`]+?)\s*["'`]/i);
      const hasAllowFullScreen = /\sallowfullscreen(?:\s*=\s*["'`]?[^"'`\s>]*["'`]?)?/i.test(trimmed);
      const referrerPolicy = referrerMatch?.[1]?.trim() as React.HTMLAttributeReferrerPolicy | undefined;

      return {
        src: srcMatch[1]
          .trim()
          .replace(/&/g, '&')
          .replace(/^`|`$/g, ''),
        allowFullScreen: hasAllowFullScreen,
        loading: loadingMatch?.[1]?.toLowerCase() === 'eager' ? 'eager' : 'lazy',
        referrerPolicy: referrerPolicy && allowedReferrerPolicies.has(referrerPolicy)
          ? referrerPolicy
          : undefined,
      };
    }

    // Otherwise treat it as a raw URL
    return {
      src: trimmed.replace(/&/g, '&').replace(/^`|`$/g, ''),
      allowFullScreen: true,
      loading: 'lazy',
      referrerPolicy: 'strict-origin-when-cross-origin',
    };
  };

  const mapEmbed = useMemo(() => {
    const raw = googleMapsEmbedUrl;
    const embedConfig = extractGoogleMapsEmbedConfig(raw);
    if (embedConfig?.src && isValidEmbedUrl(embedConfig.src) && !mapError) {
      return embedConfig;
    }
    return null;
  }, [mapError, googleMapsEmbedUrl]);

  const getDirectionsUrl = () => {
    const address = encodeURIComponent(clinicAddress || '');
    return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  };

  return (
    <section className="py-20 bg-[var(--color-background)]" id="contact" aria-labelledby="contact-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <span className="overline text-[var(--color-accent)] block mb-4">{t('contact.getInTouch')}</span>
          <h2 id="contact-title" className="heading-2 text-[var(--color-primary)] mb-4">
            {t('contact.visitClinic')}
          </h2>
          <p className="body-lg text-[var(--color-text)]/70 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <FadeIn direction="left" className="space-y-6">
            {[
              { icon: MapPin, title: t('contact.location'), lines: [clinicAddress] },
              { icon: Phone, title: t('contact.phone'), lines: [clinicPhone, `${clinicWhatsapp} (WhatsApp)`] },
              { icon: Mail, title: t('contact.email'), lines: [clinicEmail] },
              { icon: Clock, title: t('contact.workingHours'), lines: clinicWorkingHours?.split(',') || [] },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <div className="w-11 h-11 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">{item.title}</h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-[var(--color-text)]/70">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Get Directions Button */}
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20"
            >
              <MapPin size={18} />
              {t('contact.getDirections')}
            </a>
          </FadeIn>

          {/* Map */}
          <FadeIn direction="right">
            <div className="h-full min-h-[400px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center">
              {mapEmbed ? (
                <iframe
                  src={mapEmbed.src}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading={mapEmbed.loading || 'lazy'}
                  allowFullScreen={mapEmbed.allowFullScreen ?? true}
                  referrerPolicy={mapEmbed.referrerPolicy || 'strict-origin-when-cross-origin'}
                  className="w-full h-full min-h-[400px]"
                  title="Clinic Location"
                  onError={() => setMapError(true)}
                />
              ) : (
                <div className="text-center p-8">
                  <MapPin size={48} className="mx-auto text-[var(--color-primary)]/30 mb-4" />
                  <p className="text-[var(--color-text)]/50 mb-2">{clinicAddress || t('contact.addressNotSet')}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicAddress || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
                  >
                    {t('contact.viewOnGoogleMaps')}
                  </a>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
