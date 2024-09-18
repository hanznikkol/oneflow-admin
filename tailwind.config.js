/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        'primary' : '#00306E',
        'secondary' : '#FEF200',
        'dark-secondary' : '#FEB019',
        'accent' : '#DEECFF',
        'light-accent': '#F1F7FF',
        'pure-white': '#FFFFFF',
        'white': '#F2F2F2',
        'black': '#080808',
        'gray' : '#D9D9D9',
        'light-gray' : '#F4F7F7',
        'main-gray': '#F4F4F4',
        'label-gray': '#5A5A5A',
        'custom-red' : '#B62335',
        'pdf-red': '#A32724',
        'excel-green': '#185C37'
      },

      fontFamily: {
        'inter': ['"Inter", sans-serif']
      }

    },
  },
  plugins: [],
}

