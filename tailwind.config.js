/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#292929",
        accent: {
          green: "#4caf50",
          red: "#f44336",
          purple: "#9c27b0",
          blue: "#2196f3",
        },
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
} 