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
          primary: '#E5252A',
          hover: '#C81E23',
          light: '#FEE2E2',
          subtle: '#FFF1F2',
          sparkle: '#FF3838',
        },
        slateNavy: {
          950: '#0B0F19',
          900: '#111827',
          800: '#1E293B',
          700: '#334155',
          500: '#5C6F84',
          400: '#94A3B8',
          100: '#F1F5F9',
          50:  '#F8FAFC',
        },
        urgency: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#3B82F6',
          low: '#10B981',
        },
        shield: {
          purple: '#8B5CF6',
          light: '#F3E8FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px -5px rgba(229, 37, 42, 0.35)',
        'glow-card': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
