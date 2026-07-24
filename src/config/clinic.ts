export const clinic = {
  // Branding
  name: "Bright Smile Dental Clinic",
  logo: "/logo.svg",
  favicon: "/favicon.svg",
  // Colors (used in Tailwind theme overrides)
  // Brand: Blue & White (logo uses #0EA5E9)
  colors: {
    primary: "#0EA5E9",
    primaryHover: "#0284C7",
    secondary: "#1E40AF",
    accent: "#F59E0B",
    accentHover: "#D97706",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    cardBg: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    textInverse: "#FFFFFF",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
    sectionAlt: "#F1F5F9",
    navBg: "rgba(255, 255, 255, 0.85)",
    accentSubtle: "rgba(245, 158, 11, 0.1)",
    primarySubtle: "rgba(14, 165, 233, 0.1)",
  },
  // Contact
  address: "Addis Ababa, Ethiopia",
  phone: "+251-123-4567",
  whatsapp: "+251-987-6543",
  email: "info@brightsmile.com",
  // Working hours (array of strings for display)
  workingHours: [
    "Mon – Fri: 08:00 – 18:00",
    "Sat: 09:00 – 14:00",
    "Sun: Closed",
  ],
  // Social media links (optional, can be empty strings)
  social: {
    facebook: "https://facebook.com/brightsmile",
    instagram: "https://instagram.com/brightsmile",
    twitter: "https://twitter.com/brightsmile",
    linkedin: "",
  },
  // Google Maps embed (placeholder, replace with real embed URL later)
  googleMapsEmbedUrl: "<!-- Replace with actual Google Maps Embed URL -->",
  // Hero section content
  hero: {
    title: "Your Smile Is Our Priority",
    subtitle: "Professional dental care with experienced dentists using modern technology.",
  },
  // SEO metadata (defaults, can be overridden per page)
  seo: {
    title: "Bright Smile Dental Clinic – Premium Dental Care",
    description: "Experience premium dental services in Addis Ababa. From preventive care to advanced cosmetic dentistry, our expert team ensures your smile shines.",
    keywords: "dental clinic, dentistry, teeth cleaning, cosmetic dentistry, Addis Ababa",
    openGraph: {
      title: "Bright Smile Dental Clinic",
      description: "Premium dental care in Addis Ababa.",
      url: "https://www.brightsmile.com",
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Bright Smile Dental Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@brightsmile",
      title: "Bright Smile Dental Clinic",
      description: "Premium dental care in Addis Ababa.",
      image: "/images/og-image.jpg",
    },
  },
  // Images used throughout the site (placeholders)
  images: {
    heroBackground: "/images/hero-bg.jpg",
    aboutPhotos: ["/images/about-1.jpg", "/images/about-2.jpg"],
    gallery: [
      "/images/gallery-1.jpg",
      "/images/gallery-2.jpg",
      "/images/gallery-3.jpg",
    ],
  },
};
