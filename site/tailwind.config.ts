import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Tailwind configuration for Bright Smile Dental Clinic.
 * Brand: Blue & White (logo #0EA5E9)
 * Uses CSS variables defined in globals.css for theme colors.
 * Dark mode enabled via 'class' strategy — toggled by ThemeProvider.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'card-bg': 'var(--color-card-bg)',
        'section-alt': 'var(--color-section-alt)',
        'nav-bg': 'var(--color-nav-bg)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-inverse': 'var(--color-text-inverse)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        'accent-subtle': 'var(--color-accent-subtle)',
        'primary-subtle': 'var(--color-primary-subtle)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,0.1)',
        soft: '0 2px 12px rgba(0,0,0,0.05)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
};
export default config;
