import { clinic } from './clinic';

/**
 * Theme configuration used by Tailwind CSS.
 * Brand colors: Blue & White (matches logo #0EA5E9)
 */
export const theme = {
  colors: {
    primary: clinic.colors?.primary ?? '#0EA5E9',
    primaryHover: clinic.colors?.primaryHover ?? '#0284C7',
    secondary: clinic.colors?.secondary ?? '#1E40AF',
    accent: clinic.colors?.accent ?? '#F8FAFC',
    accentHover: clinic.colors?.accentHover ?? '#F1F5F9',
    background: clinic.colors?.background ?? '#FFFFFF',
    surface: clinic.colors?.surface ?? '#F8FAFC',
    cardBg: clinic.colors?.cardBg ?? '#FFFFFF',
    text: clinic.colors?.text ?? '#0F172A',
    textMuted: clinic.colors?.textMuted ?? '#64748B',
    textInverse: clinic.colors?.textInverse ?? '#FFFFFF',
    border: clinic.colors?.border ?? '#E2E8F0',
    borderLight: clinic.colors?.borderLight ?? '#F1F5F9',
    success: clinic.colors?.success ?? '#059669',
    warning: clinic.colors?.warning ?? '#D97706',
    error: clinic.colors?.error ?? '#DC2626',
    sectionAlt: clinic.colors?.sectionAlt ?? '#F1F5F9',
    navBg: clinic.colors?.navBg ?? 'rgba(255, 255, 255, 0.85)',
    accentSubtle: clinic.colors?.accentSubtle ?? 'rgba(14, 165, 233, 0.08)',
    primarySubtle: clinic.colors?.primarySubtle ?? 'rgba(14, 165, 233, 0.1)',
  },
  radius: '0.75rem',
  radiusSm: '0.5rem',
  radiusLg: '1rem',
  shadows: {
    subtle: '0 1px 2px rgba(0,0,0,0.04)',
    medium: '0 4px 12px rgba(0,0,0,0.06)',
    large: '0 12px 32px rgba(0,0,0,0.08)',
    card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    glass: '0 4px 30px rgba(0,0,0,0.1)',
    glow: '0 0 20px rgba(14, 165, 233, 0.2)',
  },
} as const;
