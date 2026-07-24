import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileFAB from '@/components/MobileFAB';
import { Seo } from '@/components/Seo';
import { ThemeProvider } from '@/components/ThemeProvider';
import PublicLayout from '@/components/PublicLayout';
import { ClinicProvider } from '@/components/ClinicProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import TawkToChat from '@/components/TawkToChat';
import { PageMetaUpdater } from '@/components/PageMetaUpdater';
import { getSettings } from '@/lib/repository';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const settingsMap: Record<string, string> = {};
  settings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  const clinicName = settingsMap.clinic_name || 'Dental Clinic';
  const siteDescription = settingsMap.site_description || 'Experience premium dental services. From preventive care to advanced cosmetic dentistry, our expert team ensures your smile shines.';
  const siteKeywords = settingsMap.site_keywords || 'dental clinic, dentistry, teeth cleaning, cosmetic dentistry';
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

  return {
    metadataBase,
    title: clinicName,
    description: siteDescription,
    keywords: siteKeywords.split(',').map((k: string) => k.trim()),
    openGraph: {
      title: clinicName,
      description: siteDescription,
      url: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com'),
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: clinicName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      site: settingsMap.clinic_social_twitter?.replace('https://twitter.com/', '').replace('https://x.com/', '') || 'clinic',
      title: clinicName,
      description: siteDescription,
      images: ["/images/og-image.jpg"],
    },
    robots: 'index, follow',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-[var(--color-background)] text-[var(--color-text)] font-sans antialiased">
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var theme = stored || (prefersDark ? 'dark' : 'light');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
        <ThemeProvider>
          <Seo />
          <PageMetaUpdater />
          <ClinicProvider>
            <LanguageProvider>
              <PublicLayout>
                <main className="min-h-screen pb-20">{children}</main>
              </PublicLayout>
              <TawkToChat />
            </LanguageProvider>
          </ClinicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
