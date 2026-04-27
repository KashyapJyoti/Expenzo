/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#22c55e",
          dark: "#16a34a"
        },
        income: "#22c55e",
        expense: "#ef4444"
      },
      boxShadow: {
        "soft": "0 18px 45px rgba(15,23,42,0.35)"
      }
    }
  },
  plugins: []
};
