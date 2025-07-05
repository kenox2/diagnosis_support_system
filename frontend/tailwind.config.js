/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      colors: {
        grayish: '#AEAEAE',
        darkgray: '#484848',
      },
      backgroundImage: {
        'gray-gradient': 'linear-gradient(to bottom, #AEAEAE, #484848)',
      }
    },
  },
  plugins: [],
}

