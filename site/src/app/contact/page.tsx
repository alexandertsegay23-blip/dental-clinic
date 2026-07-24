'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from '@/components/social-icons';
import { FadeIn } from '@/components/FadeIn';
import { useClinic } from '@/components/ClinicProvider';
import { useLanguage } from '@/components/LanguageProvider';

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ContactPage() {
  const { settings } = useClinic();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const [mapError, setMapError] = useState(false);

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

  const extractGoogleMapsEmbedUrl = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // If user pasted full <iframe> HTML, extract the src attribute
    if (trimmed.startsWith('<iframe')) {
      const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1].trim();
      }
      return null;
    }

    // Otherwise treat it as a raw URL
    return trimmed;
  };

  const getMapEmbedUrl = (): string | undefined => {
    const raw = settings.google_maps_embed_url;
    const embedUrl = extractGoogleMapsEmbedUrl(raw);
    if (embedUrl && isValidEmbedUrl(embedUrl) && !mapError) {
      return embedUrl;
    }
    return undefined;
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="text-center mb-14">
         <span className="overline text-primary block mb-4">{t('contact.getInTouch')}</span>
         <h1 className="heading-1 text-text mb-4">{t('contact.title')}</h1>
         <p className="body-lg text-text/70 max-w-2xl mx-auto">
           {t('contact.subtitle')}
         </p>
       </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <FadeIn direction="left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: MapPin, title: t('contact.location'), lines: [settings.clinic_address || t('contact.addressNotSet')] },
                  { icon: Phone, title: t('contact.phone'), lines: [settings.clinic_phone || t('contact.phoneNotSet'), settings.clinic_whatsapp ? `${settings.clinic_whatsapp} (WhatsApp)` : ''].filter(Boolean) },
                  { icon: Mail, title: t('contact.email'), lines: [settings.clinic_email || t('contact.emailNotSet')] },
                  { icon: Clock, title: t('contact.workingHours'), lines: settings.clinic_working_hours?.split(',') || [t('contact.hoursNotSet')] },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl bg-card-bg border border-border">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">{item.title}</h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-sm text-text/70">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Get Directions Button */}
            <FadeIn direction="left" delay={0.1}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.clinic_address || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary text-text-inverse font-semibold rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20"
              >
                <MapPin size={20} />
                {t('contact.getDirections')}
              </a>
            </FadeIn>

            {/* WhatsApp Button */}
            {settings.clinic_whatsapp && (
              <FadeIn direction="left" delay={0.15}>
                <a
                  href={`https://wa.me/${settings.clinic_whatsapp.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#25D366] text-text-inverse font-semibold rounded-xl hover:bg-[#128C7E] transition-all duration-300 shadow-lg shadow-[#25D366]/20"
                >
                  <WhatsAppIcon size={20} />
                  {t('contact.chatOnWhatsApp')}
                </a>
              </FadeIn>
            )}

            {/* Social Links */}
            {(settings.clinic_social_facebook || settings.clinic_social_instagram || settings.clinic_social_twitter || settings.clinic_social_linkedin) && (
              <FadeIn direction="left" delay={0.2}>
                <div className="bg-card-bg rounded-xl border border-border p-6">
                  <h3 className="text-sm font-semibold text-text mb-4">{t('contact.followUs')}</h3>
                  <div className="flex gap-3">
                    {settings.clinic_social_facebook && (
                      <a href={settings.clinic_social_facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      </a>
                    )}
                    {settings.clinic_social_instagram && (
                      <a href={settings.clinic_social_instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                      </a>
                    )}
                    {settings.clinic_social_twitter && (
                      <a href={settings.clinic_social_twitter} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                    )}
                    {settings.clinic_social_linkedin && (
                      <a href={settings.clinic_social_linkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Contact Form */}
            <FadeIn direction="left" delay={0.25}>
              <div className="bg-card-bg rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-4">{t('contact.sendMessage')}</h3>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-success" />
                    </div>
                    <h4 className="text-lg font-semibold text-text mb-2">{t('contact.messageSent')}</h4>
                    <p className="text-sm text-text/60">{t('contact.messageSentSubtitle')}</p>
                    <button onClick={() => setSubmitted(false)} className="mt-4 text-primary hover:underline text-sm">{t('contact.sendAnother')}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder={t('contact.yourName')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                       type="email"
                       placeholder={t('contact.emailAddress')}
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       required
                       className="w-full px-4 py-3 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                     <input
                       type="tel"
                       placeholder={t('contact.phoneNumber')}
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       className="w-full px-4 py-3 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                    </div>
                    <div>
                      <textarea
                        placeholder={t('contact.yourMessage')}
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50"
                    >
                      <Send size={18} />
                      {submitting ? t('contact.sending') : t('contact.sendMessageBtn')}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Right Column - Map */}
          <FadeIn direction="right">
            <div className="sticky top-24">
              <div className="h-[600px] rounded-2xl overflow-hidden border border-border bg-card-bg">
            {getMapEmbedUrl() ? (
              <iframe
                src={getMapEmbedUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title="Clinic Location"
                onError={() => setMapError(true)}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <MapPin size={64} className="text-primary/20 mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">{t('contact.clinicLocation')}</h3>
                <p className="text-text/50 mb-4">{settings.clinic_address || t('contact.addAddressInSettings')}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.clinic_address || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors text-sm"
                >
                  <MapPin size={16} />
                  {t('contact.viewOnGoogleMaps')}
                </a>
              </div>
            )}
          </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
