import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// Ocean Blue Serenity palette — the only colours the UI uses. Text on serenity or mist is always navy (WCAG AA).
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0077BE', dark: '#005A91' },
        navy: '#0B2545',
        serenity: '#B3CEE5',
        mist: '#EEF5FB',
        'teal-accent': '#069494',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        // Archivo for everything; Plex Mono only for part numbers and spec values.
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      // Major-third scale: 13 / 16 / 20 / 25 / 31 / 39 / 49.
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.4' }],
        sm: ['0.875rem', { lineHeight: '1.45' }],
        base: ['1rem', { lineHeight: '1.55' }],
        lg: ['1.25rem', { lineHeight: '1.35' }],
        xl: ['1.5625rem', { lineHeight: '1.2' }],
        '2xl': ['1.9375rem', { lineHeight: '1.15' }],
        '3xl': ['2.4375rem', { lineHeight: '1.08' }],
        '4xl': ['3.0625rem', { lineHeight: '1.04' }],
      },
      // Radius follows hierarchy: drawers 3, controls 6, panels 10, chips full.
      borderRadius: { drawer: '3px', control: '6px', panel: '10px' },
      boxShadow: { pulled: '0 10px 14px -8px rgba(11, 37, 69, 0.45)' },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.font-expanded': { 'font-stretch': '118%' },
        '.font-wide': { 'font-stretch': '125%' },
      });
    }),
  ],
};
export default config;
