/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95',
        },
        surface: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        status: {
          normal: {
            DEFAULT: '#10b981',
            bg: '#ecfdf5',
            text: '#047857',
            border: '#a7f3d0'
          },
          amber: {
            DEFAULT: '#f59e0b',
            bg: '#fffbeb',
            text: '#b45309',
            border: '#fde68a'
          },
          abnormal: {
            DEFAULT: '#ef4444',
            bg: '#fef2f2',
            text: '#b91c1c',
            border: '#fecaca'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
      }
    },
  },
  plugins: [],
}
