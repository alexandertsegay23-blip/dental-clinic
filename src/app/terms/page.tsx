'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';
import { useClinic } from '@/components/ClinicProvider';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  const { settings } = useClinic();
  const clinicName = settings.clinic_name || 'our clinic';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-text-inverse/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-text-inverse/70 hover:text-text-inverse mb-6 transition-colors">
              <ArrowLeft size={18} />
              Back to Home
            </Link>
            <h1 className="display text-text-inverse mb-4">Terms of Service</h1>
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
                Welcome to {clinicName}. By accessing our website or using our services, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using {clinicName}'s website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">2. Services Description</h2>
              <p>
                {clinicName} provides dental care services including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>General dentistry (examinations, cleanings, fillings)</li>
                <li>Cosmetic dentistry (whitening, veneers, smile design)</li>
                <li>Restorative dentistry (crowns, bridges, implants)</li>
                <li>Orthodontics (braces, aligners)</li>
                <li>Emergency dental care</li>
                <li>Online appointment scheduling</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">3. Appointments and Cancellations</h2>
              <p><strong>Scheduling:</strong> Appointments can be booked online through our website or by contacting our office directly.</p>
              <p className="mt-4"><strong>Confirmation:</strong> All appointments must be confirmed by our staff. You will receive a confirmation via SMS or email.</p>
              <p className="mt-4"><strong>Cancellation Policy:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>We require at least 24 hours notice for cancellations or rescheduling.</li>
                <li>Late cancellations (less than 24 hours) may result in a cancellation fee.</li>
                <li>No-shows may be subject to a no-show fee.</li>
                <li>Repeated no-shows may result in requiring advance payment for future appointments.</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">4. Payment Terms</h2>
              <p><strong>Payment Methods:</strong> We accept cash, credit cards, debit cards, and mobile payment methods.</p>
              <p className="mt-4"><strong>Insurance:</strong> Please verify your insurance coverage before your appointment. We are not responsible for coverage decisions made by your insurance provider.</p>
              <p className="mt-4"><strong>Payment Responsibility:</strong> You are responsible for all charges not covered by insurance, including deductibles, co-pays, and services not covered by your plan.</p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">5. Patient Responsibilities</h2>
              <p>As a patient, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide accurate and complete health information</li>
                <li>Inform us of any changes to your contact information</li>
                <li>Arrive on time for scheduled appointments</li>
                <li>Follow post-treatment care instructions</li>
                <li>Treat our staff and other patients with respect</li>
                <li>Pay for services as agreed</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">6. Medical Disclaimer</h2>
              <p>
                The information provided on this website is for general informational purposes only and should not be considered as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your dentist or qualified healthcare provider with any questions regarding a medical condition.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">7. Communication Consent</h2>
              <p>
                By providing your contact information, you consent to receive communications from {clinicName} via:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>SMS text messages (appointment reminders, confirmations)</li>
                <li>WhatsApp messages</li>
                <li>Email</li>
                <li>Phone calls</li>
              </ul>
              <p className="mt-4">
                Message and data rates may apply. You can opt out of marketing communications at any time by contacting us.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">8. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of {clinicName} and is protected by copyright and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">9. Website Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Use our website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Use automated tools to scrape or collect data without permission</li>
                <li>Transmit viruses or other malicious code</li>
              </ul>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, {clinicName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or website.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless {clinicName}, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these Terms of Service.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">12. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your personal information.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting on this page. Your continued use of our services after changes constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">14. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of Ethiopia, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-10 mb-4">15. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
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
            <h2 className="heading-2 text-primary mb-4">Questions?</h2>
            <p className="body-lg text-text/70 mb-8">
              Our team is here to help. Don't hesitate to reach out with any questions about our terms.
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
