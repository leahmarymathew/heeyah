/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#4F46E5',
        'secondary-blue': '#E0E7FF',
      },
    },
  },
  plugins: [
    // The plugin must be included with require()
    require('@tailwindcss/forms'),
  ],
}

