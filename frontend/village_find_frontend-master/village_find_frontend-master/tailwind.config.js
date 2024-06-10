/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '475px', // Custom extra small screen
      sm: '640px', // Default small screen
      md: '768px', // Default medium screen
      lg: '1024px', // Default large screen
      xl: '1280px', // Default extra large screen
      '2xl': '1536px', // Custom 2x large screen
      '3xl': '1920px', // Custom 3x large screen
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      0.5: '0.5px',
      1: '1px',
      1.5: '1.5px',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    extend: {
      backgroundColor: {
        primary: '#F2EEE9',
        secondary: '#DDDDDD',
        success: '#652F90',
        warning: '#EFD9CE',
        danger: '#957FEF',
        GRay: '#E0E0E0',
        SGray: '#A0A0A0',
        lightgray: '#F5F5F5',
        info: '#DEC0F1',
        light: '#84A98C',
        dark: '#3F3F3F',
      },
      textColor: {
        primary: '#3F3F3F',
        secondary: '#F2EEE9',
        warning: '#B5B5B5',
        dark: '#616161',
        success: '#652F90',
        light: '#84A98C',
        placeholder: '#9B9B9B',
      },
      borderColor: {
        primary: '#3F3F3F',
        secondary: '#F2EEE9',
        warning: '#EFD9CE',
        success: '#E0E0E0',
        info: '#DEC0F1',
        danger: '#652F90',
        light: '#84A98C',
        lightgray: '#F5F5F5',
      },
      placeholderColor: {
        primary: '#616161',
        secondary: '#9B9B9B',
      },
      ringColor: {
        primary: '#652F90',
        secondary: '#3F3F3F',
      },
      ringOffsetColor: {
        primary: '#652F90',
      },
      stroke: {
        success: '#652F90'
      },
      fill: {
        success: '#652F90'
      },
      ringWidth: {
        3: '3px',
        5: '5px',
        7: '7px',
        8: '8px',
      },
      ringOffsetWidth: {
        3: '3px',
        5: '5px',
        7: '7px',
        8: '8px',
      },
      fontFamily: {
        poppins: 'Poppins',
        candara: 'Candara',
        avenir: 'AvenirNextLTPro-Regular',
        corbel: 'Corbel',
      },
    },
  },
  plugins: [],
};
