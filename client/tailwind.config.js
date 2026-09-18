/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        border: {
          light: 'hsl(214, 9%, 86%)',
          dark: 'hsl(215, 10%, 20%)',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        'surface-secondary': {
          light: '#f5f5f5',
          dark: '#242424',
        },
        text: {
          primary: {
            light: '#171717',
            dark: '#fafafa',
          },
          secondary: {
            light: '#525252',
            dark: '#a3a3a3',
          },
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}


