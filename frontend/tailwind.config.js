/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Scan all JSX/TSX files for Tailwind classes
  ],
  theme: {
    extend: {} // Extend the default Tailwind theme here if needed
  },
  plugins: []
}
