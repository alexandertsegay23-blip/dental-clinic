'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <FadeIn>
          {/* 404 Visual */}
          <div className="relative mb-8">
            <div className="text-[180px] font-bold text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <Search size={48} className="text-text-inverse" />
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-primary mb-4">Page Not Found</h1>
          <p className="text-lg text-text/60 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you may have typed the wrong URL.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg hover:bg-card-bg transition-colors"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-text/50 mb-4">Or explore:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { href: '/services', label: 'Our Services' },
                { href: '/doctors', label: 'Meet Our Doctors' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/appointment', label: 'Book Appointment' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-text/60 hover:text-primary hover:bg-card-bg rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
