/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',      // Main background
        'card-bg': '#1e293b',      // Cards/Forms background
        'student-blue': '#3b82f6', // Primary buttons
        'money-green': '#10b981',  // Price/Split amount text
      },
    },
  },
  plugins: [],
}