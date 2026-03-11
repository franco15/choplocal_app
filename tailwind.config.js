/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
          'sans': ['Inter_400Regular', 'Inter_500Medium', 'Inter_600SemiBold', 'Inter_700Bold'],
      },
      colors: {
        primary: "#030014",
        secondary: "#151312",
        background: "#FFFFFF",
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
        'chop-red': {
          '50': '#fef2f2',
          '100': '#fde3e3',
          '200': '#fccbcb',
          '300': '#f9a8a8',
          '400': '#f37575',
          '500': '#e94848',
          '600': '#d52a2a',
          '700': '#96190F',
          '800': '#7f1a12',
          '900': '#6a1b15',
          '950': '#3a0a07',
        },
      }
    },
  },
  plugins: [],
}