/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // MapLibre GL JS specific styles
      '.maplibregl-map': {
        'font-family': 'system-ui, Avenir, Helvetica, Arial, sans-serif',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
