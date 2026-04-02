/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#05060f',
        surface: '#0d0e1f',
        card: '#12132a',
        primary: '#6366f1',
        secondary: '#06b6d4',
        'text-primary': '#f1f5f9',
        'text-muted': '#94a3b8',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1, #06b6d4)',
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(99,102,241,0.25)',
        'glow-primary-hover': '0 0 60px rgba(99,102,241,0.4)',
      }
    },
  },
  plugins: [],
}
