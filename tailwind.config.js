/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f5ff',
          100: '#e6f0ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          600: '#4b5563',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundColor: {
        dark: '#111827',
      },
      textColor: {
        dark: '#f3f4f6',
      },
    },
  },
  plugins: [],
} 