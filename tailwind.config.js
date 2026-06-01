/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');

module.exports = {
  // Class-based dark mode — toggled by ThemeService on the <html> element.
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // ── Galatasaray Istanbul brand palette ─────────────────────────
        gs: {
          // Primary / Crimson accent
          crimson: {
            DEFAULT: '#a80633',
            50: '#fdf2f5',
            100: '#fbe3ea',
            200: '#f6c7d6',
            300: '#ee9bb4',
            400: '#e2638b',
            500: '#d13a68',
            600: '#bb2151',
            700: '#a80633',
            800: '#85113a',
            900: '#711336',
            950: '#3f0419'
          },
          // Secondary / Gold accent
          gold: {
            DEFAULT: '#fbbb20',
            50: '#fffaeb',
            100: '#fef0c7',
            200: '#fde08a',
            300: '#fcca4d',
            400: '#fbbb20',
            500: '#f59b0b',
            600: '#d97506',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451f05'
          }
        },
        // ── Semantic surface tokens (resolve via CSS variables) ─────────
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--surface-muted) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-muted': 'rgb(var(--content-muted) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(168, 6, 51, 0.15), 0 12px 32px -12px rgba(168, 6, 51, 0.45)',
        gold: '0 0 0 1px rgba(251, 187, 32, 0.25), 0 8px 24px -10px rgba(251, 187, 32, 0.5)'
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-node': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(168, 6, 51, 0.5)' },
          '50%': { boxShadow: '0 0 0 10px rgba(168, 6, 51, 0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
        'pulse-node': 'pulse-node 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [primeui]
};
