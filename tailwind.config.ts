import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0e17',
        surface: '#131829',
        'surface-2': '#1a2035',
        border: '#252d45',
        accent: '#ff6b6b',
        success: '#4ecdc4',
        warning: '#ffe66d',
        orange: '#ff9f43',
        text: '#e8eaf0',
        'text-dim': '#6b7394',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [],
} satisfies Config
