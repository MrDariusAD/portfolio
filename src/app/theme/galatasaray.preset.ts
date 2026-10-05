import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/**
 * INT Design System preset for PrimeNG (Galatasaray crimson + gold).
 *
 * Built on Aura; re-points `primary` to the DS crimson tonal palette and the
 * surface ramps to the DS warm, rose-tinted neutrals so every PrimeNG component
 * (dialog, inputs, tooltips…) matches the INT tokens in styles.scss.
 * Light primary = #7C0320 (ink fill), dark primary = #FFB3B5 (crimson-80).
 */
export const GalatasarayPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#ffedec',
      100: '#ffdada',
      200: '#ffb3b5',
      300: '#ff888f',
      400: '#f0606e',
      500: '#ce4756',
      600: '#ad2e40',
      700: '#9d2235',
      800: '#7c0320',
      900: '#680019',
      950: '#40000c'
    },
    colorScheme: {
      light: {
        primary: {
          color: '#7c0320',
          contrastColor: '#ffffff',
          hoverColor: '#8c142a',
          activeColor: '#680019'
        },
        highlight: {
          background: 'rgba(124, 3, 32, 0.08)',
          focusBackground: 'rgba(124, 3, 32, 0.14)',
          color: '#7c0320',
          focusColor: '#680019'
        },
        surface: {
          0: '#ffffff',
          50: '#fff8f7',
          100: '#fff0f0',
          200: '#fce9e9',
          300: '#f5dddd',
          400: '#dfbfbf',
          500: '#a78a8a',
          600: '#806566',
          700: '#584142',
          800: '#3b2d2e',
          900: '#251819',
          950: '#1c1011'
        }
      },
      dark: {
        primary: {
          color: '#ffb3b5',
          contrastColor: '#5c1018',
          hoverColor: '#ffdada',
          activeColor: '#ff888f'
        },
        highlight: {
          background: 'rgba(255, 179, 181, 0.12)',
          focusBackground: 'rgba(255, 179, 181, 0.2)',
          color: '#ffdada',
          focusColor: '#ffedec'
        },
        surface: {
          0: '#ffffff',
          50: '#f5dddd',
          100: '#dfbfbf',
          200: '#a78a8a',
          300: '#806566',
          400: '#584142',
          500: '#433435',
          600: '#403131',
          700: '#342727',
          800: '#291c1d',
          900: '#251819',
          950: '#1c1011'
        }
      }
    }
  }
});
