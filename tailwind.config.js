/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind 3 uses JIT by default and scans these files to generate only the
  // utility classes actually used, keeping the output CSS small.
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
