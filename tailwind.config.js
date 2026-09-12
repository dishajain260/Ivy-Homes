/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: "#0018A8",
          blueHover: "#00118A",
          blueLight: "#EEF2FF",
          blueSoft: "#E0E5FF",
          gold: "#F9E392",
          dark: "#09090B",
          surface: "#111111",
          border: "#E4E4E7",
        },
        ivy: {
          50: "#EEF2FF",
          100: "#E0E5FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#4F46E5",
          600: "#0018A8",
          700: "#00118A",
          800: "#1E1B4B",
          900: "#0F0E2A",
          950: "#080718",
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -4px rgba(0, 24, 168, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 35px -10px rgba(0, 24, 168, 0.14), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'brand': '0 10px 25px -5px rgba(0, 24, 168, 0.3)',
      }
    },
  },
  plugins: [],
}
