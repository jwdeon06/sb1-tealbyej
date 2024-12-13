/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF', 
          200: '#B8DBFF',
          300: '#8AC2FF',
          400: '#5CA9FF',
          500: '#2E90FF',
          600: '#0066FF',
          700: '#0047B3',
          800: '#003380',
          900: '#001F4D'
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}