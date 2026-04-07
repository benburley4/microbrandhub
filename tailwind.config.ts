import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0D0F14',
        archive:  '#F7F5F0',
        slate:    '#1C1E26',
        lume:     '#B8FF6E',
        copper:   '#C4793A',
        silver:   '#9BA0A8',
        storm:    '#3A3F4B',
        gilt:     '#C9A84C',
        cream:    '#F0EBE0',
        navy:     '#1B2A4A',
      },
      fontFamily: {
        sans:      ['Inter', 'system-ui', 'sans-serif'],
        display:   ['Syne', 'system-ui', 'sans-serif'],
        mono:      ['JetBrains Mono', 'monospace'],
        editorial: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm:  '2px',
        md:  '4px',
        lg:  '8px',
        xl:  '12px',
        full: '9999px',
      },
      boxShadow: {
        lume: '0 4px 24px rgba(184,255,110,0.08)',
        elevated: '0 10px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}

export default config
