import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/FadeIn';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin } from '@/components/social-icons';
import { useClinic } from '@/components/ClinicProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function Footer() {
  const { settings, loading } = useClinic();
  const { t } = useLanguage();

  if (loading) {
    return null;
  }

  const socialLinks = [
    { key: 'facebook', Icon: Facebook },
    { key: 'instagram', Icon: Instagram },
    { key: 'twitter', Icon: Twitter },
    { key: 'linkedin', Icon: Linkedin },
  ].filter(({ key }) => settings[`clinic_social_${key}`]);

  return (
    <footer className="bg-surface border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Branding */}
          <FadeIn>
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-3">
                <Image src="/logo.svg" alt={`${settings.clinic_name || 'Clinic'} logo`} width={40} height={40} className="object-contain" />
                <span className="text-lg font-semibold text-text">{settings.clinic_name || 'Clinic'}</span>
              </Link>
              <p className="text-sm leading-relaxed text-text-muted">
                {settings.site_description || 'Your smile is our passion and priority.'}
              </p>
              <div className="flex space-x-3 pt-2">
                {socialLinks.map(({ key, Icon }) => (
                  <a key={key} href={settings[`clinic_social_${key}`]} target="_blank" rel="noopener noreferrer" aria-label={key} className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-text-inverse transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.1}>
            <div>
              <h3 className="font-semibold text-text mb-4 text-sm tracking-wider uppercase">{t('footer.quickLinks')}</h3>
              <ul className="space-y-3">
                {[
                  { href: '/', label: t('nav.home') },
                  { href: '/about', label: t('nav.about') },
                  { href: '/services', label: t('nav.services') },
                  { href: '/doctors', label: t('nav.doctors') },
                  { href: '/contact', label: t('nav.contact') },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-text-muted hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Contact */}
          <FadeIn delay={0.2}>
            <div>
              <h3 className="font-semibold text-text mb-4 text-sm tracking-wider uppercase">{t('footer.contactInfo')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-text-muted">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                  {settings.clinic_address}
                </li>
                <li className="flex items-center gap-3 text-sm text-text-muted">
                  <Phone size={16} className="flex-shrink-0 text-primary" />
                  <a href={`tel:${settings.clinic_phone}`} className="hover:text-primary transition-colors">{settings.clinic_phone}</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-text-muted">
                  <Mail size={16} className="flex-shrink-0 text-primary" />
                  <a href={`mailto:${settings.clinic_email}`} className="hover:text-primary transition-colors">{settings.clinic_email}</a>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Working Hours */}
          <FadeIn delay={0.3}>
            <div>
              <h3 className="font-semibold text-text mb-4 text-sm tracking-wider uppercase">{t('contact.workingHours')}</h3>
              <ul className="space-y-3">
                {settings.clinic_working_hours?.split(',').map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                    <Clock size={16} className="flex-shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {settings.clinic_name || 'Clinic'}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
