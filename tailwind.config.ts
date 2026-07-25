/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9', // teal-500
        secondary: '#14B8A6', // teal-600
        background: '#F9FAFB',
        glass: 'rgba(255,255,255,0.2)',
        // Map CSS variables for consistent theming
        surface: 'var(--color-surface)',
        'card-bg': 'var(--color-card-bg)',
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
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
