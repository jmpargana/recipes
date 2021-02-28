module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      textColor: ['active'],
      backgroundColor: ['checked'],
      borderColor: ['active', 'focus-visible', 'checked']
    },
  },
  plugins: [],
}
