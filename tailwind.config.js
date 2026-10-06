/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F5F3',
          100: '#DCE7E3',
          200: '#B8CEC6',
          300: '#8FB1A5',
          400: '#5F8E7F',
          500: '#2E6B57', // Emerald
          600: '#235746',
          700: '#1B4638',
          800: '#173F35', // Deep Forest
          900: '#0E2822',
          950: '#071612',
        },
        terracotta: {
          50: '#FAF2F0',
          100: '#F5E2DC',
          200: '#E8C1B7',
          300: '#D99C8D',
          400: '#C97763',
          500: '#B85C45', // Warm Terracotta
          600: '#9E4733',
          700: '#7E3626',
          800: '#60281B',
          900: '#421B12',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F3EAD7',
          200: '#E6D3AC',
          300: '#D9BC80',
          400: '#CCA754',
          500: '#C99A3D', // Saffron / Warm Gold
          600: '#A67B2A',
          700: '#7F5C1B',
          800: '#593F10',
          900: '#332308',
        },
        sage: {
          50: '#F4F6F3',
          100: '#E6ECE5',
          200: '#CEDBCB',
          300: '#A8B9A5', // Soft Sage
          400: '#879E83',
          500: '#688264',
          600: '#50674C',
          700: '#3B4D38',
        },
        rose: {
          50: '#FDF7F6',
          100: '#F9ECE9',
          200: '#F0D4CE',
          300: '#E3B5AB',
          400: '#C98F83', // Muted Rose
          500: '#B26F62',
        },
        ivory: '#F7F3EA',
        cream: '#FFFDF8',
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#636363',
          600: '#464646',
          700: '#323734',
          800: '#202522', // Charcoal
          900: '#141715',
          950: '#0A0C0B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 63, 53, 0.06), 0 2px 6px -1px rgba(23, 63, 53, 0.04)',
        'card': '0 10px 30px -5px rgba(23, 63, 53, 0.08), 0 4px 12px -2px rgba(23, 63, 53, 0.03)',
        'elevated': '0 20px 40px -10px rgba(23, 63, 53, 0.12), 0 8px 16px -4px rgba(23, 63, 53, 0.05)',
        'inner-subtle': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        'neumorph-sm': '3px 3px 6px #e6e2d9, -3px -3px 6px #ffffff',
        'neumorph-inset': 'inset 2px 2px 5px #e6e2d9, inset -2px -2px 5px #ffffff',
      },
      backgroundImage: {
        'noise-pattern': "radial-gradient(rgba(23, 63, 53, 0.04) 1px, transparent 0)",
        'notebook-lines': "repeating-linear-gradient(transparent, transparent 27px, #e8dfcf 28px)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
