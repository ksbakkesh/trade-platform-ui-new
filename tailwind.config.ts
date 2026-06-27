import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E1A',
        surface: '#1C2333',
        'surface-2': '#252D40',
        accent: '#00D4AA',
        loss: '#FF4D4D',
        warn: '#F5A623',
        muted: '#8892A4',
        data: '#E8ECF4',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
