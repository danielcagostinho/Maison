// NativeWind tailwind config. Token values mirror the web app's
// globals.css @theme block so palette / radii / typography stay in sync.
// When you change a token here, change it there too — and vice versa.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4900a7',
        'primary-soft': '#d1cced',
        'primary-faint': '#f8f5fb',
        'primary-line': '#efebf8',
        'primary-text-soft': '#9d8ccb',
        success: '#00a469',
        fail: '#dc0344',
        text: '#1f1135',
        'text-muted': '#7e7d80',
        line: 'rgba(223, 216, 241, 0.5)',
        fb: '#3479ea',
        google: '#4285f4',
      },
      borderRadius: {
        button: '12px',
        card: '16px',
      },
      fontFamily: {
        sans: ['ProductSansRegular'],
        bold: ['ProductSansBold'],
        italic: ['ProductSansItalic'],
        'bold-italic': ['ProductSansBoldItalic'],
      },
    },
  },
  plugins: [],
};
