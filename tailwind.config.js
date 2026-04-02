/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#6c63ff',
        secondary: '#00d4aa',
        pearl: '#f5f5ff',
        dark: '#0a0a0f',
        light: '#f7f7ff',
        body: '#555566',
      }
    },
  },
  plugins: [],
}
