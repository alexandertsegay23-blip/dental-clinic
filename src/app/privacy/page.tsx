'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';
import { useClinic } from '@/components/ClinicProvider';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { settings } = useClinic();
  const clinicName = settings.clinic_name || 'our clinic';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-text-inverse/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-text-inverse/70 hover:text-text-inverse mb-6 transition-colors">
              <ArrowLeft size={18} />
              Back to Home
            </Link>
            <h1 className="display text-text-inverse mb-4">Privacy Policy</h1>
            <p className="body-lg text-text-inverse/70">
              Last updated: {currentDate}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="prose prose-lg max-w-none text-text/70">
              <p className="text-lg">
                At {clinicName}, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, date of birth, and other contact details.</li>
                <li><strong>Medical Information:</strong> Dental history, treatment records, medical conditions, and other health-related information.</li>
                <li><strong>Payment Information:</strong> Credit card numbers, billing addresses, and other payment details.</li>
                <li><strong>Communication Data:</strong> Messages you send us through contact forms, emails, or other channels.</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, maintain, and improve our dental services</li>
                <li>Schedule and manage appointments</li>
                <li>Send appointment reminders via SMS or WhatsApp</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Process payments and maintain billing records</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">3. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Service Providers:</strong> Third parties who perform services on our behalf (SMS providers, payment processors)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and access controls.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">6. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar technologies to enhance your browsing experience. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">7. SMS and WhatsApp Communications</h2>
              <p>
                By providing your phone number, you consent to receive appointment reminders and other communications from {clinicName} via SMS or WhatsApp. Message and data rates may apply. You can opt out at any time by contacting us.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">8. Children's Privacy</h2>
              <p>
                We do not knowingly collect personal information from children under 18 without parental consent. If you believe we have collected such information, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-card-bg rounded-lg p-6 mt-4 border border-border">
                <p className="font-semibold text-text">{clinicName}</p>
                <p className="mt-2">{settings.clinic_address || 'Address not set'}</p>
                <p>Phone: {settings.clinic_phone || 'N/A'}</p>
                <p>Email: {settings.clinic_email || 'N/A'}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="heading-2 text-primary mb-4">Have Questions?</h2>
            <p className="body-lg text-text/70 mb-8">
              We're here to help. Reach out to our team for any concerns about your privacy.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Contact Us
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
