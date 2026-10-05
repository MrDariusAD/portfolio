/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');

module.exports = {
  // Class-based dark mode — toggled by ThemeService on the <html> element.
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // ── INT Design System brand ramps (Galatasaray crimson + gold) ──
        // Crimson follows the DS tonal palette (--int-crimson-*), 700 = ink fill #7C0320.
        gs: {
          crimson: {
            DEFAULT: '#a32638',
            50: '#ffedec',
            100: '#ffdada',
            200: '#ffb3b5',
            300: '#ff888f',
            400: '#f0606e',
            500: '#ce4756',
            600: '#ad2e40',
            700: '#7c0320',
            800: '#680019',
            900: '#40000c',
            950: '#2a0008'
          },
          gold: {
            DEFAULT: '#fcb614',
            50: '#fff8e6',
            100: '#ffedc2',
            200: '#ffdf8a',
            300: '#fdcb4d',
            400: '#fcb614',
            500: '#e89e00',
            600: '#b36200',
            700: '#8f4d00',
            800: '#6d3a00',
            900: '#4d2700',
            950: '#2e1500'
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
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace']
      },
      boxShadow: {
        glow: '0 0 22px -2px rgba(163, 38, 56, 0.2), 0 0 33px -6px rgba(252, 182, 20, 0.1)',
        gold: '0 0 0 2px #fcb614, 0 0 12px rgba(252, 182, 20, 0.35)'
      },
      transitionTimingFunction: {
        // IntMotion
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        settle: 'cubic-bezier(0.16, 1, 0.3, 1)',
        travel: 'cubic-bezier(0.5, 0, 0.2, 1)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 420ms cubic-bezier(0.16, 1, 0.3, 1) both'
      }
    }
  },
  plugins: [primeui]
};
