/** @type {import('tailwindcss').Config} */
module.exports = {
  // BAGIAN PENTING ADA DI SINI
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ------------------------------------
  theme: {
    extend: {
      colors: {
        'brand-primary': '#003DB2',
        'brand-secondary': '#28ABF9',
        'brand-background': '#FFFFFF',
        'brand-text-dark': '#1a202c',
        'brand-text-light': '#FFFFFF',
      },
    },
  },
  plugins: [],
};