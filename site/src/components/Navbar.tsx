'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, ChevronDown } from '@/components/social-icons';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useClinic } from '@/components/ClinicProvider';
import { useLanguage } from '@/components/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const SunIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { settings, loading } = useClinic();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = scrolled
    ? 'bg-nav-bg backdrop-blur-md shadow-soft border-b border-border'
    : 'bg-nav-bg/80 backdrop-blur-md';
  const navText = 'text-text';
  const navTextMuted = 'text-text-muted';

  const mainNavItems = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/doctors', label: t('nav.doctors') },
    { href: '/about', label: t('nav.about') },
  ];

  const dropdownItems = [
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/before-after', label: t('nav.beforeAfter') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/testimonials', label: t('nav.testimonials') },
    { href: '/faq', label: t('nav.faq') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navBg}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt={`${settings.clinic_name || 'Clinic'} logo`}
            width={40}
            height={40}
            className="object-contain"
          />
          <span className={`text-lg font-semibold hidden md:inline ${navText}`}>
            {loading ? 'Loading...' : (settings.clinic_name || 'Clinic')}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center space-x-8">
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${navTextMuted}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {/* Dropdown */}
          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${navTextMuted}`}
            >
              More <ChevronDown size={14} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-card-bg rounded-xl shadow-xl border border-border py-2 z-50">
                {dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-text hover:bg-background hover:text-primary transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Right side: Theme toggle + Language + Contact + CTA */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${navTextMuted} hover:text-primary hover:bg-primary/10`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          <a
            href={`tel:${settings.clinic_phone}`}
            className={`hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors ${navText}`}
            aria-label={t('nav.callClinic')}
          >
            <Phone size={16} />
            <span className="hidden lg:inline">{settings.clinic_phone}</span>
          </a>
          <a
            href={`https://wa.me/${(settings.clinic_whatsapp || '').replace(/\+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${navText}`}
            aria-label="WhatsApp clinic"
          >
            <WhatsAppIcon size={20} />
          </a>
          <Link
            href="/appointment"
            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('nav.bookNow')}
          </Link>
          {/* Mobile menu toggle */}
          <button
            className={`lg:hidden focus:outline-none transition-colors ${navText}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card-bg border-t border-border shadow-lg">
          <ul className="flex flex-col py-4 px-6">
            {[...mainNavItems, ...dropdownItems].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-text font-medium hover:text-primary transition-colors border-b border-border last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Theme toggle in mobile */}
            <li className="pt-3 pb-1 flex items-center justify-between border-b border-border">
              <span className="text-sm text-text-muted">{t('nav.darkMode')}</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-primary font-medium text-sm"
              >
                {theme === 'light' ? <><MoonIcon size={16} /> Enable</> : <><SunIcon size={16} /> Light</>}
              </button>
            </li>
            {/* Language switcher in mobile */}
            <li className="pt-3 pb-1 flex items-center justify-between border-b border-border">
              <span className="text-sm text-text-muted">Language</span>
              <LanguageSwitcher />
            </li>
            <li className="pt-4">
              <Link
                href="/appointment"
                className="block w-full text-center px-5 py-3 bg-primary text-text-inverse font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.bookAppointment')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
