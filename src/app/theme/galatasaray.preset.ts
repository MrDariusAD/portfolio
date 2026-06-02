import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/**
 * Galatasaray-themed PrimeNG preset.
 *
 * Built on top of the Aura base preset, this overrides the `primary` colour
 * ramp with Galatasaray crimson (#a80633) and re-points the highlight / focus
 * tokens so every PrimeNG component (dialogs, buttons, select-buttons, chips,
 * sliders…) inherits the brand instead of the default emerald/blue presets.
 *
 * The gold accent (#fbbb20) is applied through Tailwind utilities at the
 * component level rather than as the PrimeNG `primary`, keeping crimson as the
 * dominant interactive colour and gold as the secondary highlight.
 */
export const GalatasarayPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf2f5',
      100: '#fbe3ea',
      200: '#f6c7d6',
      300: '#ee9bb4',
      400: '#e2638b',
      500: '#a80633', // crimson — the brand primary
      600: '#97052e',
      700: '#85113a',
      800: '#711336',
      900: '#5c0f2c',
      950: '#3f0419'
    },
    colorScheme: {
      light: {
        primary: {
          color: '#a80633',
          contrastColor: '#ffffff',
          hoverColor: '#85113a',
          activeColor: '#711336'
        },
        highlight: {
          background: 'rgba(168, 6, 51, 0.10)',
          focusBackground: 'rgba(168, 6, 51, 0.18)',
          color: '#85113a',
          focusColor: '#5c0f2c'
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      dark: {
        primary: {
          color: '#fbbb20', // gold reads better on dark surfaces
          contrastColor: '#0f172a',
          hoverColor: '#fcca4d',
          activeColor: '#f59b0b'
        },
        highlight: {
          background: 'rgba(251, 187, 32, 0.14)',
          focusBackground: 'rgba(251, 187, 32, 0.24)',
          color: '#fcca4d',
          focusColor: '#fde08a'
        },
        // Warm-charcoal surface ramp (subtle crimson hint, not full maroon) so
        // PrimeNG dark-mode components — dialogs, inputs, select buttons,
        // tooltips — match the dark canvas instead of cool slate-blue.
        surface: {
          0: '#ffffff',
          50: '#f9f4f6',
          100: '#efe6ea',
          200: '#ddccd2',
          300: '#c0a8b1',
          400: '#9c7e8a',
          500: '#7a5e6b',
          600: '#5e4854',
          700: '#483641',
          800: '#322630',
          900: '#221a20',
          950: '#181317'
        }
      }
    }
  }
});
