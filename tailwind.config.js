/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#151312",
        // choplocal
        'cl': {
          '50': '#f4f9f9',
          '100': '#d9eeeb',
          '200': '#b4dbd8',
          '300': '#86c2bf',
          '400': '#589d9c',
          '500': '#438989',
          '600': '#346c6d',
          '700': '#2d5658',
          '800': '#274648',
          '900': '#243c3d',
          '950': '#102223',
        },
      }
    },
  },
  plugins: [],
}