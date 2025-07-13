/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        accent: 'var(--accent)',
        neon: 'var(--neon)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        success: 'var(--success)',
        card: 'var(--card)',
        'card-hover': 'var(--card-hover)',
      },
    },
  },
  plugins: [],
};