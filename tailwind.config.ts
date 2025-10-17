import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#F8F8F8',
        'text-light': '#111827',
        'background-dark': '#111119',
        'text-dark': '#E5E7EB',
        'lavender': '#8B5CF6',
        'gray-detail': '#9CA3AF',
        'gray-dark-detail': '#374151',
      }
    },
  },
  plugins: [],
}
export default config